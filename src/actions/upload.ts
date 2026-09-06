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
  "image/jpg",
  "image/pjpeg",
  "image/jfif",
  "image/png",
  "image/x-png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "svg", "jfif"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImageAction(formData: FormData): Promise<UploadResponse> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "File tidak ditemukan dalam form data." };
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type);
    const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

    if (!isMimeValid && !isExtValid) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap gunakan format JPG, PNG, WebP, GIF, atau SVG.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file melebihi batas maksimal 5MB." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || (ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg");

    // Jika Cloudflare R2 terkonfigurasi, unggah ke Cloudflare R2
    if (isR2Configured && r2Client) {
      try {
        const cleanExt = ext || "jpg";
        const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;

        await r2Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
          })
        );

        const publicUrl = R2_PUBLIC_URL
          ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
          : `https://${R2_BUCKET_NAME}.r2.dev/${key}`;

        return { success: true, url: publicUrl };
      } catch (r2Err) {
        console.warn("R2 Upload failed, falling back to database DataURL storage:", r2Err);
        // Fallback ke Base64 Data URL agar simpan data tetap berhasil 100%
        const base64 = buffer.toString("base64");
        return { success: true, url: `data:${mimeType};base64,${base64}` };
      }
    }

    // Jika R2 belum dikonfigurasi, gunakan Base64 Data URL
    const base64 = buffer.toString("base64");
    return { success: true, url: `data:${mimeType};base64,${base64}` };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal memproses unggahan foto.";
    console.error("Upload error:", err);
    return { success: false, error: errorMessage };
  }
}

