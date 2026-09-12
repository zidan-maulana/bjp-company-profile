# Dokumentasi Tech Stack - Baruna Jaya Plastik Company Profile & CMS

Dokumen ini menyajikan rincian teknis lengkap mengenai seluruh teknologi, pustaka (*library*), arsitektur sistem, basis data, *storage*, hingga infrastruktur *deployment* yang digunakan dalam pembangunan website profil perusahaan dan sistem manajemen konten (CMS) **PT Baruna Jaya Plastik**.

---

## 1. Ringkasan Arsitektur Sistem

Sistem ini dibangun dengan arsitektur **Modern Full-Stack Serverless Web Application** yang mengedepankan performa tinggi, keandalan (*high availability*), keamanan data B2B, serta kemudahan pengelolaan konten secara mandiri oleh tim operasional PT Baruna Jaya Plastik.

```mermaid
graph TD
    Client[Browser / Pengunjung & Admin] -->|HTTPS| Vercel[Vercel Edge Network / Serverless]
    Vercel -->|App Router & Server Actions| NextApp[Next.js 16 + React 19 App]
    NextApp -->|Prisma ORM| NeonDB[(Neon Serverless PostgreSQL)]
    NextApp -->|S3 API / AWS SDK v3| CloudflareR2[(Cloudflare R2 Storage CDN)]
    NextApp -->|Transactional API| Resend[Resend Email Service]
    NextApp -->|Fail-safe Fallback| DBStorage[Neon Base64 Direct Persistence]
```

---

## 2. Core Framework & Runtime

| Komponen | Versi | Peran & Alasan Penggunaan |
| :--- | :---: | :--- |
| **Next.js** | `16.3.4` | Framework utama berbasis **App Router**. Menyediakan *hybrid rendering* (Server Components untuk kecepatan SEO dan Client Components untuk interaktivitas CMS), serta **Server Actions** untuk mutasi data backend yang aman tanpa perlu membuat REST controller manual. |
| **React** | `19.2.8` | Library UI inti generasi terbaru dengan dukungan fitur Concurrent rendering, `useActionState`, dan Server Actions bawaan. |
| **React-DOM** | `19.2.8` | Renderer DOM untuk React 19. |
| **TypeScript** | `^5.x` | Menjamin *type safety* secara end-to-end dari skema database Prisma, validasi form, hingga komponen antarmuka pengguna, meminimalkan bug pada level kompilasi. |
| **Node.js** | `>= 20.x` | Lingkungan runtime eksekusi serverless dan tooling pengembangan. |

---

## 3. Basis Data & Data Layer

### 3.1. Database Mesin
- **Penyedia:** **Neon Serverless PostgreSQL** (Cluster `ap-southeast-1` AWS Singapore).
- **Karakteristik:**
  - Arsitektur *autoscaling serverless* dengan *connection pooling* terintegrasi (`-pooler`), mampu menangani lonjakan trafik tanpa kehabisan *database connections*.
  - Penyimpanan persisten cloud yang aman dengan koneksi terenkripsi SSL (`sslmode=require`).

### 3.2. Object-Relational Mapping (ORM)
- **Prisma ORM:** `@prisma/client` & `prisma` (`^6.19.3`).
- **Pola Desain Singleton (`src/lib/db.ts`):** Menggunakan global instance Prisma Client agar koneksi database tidak dibuat berulang kali selama proses *hot-reloading* pada mode pengembangan atau di lingkungan serverless.
- **Skema Entitas Utama (`prisma/schema.prisma`):**
  1. **`User`:** Autentikasi dan hak akses akun administrator (disertai hash password).
  2. **`Service`:** Katalog layanan manufaktur (Injection Molding, Mould Making, Custom Component) beserta deskripsi teknis, material, dan kapasitas mesin (`maxCapacity`).
  3. **`Portfolio`:** Galeri produk & cetakan presisi, gambar teknis, kategori produk, spesifikasi, dan metadata klien.
  4. **`Inquiry`:** Manajemen prospek bisnis (Leads/RFQ) masuk, status penanganan (*BARU*, *DIHUBUNGI*, *SELESAI*), dan catatan internal tim.
  5. **`CompanyProfile`:** Data tunggal profil perusahaan (nomor WhatsApp, email operasional, alamat pabrik, jam operasional, link media sosial).

---

## 4. Penyimpanan Berkas & Media (Storage & CDN)

### 4.1. Cloudflare R2 Object Storage
- **Penyedia:** **Cloudflare R2** (Bucket: `bjp-company-profile`).
- **CDN Domain:** `pub-bbda9f30bb9a48b78ade186682149e0b.r2.dev` (terintegrasi dengan Next.js Image Optimization di `next.config.ts`).
- **Protokol:** S3-Compatible API via SDK resmi AWS:
  - `@aws-sdk/client-s3` (`^3.1127.0`)
  - `@aws-sdk/s3-request-presigner` (`^3.1127.0`)
