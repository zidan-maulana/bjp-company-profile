# 🎨 Detail Teknis Front-End & UI/UX Architecture
**Project**: PT Baruna Jaya Plastik — Company Profile & Admin System  
**Jobdesk / Person in Charge**: **Zidan** (Front-End & UI/UX Lead)  
**Tujuan Dokumen**: Dokumentasi komprehensif mengenai arsitektur antarmuka, design system, performa client-side, dan pengelolaan state untuk website publik dan dashboard admin.

---

## 1. Ikhtisar Peran & Tanggung Jawab (Scope of Work)
Sisi Front-End berfokus pada seluruh elemen visual, pengalaman pengguna (UX), responsivitas mobile-first, interaktivitas, dan integrasi data ke tampilan:
* **Halaman Publik (`/`)**: Landing page presisi industri, showcase portofolio cetakan mold, katalog layanan manufaktur, kalkulator/konsultasi RFQ, dan profile perusahaan.
* **Dashboard Admin (`/admin/*`)**: Antarmuka manajemen konten (CMS) internal untuk mengelola layanan, katalog portofolio multi-foto, pesan penawaran (leads/inquiries), dan profil perusahaan.
* **Bilingual Switcher (ID/EN)**: Sistem alih bahasa dinamis seketika tanpa perlu reload halaman.
* **Mobile-First Responsive Engineering**: Menjamin tampilan estetis dan fungsional di seluruh breakpoint (ponsel 320px–480px, tablet 640px–1023px, desktop ≥ 1024px, ultrawide).

---

## 2. Stack Teknologi & Pustaka Utama

| Teknologi / Library | Versi | Peran & Implementasi |
| :--- | :--- | :--- |
| **Next.js (App Router)** | `16.3.4` | Framework fullstack berbasis React dengan isolasi Server & Client Components. |
| **React** | `19.0.0` | Library inti antarmuka deklaratif dengan Hooks modern (`useState`, `useEffect`, `useTransition`, `useRef`). |
| **Tailwind CSS** | `v4.0` | Framework styling utilitas tinggi dengan konfigurasi CSS kustom bertema *Industrial Precision*. |
| **Lucide React** | `^1.16.0` | Ikonografi SVG teknis industrial yang konsisten (mesin, kontak, aksi CRUD, status). |
| **TypeScript** | `^5.0.0` | Strict typing untuk props komponen, event handlers, dan data binding tampilan. |

---

## 3. Arsitektur Komponen (Server vs Client Isolation)

Next.js App Router membagi komponen secara ketat untuk memaksimalkan performa dan Core Web Vitals:

### A. React Server Components (RSC) — Data Fetching & SSR
* File: `src/app/page.tsx`, `src/app/admin/(dashboard)/*/page.tsx`, `src/app/layout.tsx`.
* **Karakteristik**:
  * Berjalan langsung di server, mengambil data awal (*initial data*) dari database/data layer tanpa mengirim bundle JavaScript berat ke browser pengunjung.
  * Menghilangkan fenomena *layout shift* (CLS 0) dan memangkas waktu *First Contentful Paint* (FCP).
  * Menghasilkan HTML statis/streaming yang ramah mesin pencari (SEO-friendly).

### B. Client Components (`"use client"`) — Interaktivitas & State
* File: `src/components/home/*`, `src/components/admin/*`, `src/context/*`.
* **Karakteristik**:
  * Mengelola state interaktif (misal: accordion buka-tutup layanan, tab switcher kategori portofolio, drag-and-drop upload gambar, modal dialog, formulir input).
  * Berinteraksi dengan browser API (scroll listener, viewport observer, window resize).

---

## 4. Design System: *Industrial Precision*

Konsep visual mengadopsi estetika pabrik manufaktur mold presisi modern, bersih, kokoh, dan berteknologi tinggi.

### A. Palet Warna (Color Tokens)
* **Background Utama**: `bg-zinc-950` (Dark theme premium), `bg-[#121212]`, dan kontras `bg-white` pada section katalog layanan.
* **Aksen Oranye BJP**: `bg-orange-600` / `text-orange-500` / `border-orange-500/40` (Mencerminkan identitas korporat, tombol aksi utama, corner registration marks, dan highlight aktif).
* **Aksen Industri Pendukung**: `text-emerald-400` / `bg-emerald-500/10` (Status mesin/database online, verifikasi presisi).
* **Tipografi & Teks**: `text-white` (Heading utama), `text-zinc-300` (Body teks), `text-zinc-500` (Subteks & metadata mono).

