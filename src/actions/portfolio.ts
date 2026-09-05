"use server";

import { db } from "@/lib/db";
import { portfolioItemSchema, PortfolioItemInput } from "@/lib/validations/portfolio";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export async function getActivePortfolioAction(categoryFilter?: string) {
  try {
    const portfolio = await db.portfolioItem.findMany({
      where: {
        deletedAt: null,
        category: categoryFilter && categoryFilter !== "ALL" ? categoryFilter : undefined,
      },
      include: {
        images: {
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return { success: false, data: [] };
  }
}

export async function createPortfolioAction(input: PortfolioItemInput) {
  const validated = portfolioItemSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Input portofolio tidak valid." };
  }

  try {
    const slug = `${slugify(validated.data.title)}-${Date.now().toString().slice(-4)}`;
    const portfolio = await db.portfolioItem.create({
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
    return { success: true, data: portfolio, message: "Portofolio berhasil ditambahkan." };
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return { success: false, message: "Gagal membuat portofolio baru." };
  }
}

export async function softDeletePortfolioAction(id: string) {
  try {
    await db.portfolioItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true, message: "Portofolio berhasil dihapus (soft-delete)." };
  } catch (error) {
    console.error("Error soft deleting portfolio:", error);
    return { success: false, message: "Gagal menghapus portofolio." };
  }
}
