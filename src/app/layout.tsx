import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Baruna Jaya Plastik | Pabrik & Bengkel Cetakan Plastik Presisi (Mold Maker)",
    template: "%s | Baruna Jaya Plastik",
  },
  description:
    "Pabrik dan bengkel spesialis perancangan, pembuatan, dan servis cetakan plastik presisi (Plastic Injection & Blowing Mold Maker) berbasis baja perkakas berkualitas sejak 2001 di Kalideres, Jakarta Barat. Melayani cetakan industri otomotif, elektronik, medis, dan kemasan.",
  keywords: [
    "Baruna Jaya Plastik",
    "BJP Mold",
    "bengkel mold jakarta",
    "bengkel mold injection jakarta barat",
    "jasa pembuatan mold plastik",
    "pabrik cetakan plastik",
    "bengkel cetakan plastik kalideres",
    "jasa bikin cetakan plastik tangerang",
    "plastic injection mold maker indonesia",
    "blowing mold maker indonesia",
    "cetakan injeksi plastik presisi",
    "servis cetakan plastik jakarta",
    "modifikasi mold plastik",
    "bengkel bubut cnc mold maker",
    "wire cut sinker edm mold",
    "cetakan botol plastik",
    "cetakan part otomotif plastik",
    "precision tooling workshop indonesia",
    "baja perkakas stavax din 1.2316",
  ],
  authors: [{ name: "PT Baruna Jaya Plastik", url: siteUrl }],
  creator: "PT Baruna Jaya Plastik",
  publisher: "PT Baruna Jaya Plastik",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/?lang=en",
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "PT Baruna Jaya Plastik",
    title: "Baruna Jaya Plastik | Pabrik & Bengkel Cetakan Plastik Presisi (Mold Maker)",
    description:
      "Spesialis rancang bangun & servis cetakan plastic injection dan blowing presisi tinggi berbasis baja perkakas berkualitas sejak 2001 di Kalideres, Jakarta Barat.",
    images: [
      {
        url: "/mold-tool-close.jpg",
        width: 1200,
        height: 630,
        alt: "Pabrik Pembuatan Mold & Cetakan Injeksi Plastik Presisi - Baruna Jaya Plastik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baruna Jaya Plastik | Pabrik & Bengkel Cetakan Plastik Presisi",
    description:
      "Spesialis rancang bangun & servis cetakan plastic injection & blowing presisi tinggi sejak 2001 di Kalideres, Jakarta Barat.",
    images: ["/mold-tool-close.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "google5e35570dba6df9e1",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
  other: {
    "geo.region": "ID-JK",
    "geo.placename": "Jakarta Barat, Kalideres",
    "geo.position": "-6.109;106.7027",
    ICBM: "-6.109, 106.7027",
  },
  category: "Manufacturing & Industrial Tooling",
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#090D14] text-zinc-100 selection:bg-orange-500 selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
