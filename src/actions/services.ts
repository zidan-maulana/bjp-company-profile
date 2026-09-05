"use server";

import { db } from "@/lib/db";
import { serviceSchema, ServiceInput } from "@/lib/validations/service";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export async function getActiveServicesAction() {
  try {
    const services = await db.service.findMany({
      where: { deletedAt: null },
      orderBy: { orderIndex: "asc" },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { success: false, data: [] };
  }
}

export async function createServiceAction(input: ServiceInput) {
  const validated = serviceSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input layanan tidak valid." };
  }

  try {
    const slug = slugify(validated.data.title);
    const service = await db.service.create({
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
    return { success: true, data: service, message: "Layanan berhasil ditambahkan." };
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

  try {
    const updated = await db.service.update({
      where: { id },
      data: {
        title: validated.data.title,
        slug: slugify(validated.data.title),
        shortDesc: validated.data.shortDesc,
        fullDesc: validated.data.fullDesc,
        materials: validated.data.materials,
        maxCapacity: validated.data.maxCapacity || null,
        imageUrl: validated.data.imageUrl || null,
        orderIndex: validated.data.orderIndex,
      },
    });
    return { success: true, data: updated, message: "Layanan berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, message: "Gagal mengedit layanan." };
  }
}

export async function softDeleteServiceAction(id: string) {
  try {
    await db.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true, message: "Layanan berhasil dihapus (soft-delete)." };
  } catch (error) {
    console.error("Error soft deleting service:", error);
    return { success: false, message: "Gagal menghapus layanan." };
  }
}
