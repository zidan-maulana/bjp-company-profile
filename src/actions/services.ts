"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { serviceSchema, ServiceInput } from "@/lib/validations/service";
import { getActiveServices, saveServicesLocal, ServiceItemData } from "@/lib/data/services";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
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

  const slug = slugify(validated.data.title);
  const newService: ServiceItemData = {
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

  try {
    // 1. Save to local storage first
    const current = await getActiveServices();
    await saveServicesLocal([...current, newService]);

    // 2. Try saving to DB if available
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
      newService.id = dbRecord.id;
    } catch (dbErr) {
      console.warn("DB create service failed (using local JSON persistence):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, data: newService, message: "Layanan berhasil ditambahkan." };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, message: "Gagal menambah layanan baru." };
  }
}

export async function updateServiceAction(id: string, input: ServiceInput) {
  const validated = serviceSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input layanan tidak valid." };
  }

  const slug = slugify(validated.data.title);

  try {
    // 1. Update local storage first
    const current = await getActiveServices();
    const updatedList = current.map((s) =>
      s.id === id
        ? {
            ...s,
            title: validated.data.title,
            slug,
            subtitle: validated.data.shortDesc,
            shortDesc: validated.data.shortDesc,
            desc: validated.data.fullDesc,
            fullDesc: validated.data.fullDesc,
            materials: validated.data.materials,
            capabilities: validated.data.materials,
            maxCapacity: validated.data.maxCapacity || null,
            imageUrl: validated.data.imageUrl || null,
            orderIndex: validated.data.orderIndex,
          }
        : s
    );
    await saveServicesLocal(updatedList);

    const updatedItem = updatedList.find((s) => s.id === id);

    // 2. Try updating DB if available
    try {
      await db.service.update({
        where: { id },
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
    } catch (dbErr) {
      console.warn("DB update service failed (using local JSON persistence):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, data: updatedItem, message: "Layanan berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, message: "Gagal mengedit layanan." };
  }
}

export async function softDeleteServiceAction(id: string) {
  try {
    // 1. Delete from local storage
    const current = await getActiveServices();
    const filtered = current.filter((s) => s.id !== id);
    await saveServicesLocal(filtered);

    // 2. Try DB soft delete
    try {
      await db.service.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (dbErr) {
      console.warn("DB soft delete service failed (using local JSON persistence):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, message: "Layanan berhasil dihapus." };
  } catch (error) {
    console.error("Error soft deleting service:", error);
    return { success: false, message: "Gagal menghapus layanan." };
  }
}
