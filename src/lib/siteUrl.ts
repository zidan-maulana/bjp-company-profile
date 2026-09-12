/**
 * Helper terpusat untuk menentukan URL kanonikal publik website.
 * Mencegah kebocoran "http://localhost:3000" pada meta tag kanonikal,
 * OpenGraph, Twitter card, sitemap.xml, robots.txt, dan JSON-LD Structured Data.
 */
export function getSiteUrl(): string {
  // 1. Cek konfigurasi domain kustom eksplisit
  const customSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (customSiteUrl && !customSiteUrl.includes("localhost")) {
    return customSiteUrl.replace(/\/$/, "");
  }

  // 2. Domain resmi yang didaftarkan di Google Search Console
  return "https://barunajayaplastik.vercel.app";
}
