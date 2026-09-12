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

  // 2. Cek APP_URL bawaan jika bukan localhost
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && !appUrl.includes("localhost")) {
    return appUrl.replace(/\/$/, "");
  }

  // 3. Cek domain produksi Vercel otomatis
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 4. Fallback domain live produksi terpercaya
  return "https://barunajayaplastik.vercel.app";
}
