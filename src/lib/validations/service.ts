import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3, "Judul layanan minimal 3 karakter"),
  shortDesc: z.string().min(10, "Deskripsi singkat minimal 10 karakter"),
  fullDesc: z.string().min(20, "Deskripsi lengkap minimal 20 karakter"),
  materials: z.array(z.string()).min(1, "Minimal pilih 1 jenis material baja"),
  maxCapacity: z.string().optional(),
  imageUrl: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
  orderIndex: z.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
