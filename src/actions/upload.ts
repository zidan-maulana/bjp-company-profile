"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from "@/lib/r2";

export async function getPresignedUploadUrlAction(fileName: string, contentType: string) {
  try {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `portfolio/${Date.now()}-${sanitizedFileName}`;

    if (!process.env.R2_ACCOUNT_ID) {
      console.log("[MOCK R2 UPLOAD] Presigned URL requested for:", fileKey);
      return {
        success: true,
        uploadUrl: "https://mock-upload-url.local",
        publicUrl: `https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop`,
        fileKey,
        mock: true,
      };
    }

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const publicUrl = `${R2_PUBLIC_DOMAIN.replace(/\/$/, "")}/${fileKey}`;

    return {
      success: true,
      uploadUrl,
      publicUrl,
      fileKey,
    };
  } catch (error) {
    console.error("Error generating presigned upload URL:", error);
    return {
      success: false,
      message: "Gagal membuat URL upload gambar.",
    };
  }
}