- **Keunggulan:** Bebas biaya *egress bandwidth* (data transfer gratis ke publik).

### 4.2. Arsitektur Fail-Safe Anti-Gagal
- File handler pada [`src/actions/upload.ts`](file:///c:/Documents/Projects/bjp-company-profile/src/actions/upload.ts) dilengkapi proteksi bertingkat:
  1. **Prioritas 1 (Cloudflare R2):** Foto diunggah langsung ke R2 dan menghasilkan URL publik CDN berkecepatan tinggi.
  2. **Prioritas 2 (Neon Base64 Direct Persistence):** Apabila terjadi kegagalan jaringan atau kredensial R2 bermasalah, gambar dikonversi menjadi Base64 Data URL berkualitas tinggi dan disimpan langsung ke database Neon PostgreSQL. Dengan demikian, penginputan portofolio **dijamin 100% tidak pernah gagal**.

---

## 5. Antarmuka, Desain & Styling

### 5.1. Framework CSS & Desain
- **Tailwind CSS v4:** `@tailwindcss/postcss` & `tailwindcss` (`^4.x`).
- **Tema Desain:** *Industrial Modern / Dark Precision Aesthetic*.
  - Palet warna: Slate/Zinc gelap berpadu dengan aksen Amber/Orange industrial dan Emerald tech.
  - Elemen Glassmorphism modern (`backdrop-blur-md`, subtle border highlights) yang mencerminkan ketepatan dan presisi manufaktur plastik presisi tinggi.
- **Ikonografi:** **Lucide React** (`^1.41.0`) untuk visual ikon yang seragam, ringan, dan tree-shakeable.

### 5.2. Internasionalisasi (Bilingual ID / EN)
- **State Management:** React Context API (`src/context/LanguageContext.tsx`).
- **Kamus Bahasa:** `src/lib/translations.ts` menyediakan terjemahan lengkap dua bahasa (Bahasa Indonesia & English) untuk seluruh landing page dan komponen interaktif.

---

## 6. Validasi, Keamanan & Layanan Eksternal

| Kebutuhan | Teknologi / Modul | Detail Implementasi |
| :--- | :--- | :--- |
| **Validasi Form & Payload** | **Zod (`^4.5.4`)** | Skema validasi ketat pada Server Actions untuk kontak inquiry, portofolio, autentikasi, dan pengaturan profil perusahaan (`src/lib/validations/`). |
| **Enkripsi Password** | **bcryptjs (`^3.0.3`)** | Algoritma hashing satu arah untuk keamanan password administrator di database. |
| **Autentikasi CMS** | **Custom Cookie Session** | Pengelolaan sesi admin berbasis HTTP-only cookie dengan perlindungan rute admin `/admin/*`. |
| **Anti-Spam & Rate Limiter** | **In-Memory Token Bucket (`src/lib/rateLimit.ts`)** | Pembatasan pengiriman pesan pada form RFQ/Inquiry untuk mencegah serangan DDoS dan spam bot. |
| **Notifikasi Email** | **Resend SDK (`^6.26.0`)** | Layanan pengiriman email otomatis saat ada permintaan penawaran baru yang masuk dari website. |

---

## 7. Hosting & Infrastruktur Deployment

- **Platform Hosting:** **Vercel** (Global Serverless Edge Network).
- **Source Control:** GitHub Repository (`zidan-maulana/bjp-company-profile`).
- **Otomatisasi CI/CD:**
  - Setiap perubahan yang di-*push* ke branch `main` secara otomatis memicu proses build (`next build`), validasi linting, dan *deployment* ke *live environment*.
- **Domain Produksi:**
  - URL Saat Ini: `https://bjp-company-profile.vercel.app`
  - Kesiapan Custom Domain: Konfigurasi DNS CNAME/A Record untuk `barunajayaplastik.com`.

---

## 8. Ringkasan Environment Variables (`.env`)

```ini
# Basis Data (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:***@ep-shy-night-b3wy2zmn-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Penyimpanan Cloudflare R2 (S3-Compatible)
R2_ACCOUNT_ID="1ee325a6c0921d432cd4e0cfa42d0d25"
R2_ACCESS_KEY_ID="4d9507db2270032fccb9a8d6ecbde4e8"
R2_SECRET_ACCESS_KEY="6c612b50d4549578f3ccb5587a6f39cc8f45ae83ba2f69798a7478c9c3ebe47a"
R2_BUCKET_NAME="bjp-company-profile"
R2_PUBLIC_URL="https://pub-bbda9f30bb9a48b78ade186682149e0b.r2.dev"

# Aplikasi
NEXT_PUBLIC_APP_URL="https://bjp-company-profile.vercel.app"
```
