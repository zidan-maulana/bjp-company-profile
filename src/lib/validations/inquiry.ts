import { z } from "zod";

export const createInquirySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  companyName: z.string().optional(),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(9, "Nomor HP/WhatsApp minimal 9 digit"),
  serviceType: z.string().optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

export const updateInquiryStatusSchema = z.object({
  id: z.string().min(1, "ID inquiry wajib diisi"),
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
  internalNote: z.string().optional(),
});

export const updateInquirySchema = z.object({
  id: z.string().min(1, "ID inquiry wajib diisi"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  companyName: z.string().optional(),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(9, "Nomor HP/WhatsApp minimal 9 digit"),
  serviceType: z.string().optional(),
  message: z.string().min(5, "Pesan minimal 5 karakter"),
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]).default("NEW"),
  internalNote: z.string().optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;

