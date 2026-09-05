# Dokumentasi Handover Backend & Arsitektur Sistem
**Project**: Company Profile Website — Baruna Jaya Plastik  
**Penyusun**: Lukman (Backend Lead)  
**Terakhir Diperbarui**: 5 September 2026  

---

## 1. Status Penyelesaian Backend (100% Selesai)

Seluruh modul backend core, infrastruktur autentikasi admin, dan upload storage Cloudflare R2 **sudah 100% selesai dan terverifikasi**. Kode telah ditest dan lulus pengujian kompilasi produksi Next.js Turbopack (`npm run build` — 0 Error).

### Item yang Sudah Selesai (100% Ready):
* ✅ **Inisialisasi Project**: Framework Next.js App Router + TypeScript + Tailwind CSS.
* ✅ **Database Engine & ORM**: Prisma ORM (v6.19.3) tersambung ke PostgreSQL.
* ✅ **Desain Skema ERD**: 7 Tabel lengkap (`User`, `Service`, `PortfolioItem`, `PortfolioImage`, `Inquiry`, `Testimonial`, `CompanyInfo`).
* ✅ **Fitur Soft-Delete**: Kolom `deletedAt` pada katalog layanan dan portofolio untuk mencegah kehilangan data produksi.
* ✅ **Autentikasi Admin (Auth.js / NextAuth v5)**:
  * Setup handler di `src/lib/auth.ts` dengan Credentials Provider (`bcrypt` password hash check ke database).
  * Proteksi Middleware di `src/middleware.ts` untuk mengamankan seluruh rute `/admin/*` (auto-redirect ke `/admin/login` jika unauthenticated).
* ✅ **Cloudflare R2 Direct Upload**:
  * Action `getPresignedUploadUrlAction` di `src/actions/upload.ts` untuk meng-generate Presigned URL (Direct Upload browser-to-bucket S3/R2).
* ✅ **Kontrak Validasi (Zod)**: Schema terpusat di `src/lib/validations/` (`inquiry.ts`, `service.ts`, `portfolio.ts`, `auth.ts`).
* ✅ **Server Actions (API Engine)**:
  * Form submission `submitInquiryAction` + Notifikasi email instan (Resend API dengan mock fallback).
  * Pengelolaan status lead `updateInquiryStatusAction` (`NEW`, `CONTACTED`, `CLOSED`).
  * CRUD Katalog Layanan & Soft-delete (`services.ts`).
  * CRUD Portofolio Multi-Foto & Soft-delete (`portfolio.ts`).
  * Pengelolaan Profil Perusahaan Singleton & Testimoni (`company.ts`).
* ✅ **Data Seed Script**: Script pembibitan data domain asli Baruna Jaya Plastik di `prisma/seed.ts`.

---

## 2. Struktur Folder & Kode Backend Final

```text
bjp-company-profile/
├── docs/
│   └── BACKEND_HANDOVER.md       <-- Dokumen konteks tim ini
├── prisma/
│   ├── schema.prisma             <-- Schema database utama
│   └── seed.ts                   <-- Script seeding data dummy realistis
├── src/
│   ├── actions/                  <-- Server Actions (Backend Logic)
│   │   ├── company.ts            <-- Action profil perusahaan & testimoni
│   │   ├── inquiry.ts            <-- Action form kontak & status lead
│   │   ├── portfolio.ts          <-- Action portofolio multi-foto
│   │   ├── services.ts           <-- Action layanan molding
│   │   └── upload.ts             <-- Presigned URL Cloudflare R2 generator
│   ├── app/
│   │   └── api/auth/[...nextauth]/route.ts  <-- NextAuth API Handler
│   ├── lib/
│   │   ├── auth.ts               <-- Konfigurasi Auth.js / NextAuth v5
│   │   ├── db.ts                 <-- Singleton Prisma client
│   │   ├── email.ts              <-- Helper pengiriman email via Resend
│   │   ├── r2.ts                 <-- Client Cloudflare R2 / S3 Client
│   │   └── validations/          <-- Zod Schemas (Kontrak data Zidan & Lukman)
│   │       ├── auth.ts
│   │       ├── inquiry.ts
│   │       ├── portfolio.ts
│   │       └── service.ts
│   └── middleware.ts             <-- Proteksi route dashboard /admin/*
├── .env.example                  <-- Template variabel lingkungan
└── package.json                  <-- Terkonfigurasi script "npm run db:seed"
```

---

## 3. Cara Meng-onlinekan Database Neon.tech (Petunjuk Lukman)

1. Buka [neon.tech](https://neon.tech), buat project bernama `bjp-company-profile` (pilih region **Singapore**).
2. Copy `DATABASE_URL` (Pooled Connection) dan paste ke `.env`.
3. Jalankan di terminal:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```
4. Akun Admin Default setelah seed:
   * **Email**: `admin@barunajayaplastik.com`
   * **Password**: `admin123456`
