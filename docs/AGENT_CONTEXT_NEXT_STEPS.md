# 🤖 AGENT CONTEXT & PROMPT GUIDE (Untuk Agy / AI Assistant Haikal & Lukman)
**Project**: PT Baruna Jaya Plastik — Company Profile & Admin System  
**Framework**: Next.js 16.3.4 (App Router, Turbopack, React 19, TypeScript 5, Tailwind CSS v4)  
**Database & ORM**: PostgreSQL via Prisma ORM v6.19.3 + Local JSON Fail-Safe Data Layer  
**Penyusun**: Zidan (Front-End & App Layer Lead)

---

## 💡 Petunjuk Penggunaan untuk Haikal & Lukman
> Dokumen ini dibuat khusus sebagai **Konteks Prompt (System Prompt / Context)** untuk diberikan kepada **Antigravity (Agy) / AI Assistant** Anda masing-masing.
> Cukup buka chat dengan Agy Anda, lalu referensikan atau tempelkan dokumen ini:
> *"Agy, baca `docs/AGENT_CONTEXT_NEXT_STEPS.md` untuk memahami codebase dan jalankan tugas saya sesuai panduan di dalamnya."*

---

## 🏛️ Arsitektur Codebase Saat Ini (State of the Project)

1. **Front-End & UI (100% Selesai)**:
   * **Halaman Publik (`/`)**: Server Component di `src/app/page.tsx` memanggil `src/components/home/*` dan `src/components/layout/*`.
   * **Dashboard Admin (`/admin/*`)**: CRUD Services, Portfolio, Inquiries (Leads), dan Company Info di `src/app/admin/(dashboard)/*` dan `src/components/admin/*`.
   * **Desain & Interaksi**: Bebas error, responsif, bilingual ID/EN via `src/context/LanguageContext.tsx`.
   * **Build Status**: Lulus kompilasi Turbopack produksi (`npm run build` -> 0 Error, 0 Warning).

2. **Lapisan Data Ganda & Anti-Freeze (`src/lib/db.ts` & `src/lib/data/*`)**:
   * `isDatabaseOnline()` melakukan TCP socket probe kilat (500ms timeout) dengan in-memory cache 10 detik.
   * Modul data (`company.ts`, `services.ts`, `portfolio.ts`) otomatis fallback membaca file lokal (`data/*.json`) jika database offline, sehingga aplikasi tidak pernah mengalami TCP timeout freeze (~4 detik).

3. **Server Actions (`src/actions/*`)**:
   * Seluruh mutasi data menggunakan standar respon:
     ```typescript
     type ActionResponse<T> = { success: boolean; data?: T; error?: string };
     ```
   * Menggunakan `revalidatePath` untuk instant update.

---

## 📋 TRACK 1: PANDUAN KERJA UNTUK AGY-NYA LUKMAN (Backend Lead)

### 🎯 Sasaran:
Menghubungkan aplikasi ke live PostgreSQL (Neon.tech), menyinkronkan skema Prisma, dan melakukan seed data awal.

### 📂 File Kunci yang Relevan:
* `prisma/schema.prisma` (Skema 7 tabel: `User`, `Service`, `PortfolioItem`, `PortfolioImage`, `Inquiry`, `Testimonial`, `CompanyInfo`)
* `prisma/seed.ts` (Script pengisian data riil Baruna Jaya Plastik)
* `src/lib/db.ts` (Singleton Prisma Client & socket probe)
* `.env` (Konfigurasi `DATABASE_URL`)

### ⚡ Instruksi Kerja untuk Agy Lukman:

