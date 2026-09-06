# 🚀 LAPORAN PEKERJAAN: TRACK 2 (DEVOPS & CLOUDFLARE R2 STORAGE)

**Project**: PT Baruna Jaya Plastik — Company Profile & Admin System  
**Pelaksana**: Haikal (DevOps & Storage Lead)  
**Branch**: `feat/r2-storage-deployment`  
**Status**: ✅ **100% Selesai, Terverifikasi, & Siap Merge ke `main`**

---

## 📌 Ringkasan Eksekutif

Pekerjaan pada **Track 2** berfokus pada penyediaan infrastruktur penyimpanan media berbasis cloud menggunakan **Cloudflare R2** (S3-compatible Object Storage), integrasi upload otomatis ke seluruh form dashboard Admin, konfigurasi whitelist CDN domain pada Next.js Image Optimization, serta penyiapan konfigurasi deployment ke platform **Vercel**.

Semua target pekerjaan telah diselesaikan, diuji secara lokal, dihubungkan ke bucket Cloudflare R2 live, dan lulus kompilasi build produksi Next.js 16 (`npm run build`).

---

## 🛠️ Detail Perubahan & Pekerjaan yang Telah Diselesaikan

### 1. Instalasi SDK Cloudflare R2 / AWS S3
* **Package**: `@aws-sdk/client-s3` dan `@aws-sdk/s3-request-presigner`
* **File**: `package.json`
* **Tujuan**: Menyediakan SDK resmi untuk berinteraksi dengan API Cloudflare R2 berbasis protokol AWS S3.

### 2. Inisialisasi Helper R2 Client
* **File**: `src/lib/r2.ts` (File Baru)
* **Fitur**:
  * Inisialisasi singleton `S3Client` ke endpoint `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`.
  * Safe configuration guard `isR2Configured`: Mencegah aplikasi crash jika environment variables belum dipasang.
  * Export konstanta `R2_BUCKET_NAME` dan `R2_PUBLIC_URL`.

### 3. Server Action Upload Media
* **File**: `src/actions/upload.ts` (File Baru)
* **Fitur**:
  * Fungsi `uploadImageAction(formData: FormData)` berjalan di sisi Server (Next.js Server Actions).
  * Validasi MIME type: Membatasi hanya format gambar yang diizinkan (`JPG`, `PNG`, `WebP`, `GIF`, `SVG`).
  * Validasi ukuran file: Maksimal 5MB per file.
  * Streaming buffer & pengiriman via `PutObjectCommand` ke Cloudflare R2.
  * Pengembalian URL publik CDN (`https://pub-xxxx.r2.dev/uploads/...`).

### 4. Integrasi Dashboard Admin
* **Form Profil & Hero Background** (`src/components/admin/CompanyClient.tsx`):
  * Handler upload otomatis memproses file foto baru langsung ke Cloudflare R2 via Server Action.
  * Dilengkapi status loading visual (`isUploadingBg`) dengan spinner interaktif pada tombol unggah.
  * Menyimpan URL publik R2 ke payload `heroBgImage` saat data website disimpan.
* **Form Portofolio Hasil Cetakan** (`src/components/admin/PortfolioClient.tsx`):
  * Pengunggahan file foto cetakan baru ke Cloudflare R2 sebelum penyimpanan record portofolio ke database.
  * Penanganan preview lokal yang instan sebelum submit.

### 5. Konfigurasi Image Domain Next.js
* **File**: `next.config.ts`
* **Fitur**:
  * Mendaftarkan wildcard pattern domain `**.r2.cloudflarestorage.com`, `**.r2.dev`, dan `cdn.barunajayaplastik.com` ke `images.remotePatterns` agar komponen `<Image />` Next.js dapat merender gambar CDN tanpa error keamanan.

### 6. Template Environment & Git Ignore
* **File**: `.env.example` (File Baru) & `.gitignore`
* **Fitur**:
  * Dokumentasi lengkap seluruh variabel lingkungan yang dibutuhkan sistem (Database, R2, Email Resend, dan App URL).
  * Pengecualian `.env.example` pada `.gitignore` sehingga template tetap terlacak di repositori.

### 7. Pengujian & Bukti Uji Live
* **Live R2 Testing**: Berhasil menguji upload gambar dari form admin ke bucket Cloudflare R2 (`uploads/1788713840549-ac5bwlu.png`) dengan status aktif dan public preview dapat diakses.
* **Build Verification**:
  ```bash
  npm run build
  # Hasil: 100% Lulus (0 Error, 0 Warning pada seluruh 7 rute aplikasi)
  ```

---

## 🔑 Rekap Environment Variables Lengkap

Berikut adalah variabel lingkungan yang siap digunakan untuk deployment ke **Vercel**:

```env
# 1. DATABASE (Neon PostgreSQL - Lukman)
DATABASE_URL="postgresql://neondb_owner:npg_7K5szqcxXjGE@ep-shy-night-b3wy2zmn-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# 2. STORAGE (Cloudflare R2 - Haikal)
R2_ACCOUNT_ID="1ee325a6c0921d432cd4e0cfa42d0d25"
R2_ACCESS_KEY_ID="4d9507db2270032fccb9a8d6ecbde4e8"
R2_SECRET_ACCESS_KEY="6c612b50d4549578f3ccb5587a6f39cc8f45ae83ba2f69798a7478c9c3ebe47a"
R2_BUCKET_NAME="bjp-company-profile"
R2_PUBLIC_URL="https://pub-bbda9f30bb9a48b78ade186682149e0b.r2.dev"

# 3. NOTIFIKASI EMAIL
RESEND_API_KEY="re_xxxx"
CONTACT_NOTIFICATION_EMAIL="barunajayaplastik.bjp@gmail.com"

# 4. APLIKASI
NEXT_PUBLIC_APP_URL="https://bjp-company-profile.vercel.app"
```

---

## 📋 Template Deskripsi Pull Request (PR)

Salin teks di bawah ini ke form Pull Request GitHub Anda:

```markdown
### 🚀 Pull Request: Cloudflare R2 Media Storage & Deployment Setup

#### 📝 Ringkasan Perubahan:
- [x] Instalasi `@aws-sdk/client-s3` dan `@aws-sdk/s3-request-presigner`.
- [x] Pembuatan helper R2 Client di `src/lib/r2.ts`.
- [x] Pembuatan Server Action upload media di `src/actions/upload.ts`.
- [x] Integrasi upload Hero Background di `src/components/admin/CompanyClient.tsx`.
- [x] Integrasi upload foto cetakan di `src/components/admin/PortfolioClient.tsx`.
- [x] Whitelist domain CDN & R2 di `next.config.ts`.
- [x] Penambahan `.env.example` dan template konfigurasi Vercel.
- [x] Validasi build produksi (`npm run build` -> 0 Error, 0 Warning).

#### 🧪 Pengujian:
- Live upload ke bucket R2 berhasil diverifikasi.
- Preview gambar publik aktif di subdomain `pub-*.r2.dev`.
```
