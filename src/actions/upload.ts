"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from "@/lib/r2";

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImageAction(formData: FormData): Promise<UploadResponse> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "File tidak ditemukan dalam form data." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap gunakan format JPG, PNG, WebP, GIF, atau SVG.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file melebihi batas maksimal 5MB." };
    }

    if (!isR2Configured || !r2Client) {
      return {
        success: false,
        error: "Cloudflare R2 belum dikonfigurasi di .env (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "webp";
    const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
      : `https://${R2_BUCKET_NAME}.r2.dev/${key}`;

    return { success: true, url: publicUrl };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal mengunggah gambar ke Cloudflare R2.";
    console.error("Upload to R2 error:", err);
    return { success: false, error: errorMessage };
  }
}
