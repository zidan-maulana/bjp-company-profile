"use client";

import { useParallax } from "@/hooks/useParallax";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";
import { CompanyInfoData } from "@/lib/data/types";

interface AboutStorySectionProps {
  companyInfo?: CompanyInfoData | null;
}

export default function AboutStorySection({ companyInfo }: AboutStorySectionProps) {
  const { locale, t } = useLanguage();
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.15 });
  const badgeRef = useParallax<HTMLDivElement>(0.03);
  const textRef = useParallax<HTMLDivElement>(-0.07);

  const statement =
    locale === "id" && companyInfo?.aboutStatement
      ? companyInfo.aboutStatement
      : t.about.statement;

  const eyebrow =
    locale === "id" && companyInfo?.aboutEyebrow
      ? companyInfo.aboutEyebrow
      : t.nav.about;

  return (
    <section
      ref={sectionRef}
      id="tentang-kami"
      className="relative bg-white text-zinc-950 py-16 sm:py-24 lg:py-28 select-none overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-16 xl:gap-24">
          
          {/* Kolom Kiri: Badge Kategori (Inframe Slide from Left + Parallax) */}
          <div
            ref={badgeRef}
            className="flex items-center gap-2.5 shrink-0 pt-1 lg:pt-3 w-auto lg:w-48 xl:w-56 lg:will-change-transform"
          >
            <div
              className={`flex items-center gap-2.5 transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
            >
              <span className="w-1.5 h-1.5 bg-orange-600 inline-block" />
              <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-zinc-500 uppercase">
                {eyebrow}
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Pernyataan Editorial Besar (Inframe Slide from Left + Parallax) */}
          <div
            ref={textRef}
            className="flex-1 max-w-4xl xl:max-w-5xl lg:will-change-transform"
          >
            <div
              className={`transition-all duration-[1300ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-light text-zinc-950 tracking-tight leading-[1.35] sm:leading-[1.25] text-left">
                {statement}
              </h2>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