1. **Validasi Koneksi Database di `.env`**:
   Pastikan `DATABASE_URL` di `.env` mengarah ke Neon.tech PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"
   ```

2. **Jalankan Sinkronisasi Skema**:
   Eksekusi perintah terminal untuk mendorong skema Prisma ke Neon:
   ```bash
   npx prisma db push
   ```
   *Atau jika menggunakan workflow migrasi:*
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Jalankan Seeding Data**:
   Eksekusi script pembibitan data bawaan:
   ```bash
   npm run db:seed
   ```
   *Pastikan akun admin terbuat*: `admin@barunajayaplastik.com` / `admin123456`.

4. **Verifikasi**:
   Buka aplikasi dengan `npm run dev`, navigasikan ke `/admin`, dan pastikan status indikator database menampilkan **"Database Online"** (hijau) dan data layanan serta portofolio tampil dari Neon PostgreSQL.

5. **Batasan Kritis (DO NOTs)**:
   * ❌ JANGAN menghapus fungsi `isDatabaseOnline()` di `src/lib/db.ts`.
   * ❌ JANGAN mengubah tipe kolom atau nama tabel di `prisma/schema.prisma` yang dapat mematahkan kontrak Server Actions yang sudah berjalan.

---

## ☁️ TRACK 2: PANDUAN KERJA UNTUK AGY-NYA HAIKAL (DevOps & Storage R2)

### 🎯 Sasaran:
1. Menyediakan integrasi upload Cloudflare R2 dengan `@aws-sdk/client-s3`.
2. Menyambungkan URL hasil upload ke form admin (`CompanyClient.tsx` dan `PortfolioClient.tsx`).
3. Mengonfigurasi `next.config.ts` untuk mengizinkan domain gambar CDN.
4. Menyiapkan environment deployment Vercel.

### 📂 File Kunci yang Relevan:
* `src/lib/r2.ts` (Inisialisasi S3/R2 Client)
* `src/actions/upload.ts` (Server Action upload file media)
* `src/components/admin/CompanyClient.tsx` (Form Hero Background)
* `src/components/admin/PortfolioClient.tsx` (Form Portofolio Cetakan)
* `next.config.ts` (Konfigurasi `remotePatterns` untuk Next.js Image)
* `.env` & `.env.example`

### ⚡ Resep Implementasi Teknis untuk Agy Haikal:

#### 1. Install SDK AWS S3:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### 2. Buat Helper R2 Client (`src/lib/r2.ts`):
```typescript
import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const isR2Configured = Boolean(accountId && accessKeyId && secretAccessKey);

export const r2Client = isR2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "bjp-company-profile";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";
```

#### 3. Buat Upload Server Action (`src/actions/upload.ts`):
Buat Server Action yang menerima `FormData`, meng-upload file buffer ke Cloudflare R2 menggunakan `PutObjectCommand`, dan mengembalikan URL publik:
```typescript
"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from "@/lib/r2";

export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "File tidak ditemukan." };

    if (!isR2Configured || !r2Client) {
      return { success: false, error: "Cloudflare R2 belum dikonfigurasi di .env" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "webp";
    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
    return { success: true, url: publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengunggah ke R2" };
  }
}
```

#### 4. Sambungkan ke UI Form Admin:
* Di `src/components/admin/CompanyClient.tsx`:
  Pada fungsi `handleHeroBgUpload` atau saat menekan tombol Simpan, kirim file ke `uploadImageAction(formData)`, lalu simpan `result.url` ke `heroBgImage` sebelum memanggil `updateCompanyHeroAction`.
* Di `src/components/admin/PortfolioClient.tsx`:
  Pada fungsi submit portofolio, unggah file foto via `uploadImageAction(formData)`, lalu sertakan `result.url` ke dalam `createPortfolioAction` / `updatePortfolioAction`.

#### 5. Daftarkan Domain di `next.config.ts`:
Pastikan domain CDN Cloudflare R2 diizinkan di `images.remotePatterns` Next.js:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.barunajayaplastik.com",
      },
    ],
  },
};

export default nextConfig;
```

#### 6. Setup Deployment Vercel:
1. Hubungkan repo ke Vercel.
2. Tambahkan seluruh variabel lingkungan di **Project Settings > Environment Variables**:
   * `DATABASE_URL` (dari Lukman)
   * `RESEND_API_KEY` & `CONTACT_NOTIFICATION_EMAIL`
   * `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
3. Jalankan `npm run build` untuk memvalidasi build produksi.

---

## 🛡️ Aturan Emas untuk Seluruh AI Assistant (Golden Rules):
1. **Preserve UI Components**: Dilarang merombak layout visual atau desain Tailwind yang telah disetujui pengguna di `src/components/*`.
2. **Preserve Fallback Architecture**: Jangan merusak logika fail-safe `data/*.json` di `src/lib/data/*` agar developer lokal tetap bisa bekerja jika koneksi cloud terputus.
3. **Always Run Production Build**: Setiap selesai membuat perubahan kode, jalankan `npm run build` untuk memastikan tidak ada kesalahan kompilasi TypeScript atau lint error.
