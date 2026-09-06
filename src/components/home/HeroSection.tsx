"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParallax } from "@/hooks/useParallax";
import { useLanguage } from "@/context/LanguageContext";
import { CompanyInfoData } from "@/lib/data/types";

interface HeroSectionProps {
  companyInfo?: CompanyInfoData | null;
}

export default function HeroSection({ companyInfo }: HeroSectionProps) {
  const { locale, t } = useLanguage();
  const bgRef = useParallax<HTMLDivElement>(0.22);
  const contentRef = useParallax<HTMLDivElement>(-0.08);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const bgImageSrc = companyInfo?.heroBgImage || "/mold-tool-close.jpg";
  const isDataUrl = bgImageSrc.startsWith("data:");

  // Dynamic values with clean language fallbacks
  const headlineLine1 =
    locale === "id" && companyInfo?.heroHeadlineLine1
      ? companyInfo.heroHeadlineLine1
      : t.hero.headlineLine1;
  const headlineLine2 =
    locale === "id" && companyInfo?.heroHeadlineLine2
      ? companyInfo.heroHeadlineLine2
      : t.hero.headlineLine2;

  const stat1Value = companyInfo?.heroStat1Value || "100";
  const stat1Label =
    locale === "id" && companyInfo?.heroStat1Label
      ? companyInfo.heroStat1Label
      : t.hero.stat1Label;

  const stat2Value = companyInfo?.heroStat2Value || "24+";
  const stat2Label =
    locale === "id" && companyInfo?.heroStat2Label
      ? companyInfo.heroStat2Label
      : t.hero.stat2Label;

  const specDesc =
    locale === "id" && companyInfo?.heroSpecDesc
      ? companyInfo.heroSpecDesc
      : t.hero.specDesc;

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] lg:h-screen lg:min-h-[720px] lg:max-h-[1080px] w-full overflow-hidden flex flex-col justify-center lg:justify-end pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pb-20 select-none"
    >
      {/* Full-bleed Hero Visual with Real Precision Plastic Mold Tooling (Parallax on Desktop) */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[8%] -bottom-[8%] h-[116%] z-0 lg:will-change-transform"
      >
        <Image
          src={bgImageSrc}
          alt="Alat Cetak & Nozzle Mold Presisi Injeksi Plastik Baruna Jaya Plastik"
          fill
          priority
          unoptimized={isDataUrl}
          sizes="100vw"
          className="object-cover object-[65%_center] lg:object-center brightness-[0.5] contrast-110"
        />
        {/* Vignette Overlay for High Contrast at Bottom & Left Content Areas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D14] via-[#090D14]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090D14]/85 via-[#090D14]/30 to-[#090D14]/40" />
      </div>

      {/* Foreground Content: Padat Seimbang & Rata Tengah di Mobile, Grid 2 Kolom di Desktop (Parallax on Desktop) */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[1440px] mx-auto w-full px-5 sm:px-10 lg:px-14 flex flex-col justify-center items-center gap-8 sm:gap-9 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-end lg:will-change-transform"
      >
        
        {/* Bagian 1: Headline & 2 Stat Cards (Rata Tengah di Mobile, Kolom Kiri di Desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-10 pt-0 sm:pt-4 lg:pt-0">
          {/* Headline matching the exact visual length and composition of the reference (Inframe Slide from Left) */}
          <div
            className={`transition-all duration-[1250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isMounted ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <h1 className="text-[1.85rem] sm:text-5xl md:text-6xl xl:text-[4.25rem] font-light tracking-tight text-white leading-[1.14] sm:leading-[1.08] text-center lg:text-left">
              {headlineLine1}<br />
              {headlineLine2}
            </h1>
          </div>

          {/* Two Side-by-Side Technical Stat Cards (Compact on Mobile, Standard on Desktop) */}
          <div
            className={`grid grid-cols-2 gap-2.5 sm:gap-6 max-w-[340px] sm:max-w-[480px] transition-all duration-[1250ms] delay-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isMounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Card 1: Stat 2 (e.g. 24+ THN / YRS) */}
            <div className="relative bg-[#1A2532]/75 backdrop-blur-md border border-white/10 shadow-xl px-4 py-3.5 sm:p-6 text-left">
              {/* 4 Corner Solid Orange Square Marks */}
              <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 w-1 h-1 bg-orange-500 select-none" />
              <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-1 h-1 bg-orange-500 select-none" />
              <span className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 w-1 h-1 bg-orange-500 select-none" />
              <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 w-1 h-1 bg-orange-500 select-none" />

              {/* Metric Value */}
              <div className="flex items-start gap-1">
                <span className="text-xl sm:text-4xl font-light text-white tracking-tight leading-none font-sans">
                  {stat2Value}
                </span>
                <span className="text-[9px] sm:text-sm font-light text-zinc-300 leading-none mt-0.5 font-mono">
                  {locale === "id" ? "THN" : "YRS"}
                </span>
              </div>

              {/* Horizontal Divider Line */}
              <div className="w-full h-[1px] bg-white/20 my-2.5 sm:my-4" />

              {/* Label (Single Line) */}
              <p className="text-[8.5px] sm:text-[11px] font-mono tracking-[0.06em] sm:tracking-[0.14em] text-zinc-200 uppercase font-medium leading-tight whitespace-nowrap">
                {stat2Label}
              </p>
            </div>

            {/* Card 2: Stat 1 (e.g. 100% GARANSI PURNA JUAL) */}
            <div className="relative bg-[#1A2532]/75 backdrop-blur-md border border-white/10 shadow-xl px-4 py-3.5 sm:p-6 text-left">
              {/* 4 Corner Solid Orange Square Marks */}
              <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 w-1 h-1 bg-orange-500 select-none" />
              <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-1 h-1 bg-orange-500 select-none" />
              <span className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 w-1 h-1 bg-orange-500 select-none" />
              <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 w-1 h-1 bg-orange-500 select-none" />

              {/* Metric Value: e.g. 100 with elevated % */}
              <div className="flex items-start gap-1">
                <span className="text-xl sm:text-4xl font-light text-white tracking-tight leading-none font-sans">
                  {stat1Value}
                </span>
                <span className="text-xs sm:text-lg font-light text-zinc-300 leading-none mt-0.5 font-sans">
                  %
                </span>
              </div>

              {/* Horizontal Divider Line */}
              <div className="w-full h-[1px] bg-white/20 my-2.5 sm:my-4" />

              {/* Label (Single Line) */}
              <p className="text-[8.5px] sm:text-[11px] font-mono tracking-[0.06em] sm:tracking-[0.14em] text-zinc-200 uppercase font-medium leading-tight whitespace-nowrap">
                {stat1Label}
              </p>
            </div>
          </div>
        </div>

        {/* Bagian 2: Deskripsi & Action Group (Rata Tengah di Mobile, Kolom Kanan di Desktop) */}
        <div
          className={`lg:col-span-5 flex flex-col justify-end items-center lg:items-end pt-0 lg:pt-0 pb-0 lg:pb-2 transition-all duration-[1250ms] delay-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMounted ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
        >
          <div className="max-w-[360px] sm:max-w-md mx-auto lg:ml-auto space-y-5 sm:space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Technical Description in Monospace Uppercase */}
            <p className="text-[9.5px] sm:text-[11px] font-mono tracking-[0.06em] sm:tracking-[0.14em] text-zinc-300 uppercase leading-relaxed text-center lg:text-left">
              {specDesc}
            </p>

            {/* Action Buttons: Dark with Orange Accent Square + Services Link */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1 sm:pt-0.5 w-full">
              <Link
                href="#kontak"
                onClick={(e) => handleSmoothScroll(e, "#kontak")}
                className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-[10.5px] sm:text-[11px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] transition-colors duration-200 shadow-md group active:scale-[0.99]"
              >
                <span className="w-1.5 h-1.5 bg-white transition-colors" />
                <span>{t.hero.ctaConsult}</span>
              </Link>

              <Link
                href="#layanan"
                onClick={(e) => handleSmoothScroll(e, "#layanan")}
                className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] text-zinc-300 hover:text-white transition-colors py-2"
              >
                {t.nav.services}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
