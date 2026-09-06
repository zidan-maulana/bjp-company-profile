import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(4, "Kata sandi minimal 4 karakter"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const requestOtpSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export const resetPasswordOtpSchema = z
  .object({
    email: z.string().trim().email("Format email tidak valid"),
    otp: z.string().trim().length(6, "Kode OTP harus 6 digit angka"),
    newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi kata sandi minimal 8 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type ResetPasswordOtpInput = z.infer<typeof resetPasswordOtpSchema>;
