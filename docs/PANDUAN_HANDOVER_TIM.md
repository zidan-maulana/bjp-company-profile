# 📘 Panduan Handover Proyek & Petunjuk Kerja Tim
**Website Company Profile — PT Baruna Jaya Plastik**  
*Dokumentasi Resmi Serah Terima Pekerjaan Front-End & Panduan Langkah Lanjutan*

---

## 📌 Ringkasan Eksekutif (Untuk Seluruh Tim)
Pekerjaan di sisi **Front-End & Application Layer** yang dikerjakan oleh **Zidan** telah **100% SELESAI, LULUS UJI KOMPILASI PRODUKSI (Turbopack Build: 0 Error, 0 Warning)**, dan siap diserahterimakan untuk tahap database cloud live dan deployment.

Dokumen ini disusun untuk memberikan gambaran teknis mendalam tentang apa saja yang telah dibangun di dalam codebase, serta memberikan instruksi kerja terperinci bagi **Lukman** (Backend Lead) dan **Haikal** (DevOps & Storage).

---

## 🛠️ Bagian 1: Detail Implementasi Teknis yang Telah Diselesaikan (Technical Overview)

Berikut adalah ringkasan arsitektur teknis, pola data, dan sistem yang telah terpasang di dalam repositori:

### 1. Arsitektur Next.js 16 (App Router & Turbopack)
* **Pemisahan Server & Client Components**:
  * Seluruh halaman utama (`src/app/page.tsx`, `src/app/admin/(dashboard)/*/page.tsx`) diimplementasikan sebagai **React Server Components (RSC)** untuk melakukan data fetching langsung di server (SSR), memangkas *waterfall request*, dan mengoptimalkan SEO (*Core Web Vitals*).
  * Komponen interaktif (form, modal, tab switcher, drawer) diisolasi sebagai **Client Components (`"use client"`)** di `src/components/*`.
* **Kompilasi Turbopack Tanpa Error**:
  * Proyek telah divalidasi dengan `npm run build` menggunakan Turbopack Next.js 16.3.4. Seluruh rute statis (`○`) dan dinamis (`ƒ`) terkompilasi bersih tanpa *type error* TypeScript maupun *lint warning*.

### 2. Lapisan Data Ganda & Mekanisme Fail-Safe (*Resilience Architecture*)
* **Masalah Awal**: Koneksi TCP database lokal yang mati/terputus menyebabkan Next.js menggantung (*freeze*) selama 4.000–8.000 ms per navigasi admin karena menunggu TCP timeout bawaan driver PostgreSQL.
* **Solusi Teknis yang Diterapkan (`src/lib/db.ts`)**:
  * Dibuat fungsi probe kilat non-blocking `isDatabaseOnline(timeoutMs = 500)`. Fungsi ini membuka koneksi socket TCP murni ke port database (5432) dengan *hard timeout* 500ms dan menyimpan statusnya di memori cache selama **10 detik**.
  * Hasil: Waktu respons navigasi rute admin meningkat drastis dari **~4.100 ms menjadi ~130–320 ms**.
* **Dual-Mode Data Reader & Writer (`src/lib/data/*`)**:
  * `src/lib/data/company.ts`, `services.ts`, `portfolio.ts` mengadopsi pola fallback otomatis:
    * Jika database **ONLINE**: Data dibaca dan dimutasi langsung via **Prisma ORM** ke PostgreSQL.
    * Jika database **OFFLINE**: Sistem secara otomatis membaca dan menulis ke file snapshot lokal (`data/company.json`, `data/services.json`, `data/portfolio.json`).
  * Dampak: Pengembang dapat melanjutkan pekerjaan UI, pengujian form, dan demonstrasi aplikasi secara offline 100% tanpa perlu menyalakan database service.

### 3. Mutasi Data Type-Safe & Server Actions (`src/actions/*`)
* Seluruh operasi pengubahan data diisolasi ke dalam Server Actions:
  * `src/actions/company.ts`: Update profil, visi misi, hero background, dan narasi editorial.
  * `src/actions/services.ts`: CRUD layanan manufaktur dengan fitur *soft-delete* (`deletedAt`).
  * `src/actions/portfolio.ts`: CRUD portofolio cetakan mold dan multi-kategori.
  * `src/actions/inquiry.ts`: Form submission prospek klien publik + pengelolaan status lead (`NEW`, `CONTACTED`, `CLOSED`) dan *internal note*.
  * `src/actions/auth.ts`: Mekanisme login admin dan perubahan kata sandi berbasis *hash* `bcryptjs`.
* **Standarisasi Kontrak Respons**: Seluruh Server Actions mengembalikan kontrak seragam:
  ```typescript
  type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
  };
  ```
* **Cache Revalidation**: Menggunakan `revalidatePath('/', 'page')` dan `revalidatePath('/admin/*', 'page')` sehingga data terbarui seketika (*instant UI update*).

### 4. Lapisan Validasi Terpusat (*Unified Validation Layer* — Zod)
* Menggunakan Zod di `src/lib/validations/*` (`company.ts`, `service.ts`, `portfolio.ts`, `inquiry.ts`, `auth.ts`).
* Validasi dijalankan dua kali (*defense-in-depth*):
  1. *Client-side*: Memvalidasi kelengkapan form, format email, batasan ukuran file (< 5MB) sebelum request dikirim.
  2. *Server-side*: Memvalidasi payload Server Actions sebelum masuk ke query database atau JSON fallback.

