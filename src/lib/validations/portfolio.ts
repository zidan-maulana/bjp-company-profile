import { z } from "zod";

export const portfolioImageSchema = z.object({
  imageUrl: z.string().url("URL gambar tidak valid"),
  caption: z.string().optional(),
  orderIndex: z.number().int().default(0),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(3, "Judul portofolio minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  material: z.string().min(2, "Material baja wajib diisi"),
  category: z.string().min(2, "Kategori wajib diisi"),
  clientName: z.string().optional(),
  images: z.array(portfolioImageSchema).default([]),
});

export type PortfolioItemInput = z.infer<typeof portfolioItemSchema>;