### B. Tipografi (Typography Hierarchy)
* **Body & Display**: Font sans-serif modern dengan tracking proporsional (`tracking-tight`).
* **Monospace Metadata**: Font monospace (`font-mono`) digunakan untuk nomor urut (01, 02), spesifikasi teknis, label tonase mesin, kode HRC material baja, dan badge kapasitas produksi.

### C. Signature Visual Elements
* **Corner Registration Dots**: Kotak mini oranye (`w-1 h-1 bg-orange-600`) di 4 sudut panel kartu formulir atau hero container sebagai aksen penanda cetak (*molding calibration mark*).
* **Micro-Lines & Separator**: Garis border tipis `border-zinc-800` dan `border-zinc-200` yang presisi.

---

## 5. Sistem Gerak & Micro-Interactions

Untuk memberikan kesan dinamis tanpa memberatkan browser:
1. **Scroll Reveal (`useInView.ts`)**:
   * Memanfaatkan browser `IntersectionObserver` native dengan threshold spesifik untuk memicu animasi *slide-in* atau *fade-up* saat komponen masuk ke viewport.
2. **Smooth Parallax (`useParallax.ts`)**:
   * Memberikan efek pergeseran kedalaman visual pada header teks dan elemen list pada layar desktop (`lg:` breakpoint) dengan GPU acceleration (`will-change-transform`).
3. **Accordion Card Animation**:
   * Animasi buka-tutup detail kapabilitas layanan dan kapasitas maksimal menggunakan kombinasi CSS Grid rows `grid-rows-[1fr]` (aktif) dan `grid-rows-[0fr]` (tertutup) dengan transisi 300ms yang sangat halus.

---

## 6. Sistem Bilingual i18n (Indonesian & English)

* **Arsitektur**: Client-Side React Context di [`src/context/LanguageContext.tsx`](file:///c:/Documents/Projects/bjp-company-profile/src/context/LanguageContext.tsx).
* **Kamus Terpusat**: Seluruh string teks bilingual disimpan terstruktur di [`src/lib/translations.ts`](file:///c:/Documents/Projects/bjp-company-profile/src/lib/translations.ts).
* **Persistensi State**: Bahasa yang dipilih (`id` atau `en`) otomatis tersimpan di `localStorage` dan tersinkronisasi ke tag `<html lang="...">`.

---

## 7. Struktur Berkas Front-End

```text
src/
├── app/
│   ├── layout.tsx                # Root layout (Metadata, Google Fonts, LanguageProvider)
│   ├── page.tsx                  # Halaman publik utama (Aggregator seluruh section)
│   ├── admin/
│   │   ├── login/page.tsx        # Halaman autentikasi admin
│   │   └── (dashboard)/          # Dashboard rute terlindungi
│   │       ├── services/         # Kelola layanan manufaktur
│   │       ├── portfolio/        # Kelola portofolio & gambar mold
│   │       ├── inquiries/        # Kelola pesan penawaran & status lead
│   │       └── company/          # Kelola info kontak, hero, & profil
├── components/
│   ├── layout/                   # Navbar, Footer, Floating WhatsApp, Language Switcher
│   ├── home/                     # Hero, About, Services, Machinery, Portfolio, Consultation
│   └── admin/                    # AdminSidebar, DataTables, FormModal, ImageUploadWidget
├── context/
│   └── LanguageContext.tsx       # Context state manajemen bahasa ID/EN
└── hooks/
    ├── useInView.ts              # Viewport intersection observer hook
    └── useParallax.ts            # Smooth parallax depth effect hook
```

---

## 8. Standar Kualitas & Batasan Kritis (Front-End Rules)
1. **Strict Responsive Integrity**: Perubahan layout mobile (`< 1024px`) wajib menggunakan breakpoint eksplisit dan **dilarang mematahkan tampilan desktop** (`lg:`).
2. **Zero Hardcoded Text**: Seluruh teks antarmuka publik wajib mengambil referensi dari `t.*` (`LanguageContext`) agar dukungan bilingual tidak rusak.
3. **Clean Production Build**: Komponen wajib bebas dari lint warning, unused imports, dan lulus `npm run build` sebelum digabung ke branch utama.