### 5. Sistem Bilingual i18n (*Client-Side React Context*)
* Diterapkan sistem multi-bahasa global melalui `src/context/LanguageContext.tsx` dan kamus kamus terpusat `src/lib/translations.ts`.
* Mendukung pergantian instan antara **Bahasa Indonesia (ID 🇮🇩)** dan **English (EN 🇬🇧)** untuk seluruh elemen teks halaman publik tanpa *page reload*.

### 6. Kontainerisasi Database Lokal (*Docker Compose*)
* Disediakan file `docker-compose.yml` yang mengonfigurasi PostgreSQL 16 Alpine di port 5432 dengan volume penyimpanan persisten `bjp_pgdata` dan kredensial default (`postgres:postgres`).

---

## 🎯 Bagian 2: Panduan Kerja untuk LUKMAN (Backend Lead)

**Tujuan**: Menghubungkan aplikasi ke database live cloud (Neon.tech), menjalankan migrasi Prisma, dan memastikan seed data terinjeksi.

### Langkah demi Langkah Eksekusi:

1. **Ambil Connection String Neon.tech**:
   * Lukman telah memiliki database di Neon.tech (Region: Singapore).
   * Dapatkan URL koneksi berformat pooled:
     `postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require`

2. **Perbarui `.env`**:
   * Masukkan URL tersebut pada variabel `DATABASE_URL` di file `.env`.

3. **Sinkronisasi Skema & Injeksi Data (Terminal)**:
   ```bash
   # Mendorong skema Prisma ke database Neon
   npx prisma db push

   # Menjalankan script seeding data default (Profil, Layanan, Portofolio, Admin)
   npm run db:seed
   ```
   > **Akun Admin Default**:
   > * Email: `admin@barunajayaplastik.com`
   > * Password: `admin123456`

4. **Kirimkan `DATABASE_URL` ke Haikal**:
   * Berikan string koneksi tersebut kepada Haikal untuk dipasang pada *Environment Variables* di dashboard hosting Vercel.

---

## 🚀 Bagian 3: Panduan Kerja untuk HAIKAL (DevOps, Storage R2 & Deployment)

**Tujuan**: Menyediakan bucket Cloudflare R2 untuk penyimpanan media gambar, membuat endpoint/action upload, mengonfigurasi Resend email, dan mendeploy aplikasi ke Vercel.

### Langkah demi Langkah Eksekusi:

1. **Setup Bucket Cloudflare R2**:
   * Buat bucket baru bernama `bjp-company-profile` di Cloudflare Dashboard.
   * Aktifkan **Public Access** (atau hubungkan ke custom domain CDN, misal: `cdn.barunajayaplastik.com` atau subdomain bawaan `pub-xxx.r2.dev`).
   * Buat R2 API Token dengan hak akses **Object Read & Write**.

2. **Lengkapi `.env` & Environment Vercel**:
   ```env
   # Cloudflare R2 Credentials
   R2_ACCOUNT_ID="your_account_id"
   R2_ACCESS_KEY_ID="your_access_key_id"
   R2_SECRET_ACCESS_KEY="your_secret_access_key"
   R2_BUCKET_NAME="bjp-company-profile"
   R2_PUBLIC_URL="https://cdn.barunajayaplastik.com"

   # Email Service (Resend)
   RESEND_API_KEY="re_sample_key"
   CONTACT_NOTIFICATION_EMAIL="barunajayaplastik.bjp@gmail.com"
   ```

3. **Integrasi Upload Handler / Presigned URL**:
   * Pasang SDK: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
   * Siapkan client R2 di `src/lib/r2.ts` dan Server Action upload di `src/actions/upload.ts` (sudah ada draft referensinya di branch `origin/feat/backend-setup`).
   * Hubungkan hasil upload (URL CDN) ke input file di `CompanyClient.tsx` (Hero Background) dan `PortfolioClient.tsx` (Foto Portofolio).

4. **Deploy ke Vercel & Konfigurasi Domain**:
   * Hubungkan repo GitHub ke Vercel.
   * Salin seluruh variabel di `.env` ke **Vercel Settings > Environment Variables**.
   * Jalankan deploy dan sambungkan domain kustom `barunajayaplastik.com`.

---

## 🏁 Matriks Serah Terima Tim

| Anggota Tim | Peran | Scope Kerja | Status |
| :--- | :--- | :--- | :---: |
| **Zidan** | Front-End & App Layer | UI/UX, Halaman Publik, Panel Admin, Dual Data Layer, Fail-safe Engine, Form Zod, Turbopack Build | **✅ 100% SELESAI** |
| **Lukman** | Backend Lead | Setup Neon.tech, Prisma Push, Seeding Data Live | **⏳ Siap Dijalankan** |
| **Haikal** | DevOps & Storage | Cloudflare R2 Bucket, Upload Action Hookup, Resend API, Vercel Deploy | **⏳ Siap Dijalankan** |
