"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { portfolioItemSchema, PortfolioItemInput } from "@/lib/validations/portfolio";
import { getActivePortfolio, savePortfolioLocal, PortfolioItemRecord } from "@/lib/data/portfolio";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
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

  const slug = `${slugify(validated.data.title)}-${Date.now().toString().slice(-4)}`;
  const newItem: PortfolioItemRecord = {
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

  try {
    // 1. Save to local storage first
    const current = await getActivePortfolio();
    await savePortfolioLocal([newItem, ...current]);

    // 2. Try saving to DB if available
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
      newItem.id = dbItem.id;
    } catch (dbErr) {
      console.warn("DB create portfolio failed (using local JSON persistence):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true, data: newItem, message: "Portofolio berhasil ditambahkan dan landing page diperbarui." };
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return { success: false, message: "Gagal membuat portofolio baru." };
  }
}

export async function updatePortfolioAction(id: string, input: PortfolioItemInput) {
  const validated = portfolioItemSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input portofolio tidak valid." };
  }

  const slug = `${slugify(validated.data.title)}-${id.slice(-4)}`;

  try {
    // 1. Update local storage first
    const current = await getActivePortfolio();
    const isExisting = current.some((item) => item.id === id);

    let updatedList: PortfolioItemRecord[];
    if (isExisting) {
      updatedList = current.map((item) =>
        item.id === id
          ? {
              ...item,
              title: validated.data.title,
              slug,
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
            }
          : item
      );
    } else {
      const newItem: PortfolioItemRecord = {
        id,
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
      updatedList = [newItem, ...current];
    }
    await savePortfolioLocal(updatedList);

    const updatedItem = updatedList.find((item) => item.id === id);

    // 2. Try DB update if available
    try {
      const existingDb = await db.portfolioItem.findUnique({
        where: { id },
        include: { images: true },
      });

      if (existingDb) {
        await db.portfolioImage.deleteMany({
          where: { portfolioItemId: id },
        });

        await db.portfolioItem.update({
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
      }
    } catch (dbErr) {
      console.warn("DB update portfolio failed (using local JSON persistence):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true, data: updatedItem, message: "Portofolio cetakan berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return { success: false, message: "Gagal memperbarui data portofolio." };
  }
}

export async function softDeletePortfolioAction(id: string) {
  try {
    // 1. Remove from local storage
    const current = await getActivePortfolio();
    const filtered = current.filter((item) => item.id !== id);
    await savePortfolioLocal(filtered);

    // 2. Try DB soft delete if available
    try {
      if (!id.startsWith("seed-")) {
        await db.portfolioItem.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      }
    } catch (dbErr) {
      console.warn("DB soft delete portfolio failed (using local JSON persistence):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true, message: "Portofolio berhasil dihapus dari galeri dan landing page." };
  } catch (error) {
    console.error("Error soft deleting portfolio:", error);
    return { success: false, message: "Gagal menghapus portofolio." };
  }
}
