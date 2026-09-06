"use server";

import { db, isDatabaseOnline } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { serviceSchema, ServiceInput } from "@/lib/validations/service";
import { getActiveServices, saveServicesLocal, ServiceItemData } from "@/lib/data/services";

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "layanan";
}

export async function getActiveServicesAction() {
  const data = await getActiveServices();
  return { success: true, data };
}

export async function createServiceAction(input: ServiceInput) {
  const validated = serviceSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input layanan tidak valid." };
  }

  const slug = `${slugify(validated.data.title)}-${Math.random().toString(36).substring(2, 7)}`;
  const isOnline = await isDatabaseOnline();
  let createdService: ServiceItemData;

  if (isOnline) {
    try {
      const dbRecord = await db.service.create({
        data: {
          title: validated.data.title,
          slug,
          shortDesc: validated.data.shortDesc,
          fullDesc: validated.data.fullDesc,
          materials: validated.data.materials,
          maxCapacity: validated.data.maxCapacity || null,
          imageUrl: validated.data.imageUrl || null,
          orderIndex: validated.data.orderIndex,
        },
      });

      createdService = {
        id: dbRecord.id,
        slug: dbRecord.slug,
        title: dbRecord.title,
        subtitle: dbRecord.shortDesc,
        shortDesc: dbRecord.shortDesc,
        desc: dbRecord.fullDesc,
        fullDesc: dbRecord.fullDesc,
        materials: dbRecord.materials,
        capabilities: dbRecord.materials,
        maxCapacity: dbRecord.maxCapacity,
        imageUrl: dbRecord.imageUrl,
        orderIndex: dbRecord.orderIndex,
      };
    } catch (dbErr) {
      console.error("DB create service failed:", dbErr);
      return {
        success: false,
        message: dbErr instanceof Error ? `Gagal menyimpan layanan ke database: ${dbErr.message}` : "Gagal menambah layanan baru.",
      };
    }
  } else {
    createdService = {
      id: `svc_${Date.now()}`,
      slug,
      title: validated.data.title,
      subtitle: validated.data.shortDesc,
      shortDesc: validated.data.shortDesc,
      desc: validated.data.fullDesc,
      fullDesc: validated.data.fullDesc,
      materials: validated.data.materials,
      capabilities: validated.data.materials,
      maxCapacity: validated.data.maxCapacity || null,
      imageUrl: validated.data.imageUrl || null,
      orderIndex: validated.data.orderIndex,
    };
  }

  // Backup sync to local JSON
  try {
    const current = await getActiveServices();
    await saveServicesLocal([...current.filter((s) => s.id !== createdService.id), createdService]);
  } catch {
    // Read-only filesystem
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
  return { success: true, data: createdService, message: "Layanan berhasil ditambahkan." };
}

export async function updateServiceAction(id: string, input: ServiceInput) {
  const validated = serviceSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input layanan tidak valid." };
  }

  const isOnline = await isDatabaseOnline();
  let updatedService: ServiceItemData | null = null;

  if (isOnline) {
    try {
      const dbRecord = await db.service.update({
        where: { id },
        data: {
          title: validated.data.title,
          shortDesc: validated.data.shortDesc,
          fullDesc: validated.data.fullDesc,
          materials: validated.data.materials,
          maxCapacity: validated.data.maxCapacity || null,
          imageUrl: validated.data.imageUrl || null,
          orderIndex: validated.data.orderIndex,
        },
      });

      updatedService = {
        id: dbRecord.id,
        slug: dbRecord.slug,
        title: dbRecord.title,
        subtitle: dbRecord.shortDesc,
        shortDesc: dbRecord.shortDesc,
        desc: dbRecord.fullDesc,
        fullDesc: dbRecord.fullDesc,
        materials: dbRecord.materials,
        capabilities: dbRecord.materials,
        maxCapacity: dbRecord.maxCapacity,
        imageUrl: dbRecord.imageUrl,
        orderIndex: dbRecord.orderIndex,
      };
    } catch (dbErr) {
      console.error("DB update service failed:", dbErr);
      return {
        success: false,
        message: dbErr instanceof Error ? `Gagal mengupdate database: ${dbErr.message}` : "Gagal mengedit layanan.",
      };
    }
  } else {
    updatedService = {
      id,
      slug: `${slugify(validated.data.title)}-${id.slice(-4)}`,
      title: validated.data.title,
      subtitle: validated.data.shortDesc,
      shortDesc: validated.data.shortDesc,
      desc: validated.data.fullDesc,
      fullDesc: validated.data.fullDesc,
      materials: validated.data.materials,
      capabilities: validated.data.materials,
      maxCapacity: validated.data.maxCapacity || null,
      imageUrl: validated.data.imageUrl || null,
      orderIndex: validated.data.orderIndex,
    };
  }

  // Backup sync to local JSON
  try {
    const current = await getActiveServices();
    const updatedList = current.map((s) => (s.id === id && updatedService ? updatedService : s));
    await saveServicesLocal(updatedList);
  } catch {
    // Read-only filesystem
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
  return { success: true, data: updatedService, message: "Layanan berhasil diperbarui." };
}

export async function softDeleteServiceAction(id: string) {
  try {
    const isOnline = await isDatabaseOnline();
    if (isOnline) {
      try {
        await db.service.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      } catch (dbErr) {
        console.warn("DB soft delete service failed:", dbErr);
      }
    }

    try {
      const current = await getActiveServices();
      const filtered = current.filter((s) => s.id !== id);
      await saveServicesLocal(filtered);
    } catch {
      // Read-only filesystem
    }

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, message: "Layanan berhasil dihapus." };
  } catch (error) {
    console.error("Error soft deleting service:", error);
    return { success: false, message: "Gagal menghapus layanan." };
  }
}

