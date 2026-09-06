"use server";

import { db, isDatabaseOnline } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { portfolioItemSchema, PortfolioItemInput } from "@/lib/validations/portfolio";
import { getActivePortfolio, savePortfolioLocal, PortfolioItemRecord } from "@/lib/data/portfolio";

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "cetakan-mold";
}

export async function getActivePortfolioAction(categoryFilter?: string) {
  const data = await getActivePortfolio(categoryFilter);
  return { success: true, data };
}

export async function createPortfolioAction(input: PortfolioItemInput) {
  const validated = portfolioItemSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input portofolio tidak valid." };
  }

  const slug = `${slugify(validated.data.title)}-${Math.random().toString(36).substring(2, 7)}`;
  const isOnline = await isDatabaseOnline();
  let createdItem: PortfolioItemRecord;

  if (isOnline) {
    try {
      const dbItem = await db.portfolioItem.create({
        data: {
          title: validated.data.title,
          slug,
          description: validated.data.description,
          material: validated.data.material,
          category: validated.data.category,
          clientName: validated.data.clientName || null,
          images: {
            create: validated.data.images.map((img, idx) => ({
              imageUrl: img.imageUrl,
              caption: img.caption || null,
              orderIndex: img.orderIndex ?? idx,
            })),
          },
        },
        include: { images: true },
      });

      createdItem = {
        id: dbItem.id,
        slug: dbItem.slug,
        title: dbItem.title,
        description: dbItem.description,
        material: dbItem.material,
        category: dbItem.category,
        clientName: dbItem.clientName,
        images: dbItem.images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          caption: img.caption,
          orderIndex: img.orderIndex,
        })),
      };
    } catch (dbErr) {
      console.error("DB create portfolio failed:", dbErr);
      return {
        success: false,
        message: dbErr instanceof Error ? `Gagal menyimpan ke database: ${dbErr.message}` : "Gagal menyimpan portofolio ke database.",
      };
    }
  } else {
    createdItem = {
      id: `item_${Date.now()}`,
      slug,
      title: validated.data.title,
      description: validated.data.description,
      material: validated.data.material,
      category: validated.data.category,
      clientName: validated.data.clientName || null,
      images: validated.data.images.map((img, idx) => ({
        id: `img_${Date.now()}_${idx}`,
        imageUrl: img.imageUrl,
        caption: img.caption || null,
        orderIndex: img.orderIndex ?? idx,
      })),
    };
  }

  // Backup sync to local JSON (gracefully skipped if read-only filesystem on Vercel)
  try {
    const current = await getActivePortfolio();
    await savePortfolioLocal([createdItem, ...current.filter((it) => it.id !== createdItem.id)]);
  } catch {
    // Read-only filesystem in serverless
  }

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true, data: createdItem, message: "Portofolio berhasil ditambahkan dan landing page diperbarui." };
}

export async function updatePortfolioAction(id: string, input: PortfolioItemInput) {
  const validated = portfolioItemSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input portofolio tidak valid." };
  }

  const isOnline = await isDatabaseOnline();
  let updatedItem: PortfolioItemRecord | null = null;

  if (isOnline) {
    try {
      await db.portfolioImage.deleteMany({
        where: { portfolioItemId: id },
      });

      const dbItem = await db.portfolioItem.update({
        where: { id },
        data: {
          title: validated.data.title,
          description: validated.data.description,
          material: validated.data.material,
          category: validated.data.category,
          clientName: validated.data.clientName || null,
          images: {
            create: validated.data.images.map((img, idx) => ({
              imageUrl: img.imageUrl,
              caption: img.caption || null,
              orderIndex: img.orderIndex ?? idx,
            })),
          },
        },
        include: { images: true },
      });

      updatedItem = {
        id: dbItem.id,
        slug: dbItem.slug,
        title: dbItem.title,
        description: dbItem.description,
        material: dbItem.material,
        category: dbItem.category,
        clientName: dbItem.clientName,
        images: dbItem.images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          caption: img.caption,
          orderIndex: img.orderIndex,
        })),
      };
    } catch (dbErr) {
      console.error("DB update portfolio failed:", dbErr);
      return {
        success: false,
        message: dbErr instanceof Error ? `Gagal memperbarui database: ${dbErr.message}` : "Gagal memperbarui data portofolio.",
      };
    }
  } else {
    updatedItem = {
      id,
      slug: `${slugify(validated.data.title)}-${id.slice(-4)}`,
      title: validated.data.title,
      description: validated.data.description,
      material: validated.data.material,
      category: validated.data.category,
      clientName: validated.data.clientName || null,
      images: validated.data.images.map((img, idx) => ({
        id: `img_${Date.now()}_${idx}`,
        imageUrl: img.imageUrl,
        caption: img.caption || null,
        orderIndex: img.orderIndex ?? idx,
      })),
    };
  }

  // Backup sync to local JSON
  try {
    const current = await getActivePortfolio();
    const updatedList = current.map((item) => (item.id === id && updatedItem ? updatedItem : item));
    await savePortfolioLocal(updatedList);
  } catch {
    // Read-only filesystem in serverless
  }

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true, data: updatedItem, message: "Portofolio cetakan berhasil diperbarui." };
}

export async function softDeletePortfolioAction(id: string) {
  try {
    const isOnline = await isDatabaseOnline();
    if (isOnline) {
      try {
        await db.portfolioItem.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      } catch (dbErr) {
        console.warn("DB soft delete portfolio failed:", dbErr);
      }
    }

    try {
      const current = await getActivePortfolio();
      const filtered = current.filter((item) => item.id !== id);
      await savePortfolioLocal(filtered);
    } catch {
      // Read-only filesystem
    }

    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true, message: "Portofolio berhasil dihapus dari galeri dan landing page." };
  } catch (error) {
    console.error("Error soft deleting portfolio:", error);
    return { success: false, message: "Gagal menghapus portofolio." };
  }
}

