"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { useParallax } from "@/hooks/useParallax";
import { useLanguage } from "@/context/LanguageContext";

interface CompanyInfoData {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  operatingHours?: string | null;
}

interface FooterProps {
  companyInfo?: CompanyInfoData | null;
}

export default function Footer({ companyInfo }: FooterProps = {}) {
  const { locale, setLocale, t } = useLanguage();
  const [footerRef, isInView] = useInView<HTMLElement>({ threshold: 0.06 });
  const logoRef = useParallax<HTMLDivElement>(-0.02);

  const rawPhone = companyInfo?.phone || "081283840614";
  const waPhone = rawPhone.startsWith("0")
    ? "62" + rawPhone.slice(1)
    : rawPhone.replace(/\D/g, "");

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#0D0D0D] text-zinc-100 border-t border-white/10 select-none overflow-hidden"
    >
      
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* SECTION 1: TOP GRID (BLCK. 01 TOP / BLCK. 02 & 03 BESIDE)    */}
      {/* Background #0D0D0D Selaras ConsultationSection & Pembagi Halus */}
      {/* ============================================================ */}
      <div className="w-full border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* -------------------------------------------------------- */}
            {/* BLCK. 01: 2-Column Links (Navigasi Utama & Solusi Mold)  */}
            {/* -------------------------------------------------------- */}
            <div
              className={`lg:col-span-6 py-5 sm:py-8 lg:py-10 lg:pr-8 xl:pr-12 flex flex-col justify-between min-h-0 lg:min-h-[280px] transition-all duration-[1100ms] delay-[150ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {/* Block Header */}
              <div className="flex items-center justify-between pb-3.5 sm:pb-6 lg:pb-10">
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] sm:tracking-[0.22em] text-white uppercase">
                  {t.footer.block1Title}
                </span>
                <span className="w-1.5 h-1.5 bg-orange-600 inline-block" />
              </div>

              {/* 2-Subcolumn Links */}
              <div className="grid grid-cols-2 gap-5 sm:gap-10">
                {/* Subcolumn 1: Navigasi Profil */}
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-[13px] font-sans font-medium text-zinc-400">
                  <li>
                    <Link
                      href="#tentang-kami"
                      onClick={(e) => handleSmoothScroll(e, "#tentang-kami")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.about}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#standar-mutu"
                      onClick={(e) => handleSmoothScroll(e, "#standar-mutu")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.standards}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#portofolio"
                      onClick={(e) => handleSmoothScroll(e, "#portofolio")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.portfolio}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#kontak"
                      onClick={(e) => handleSmoothScroll(e, "#kontak")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.contact}
                    </Link>
                  </li>
                </ul>

                {/* Subcolumn 2: Layanan Manufaktur */}
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-[13px] font-sans font-medium text-zinc-400">
                  <li>
                    <Link
                      href="#layanan"
                      onClick={(e) => handleSmoothScroll(e, "#layanan")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.serviceInjection}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#layanan"
                      onClick={(e) => handleSmoothScroll(e, "#layanan")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.serviceBlowing}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#layanan"
                      onClick={(e) => handleSmoothScroll(e, "#layanan")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.serviceCnc}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#layanan"
                      onClick={(e) => handleSmoothScroll(e, "#layanan")}
                      className="hover:text-white hover:underline transition-colors duration-150 block py-0.5"
                    >
                      {t.footer.links.serviceModif}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* BLOCKS 02 & 03: Standar Teknis & Kanal Komunikasi        */}
            {/* Berdampingan di Mobile (2 Kolom) & Desktop (lg:col-6)    */}
            {/* -------------------------------------------------------- */}
            <div className="lg:col-span-6 grid grid-cols-2 divide-x divide-white/10">

              {/* BLCK. 02: Standar Teknis & Jaminan Kualitas */}
              <div
                className={`col-span-1 py-5 sm:py-8 lg:py-10 pr-3 sm:pr-6 lg:px-8 xl:px-10 flex flex-col justify-between min-h-0 lg:min-h-[280px] transition-all duration-[1100ms] delay-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {/* Block Header */}
                <div className="flex items-center justify-between pb-3.5 sm:pb-6 lg:pb-10">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.14em] sm:tracking-[0.22em] text-white uppercase truncate">
                    {t.footer.block2Title}
                  </span>
                  <span className="w-1.5 h-1.5 bg-orange-600 inline-block shrink-0 ml-1" />
                </div>

                {/* Links */}
                <ul className="space-y-2 sm:space-y-3 text-[11px] sm:text-xs lg:text-[13px] font-sans font-medium text-zinc-400">
                  <li>
                    <Link
                      href="#standar-mutu"
                      onClick={(e) => handleSmoothScroll(e, "#standar-mutu")}
                      className="hover:text-white transition-colors duration-150 flex items-start gap-1.5 sm:gap-2.5 py-0.5 group leading-snug"
                    >
                      <span className="w-1 h-1 rounded-full bg-orange-500/70 group-hover:bg-orange-500 transition-colors shrink-0 mt-1.5" />
                      <span className="group-hover:underline">{t.footer.links.steel}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#standar-mutu"
                      onClick={(e) => handleSmoothScroll(e, "#standar-mutu")}
                      className="hover:text-white transition-colors duration-150 flex items-start gap-1.5 sm:gap-2.5 py-0.5 group leading-snug"
                    >
                      <span className="w-1 h-1 rounded-full bg-orange-500/70 group-hover:bg-orange-500 transition-colors shrink-0 mt-1.5" />
                      <span className="group-hover:underline">{t.footer.links.tolerance}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#standar-mutu"
                      onClick={(e) => handleSmoothScroll(e, "#standar-mutu")}
                      className="hover:text-white transition-colors duration-150 flex items-start gap-1.5 sm:gap-2.5 py-0.5 group leading-snug"
                    >
                      <span className="w-1 h-1 rounded-full bg-orange-500/70 group-hover:bg-orange-500 transition-colors shrink-0 mt-1.5" />
                      <span className="group-hover:underline">{t.footer.links.dfm}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#standar-mutu"
                      onClick={(e) => handleSmoothScroll(e, "#standar-mutu")}
                      className="hover:text-white transition-colors duration-150 flex items-start gap-1.5 sm:gap-2.5 py-0.5 group leading-snug"
                    >
                      <span className="w-1 h-1 rounded-full bg-orange-500/70 group-hover:bg-orange-500 transition-colors shrink-0 mt-1.5" />
                      <span className="group-hover:underline">{t.footer.links.warranty}</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* BLCK. 03: Kanal Komunikasi & Bahasa (ID | EN) */}
              <div
                className={`col-span-1 py-5 sm:py-8 lg:py-10 pl-3 sm:pl-6 lg:pl-8 xl:pl-10 flex flex-col justify-between min-h-0 lg:min-h-[280px] transition-all duration-[1100ms] delay-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {/* Block Header */}
                <div className="flex items-center justify-between pb-3.5 sm:pb-6 lg:pb-10">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.14em] sm:tracking-[0.22em] text-white uppercase truncate">
                    {t.footer.block3Title}
                  </span>
                  <span className="w-1.5 h-1.5 bg-orange-600 inline-block shrink-0 ml-1" />
                </div>

                {/* Socials & Language */}
                <div className="space-y-4 sm:space-y-6">
                  <ul className="space-y-2 sm:space-y-3 text-[11px] sm:text-xs lg:text-[13px] font-sans font-medium text-zinc-400">
                    <li>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-white transition-colors duration-150 py-0.5 group"
                      >
                        <svg
                          className="w-3.5 h-3.5 fill-current text-zinc-400 group-hover:text-white transition-colors shrink-0"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span className="group-hover:underline truncate">{t.footer.links.linkedin}</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={
                          locale === "id"
                            ? `https://wa.me/${waPhone}?text=Halo%20Baruna%20Jaya%20Plastik,%20saya%20ingin%20berkonsultasi%20mengenai%20pembuatan%20mold.`
                            : `https://wa.me/${waPhone}?text=Hello%20Baruna%20Jaya%20Plastik,%20I%20would%20like%20to%20consult%20regarding%20mold%20tooling.`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-white transition-colors duration-150 py-0.5 group"
                      >
                        <svg
                          className="w-3.5 h-3.5 fill-current text-zinc-400 group-hover:text-white transition-colors shrink-0"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        <span className="group-hover:underline truncate">{t.footer.links.whatsapp}</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-white transition-colors duration-150 py-0.5 group"
                      >
                        <svg
                          className="w-3.5 h-3.5 fill-current text-zinc-400 group-hover:text-white transition-colors shrink-0"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span className="group-hover:underline truncate">{t.footer.links.instagram}</span>
                      </a>
                    </li>
                  </ul>

                  {/* Tactile Industrial Language Switcher */}
                  <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 sm:justify-start sm:gap-3">
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                      {locale === "id" ? "Bahasa" : "Lang"}
                    </span>
                    <div className="inline-flex items-center p-0.5 bg-white/[0.04] border border-white/10 rounded-sm">
                      <button
                        type="button"
                        onClick={() => setLocale("id")}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider rounded-xs transition-all duration-150 cursor-pointer ${
                          locale === "id"
                            ? "bg-orange-600 text-white shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                        aria-label="Ganti ke Bahasa Indonesia"
                      >
                        ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocale("en")}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider rounded-xs transition-all duration-150 cursor-pointer ${
                          locale === "en"
                            ? "bg-orange-600 text-white shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                        aria-label="Switch to English"
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: BRAND LOGO (Persis Sama Seperti Navbar & Utuh)   */}
      {/* Diperbesar proporsional agar panjang sejajar dengan konten  */}
      {/* ============================================================ */}
      <div
        ref={logoRef}
        className="w-full border-b border-white/10 py-6 sm:py-10 lg:py-12 overflow-hidden lg:will-change-transform"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 [container-type:inline-size]">
          <div
            className={`transition-all duration-[1350ms] delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isInView ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-[0.98]"
            }`}
          >
            <Link
              href="#hero"
              onClick={(e) => handleSmoothScroll(e, "#hero")}
              className="inline-flex items-center gap-[4.22cqw] group cursor-pointer leading-none whitespace-nowrap"
              aria-label="Kembali ke atas - Baruna Jaya Plastik"
            >
              {/* Dual Slanted Parallelograms Icon Sesuai Navbar (Oranye & Putih Asli) */}
              <div className="flex items-center shrink-0">
                <svg
                  className="w-[15.35cqw] h-[calc(15.35cqw*26/32)]"
                  viewBox="0 0 32 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top Slanted Shape in Vibrant Brand Orange */}
                  <polygon points="10,0 28,0 20,11 2,11" fill="#EA580C" />
                  {/* Bottom Slanted Shape in Clean White */}
                  <polygon points="12,14 30,14 22,25 4,25" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Typography: BARUNA JAYA Sesuai Navbar (Utuh, Tidak Dimanipulasi) */}
              <span className="font-bold text-[10.60cqw] tracking-wider text-white font-sans whitespace-nowrap leading-none select-none">
                BARUNA JAYA
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: BOTTOM LEGAL & COPYRIGHT STRIP                    */}
      {/* Desktop: 4 Kolom Penuh | Mobile: Hanya Syarat & Privasi      */}
      {/* ============================================================ */}
      <div className="w-full pt-4 pb-8 lg:py-6">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14">
          <div
            className={`flex items-center justify-center lg:grid lg:grid-cols-4 gap-4 text-[10px] sm:text-[11px] font-mono font-medium tracking-wider text-zinc-400 uppercase transition-all duration-[1000ms] delay-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {/* Col 1: Copyright (Hanya Desktop) */}
            <p className="hidden lg:block text-white font-bold text-left">
              {t.footer.copyright}
            </p>

            {/* Col 2 & Col 3: Syarat & Ketentuan + Kebijakan Privasi */}
            {/* Di Mobile: Flex inline di tengah | Di Desktop: lg:contents mengisi Col 2 & Col 3 */}
            <div className="flex items-center justify-center gap-4 lg:contents">
              <div className="lg:text-left">
                <Link
                  href="#tentang-kami"
                  onClick={(e) => handleSmoothScroll(e, "#tentang-kami")}
                  className="hover:text-white hover:underline transition-colors duration-150 py-0.5 inline-block"
                >
                  {t.footer.terms}
                </Link>
              </div>

              <span className="text-zinc-600 select-none lg:hidden">·</span>

              <div className="lg:text-left">
                <Link
                  href="#tentang-kami"
                  onClick={(e) => handleSmoothScroll(e, "#tentang-kami")}
                  className="hover:text-white hover:underline transition-colors duration-150 py-0.5 inline-block"
                >
                  {t.footer.privacy}
                </Link>
              </div>
            </div>

            {/* Col 4: Quality Stamp (Hanya Desktop) */}
            <p className="hidden lg:block text-white font-bold text-right">
              {t.footer.established}
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}
