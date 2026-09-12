"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParallax } from "@/hooks/useParallax";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";
import { ServiceItemData } from "@/lib/data/types";

interface ServicesSectionProps {
  initialServices?: ServiceItemData[];
}

interface DisplayServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  desc: string;
  capabilities: string[];
  maxCapacity?: string | null;
}

export default function ServicesSection({ initialServices }: ServicesSectionProps) {
  const { locale, t } = useLanguage();
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08 });
  const headerRef = useParallax<HTMLDivElement>(-0.04);
  const listRef = useParallax<HTMLDivElement>(0.02);

  const displayItems: DisplayServiceItem[] =
    initialServices && initialServices.length > 0
      ? initialServices.map((s, idx) => {
          const enTranslation =
            locale === "en" ? t.services.items[idx] : null;

          return {
            id: s.id,
            number: s.number || String(idx + 1).padStart(2, "0"),
            title: enTranslation?.title || s.title,
            subtitle: enTranslation?.subtitle || s.subtitle || s.shortDesc || "PRECISION MOLD SERVICE",
            desc: enTranslation?.desc || s.fullDesc || s.desc || s.shortDesc,
            capabilities: (s.capabilities && s.capabilities.length > 0) ? s.capabilities : (s.materials || []),
            maxCapacity: s.maxCapacity || null,
          };
        })
      : t.services.items.map((item) => ({
          ...item,
          maxCapacity: (item as any).maxCapacity || null,
        }));

  // Default to first card open on desktop, but closed initially on mobile
  const [activeId, setActiveId] = useState<string | null>(displayItems[0]?.id || "01");

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setActiveId(null);
    }
  }, []);

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

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
    <section
      ref={sectionRef}
      id="layanan"
      className="relative bg-white text-zinc-950 pt-14 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 border-b border-zinc-200 overflow-hidden"
    >
      {/* Section Header (Constrained to 1440px Grid, Parallax on Desktop) */}
      <div
        ref={headerRef}
        className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 mb-8 sm:mb-12 lg:will-change-transform"
      >
        <div className="flex flex-row items-end justify-between gap-3 sm:gap-6 pb-6 sm:pb-12">
          {/* Headline Inframe Slide from Left */}
          <div
            className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isInView ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-zinc-950 tracking-tight whitespace-nowrap">
              {t.services.titleSection}
            </h2>
            {/* Orange Accent Bar */}
            <div className="w-16 sm:w-28 h-0.5 sm:h-1 bg-orange-600 mt-2 sm:mt-4" />
          </div>

          <div
            className={`flex items-center shrink-0 transition-all duration-[1200ms] delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isInView ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <Link
              href="#kontak"
              onClick={(e) => handleSmoothScroll(e, "#kontak")}
              className="inline-flex items-center justify-center px-4 sm:px-7 py-2.5 sm:py-3 bg-orange-600 hover:bg-orange-500 text-white text-[10.5px] sm:text-xs font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-colors duration-200 shadow-sm whitespace-nowrap active:scale-[0.99]"
            >
              {t.services.contactBtn}
            </Link>
          </div>
        </div>
      </div>

      {/* Services List: Full-Bleed Edge-to-Edge Strips with Staggered Scroll Reveal (Parallax on Desktop) */}
      <div
        ref={listRef}
        className="w-full flex flex-col lg:will-change-transform"
      >
        {displayItems.map((item, index) => {
          const isActive = activeId === item.id;
          // Divider line above card disappears when the card is active, and is omitted on the first card
          const showTopDivider = index > 0 && !isActive;

          // Staggered delay for progressive scroll-triggered entrance (slower and velvety)
          const delays = [
            "delay-[150ms]",
            "delay-[260ms]",
            "delay-[370ms]",
            "delay-[480ms]",
            "delay-[590ms]",
            "delay-[700ms]",
          ];
          const delayClass = delays[index] || "delay-[200ms]";

          return (
            <div
              key={item.id}
              className={`w-full transition-all duration-[1000ms] ${delayClass} ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <div
                onClick={() => handleToggle(item.id)}
                className={`w-full group cursor-pointer transition-[background-color,padding] duration-300 ease-out select-none ${
                  showTopDivider ? "border-t border-zinc-200" : ""
                } ${
                  isActive
                    ? "bg-zinc-950 text-white py-8 sm:py-14"
                    : "bg-transparent py-5 sm:py-8"
                }`}
              >
                {/* Inner Content Grid (Responsive for Mobile & Desktop) */}
                <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start lg:items-center">
                    
                    {/* Column 1 & 2 & Mobile Toggle: Combined on Mobile, Split on Desktop */}
                    <div className="lg:col-span-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 sm:gap-6">
                        {/* Number */}
                        <span
                          className={`text-base sm:text-xl font-mono transition-colors duration-200 mt-0.5 sm:mt-0 ${
                            isActive
                              ? "text-orange-500 font-bold"
                              : "text-zinc-400 group-hover:text-orange-600"
                          }`}
                        >
                          {item.number || item.id}
                        </span>

                        {/* Title & English Subtitle */}
                        <div>
                          <h3
                            className={`text-lg sm:text-2xl font-medium tracking-tight transition-colors duration-200 ${
                              isActive
                                ? "text-white"
                                : "text-zinc-950 group-hover:text-orange-600"
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs font-mono tracking-wide mt-0.5 sm:mt-1 uppercase text-zinc-400">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Toggle Icon */}
                      <div className="lg:hidden flex items-center justify-end shrink-0 pt-0.5">
                        <div
                          className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ease-out text-sm font-mono ${
                            isActive
                              ? "bg-orange-600 text-white font-bold"
                              : "border border-zinc-300 text-zinc-400 group-hover:border-orange-600 group-hover:text-orange-600"
                          }`}
                        >
                          <span
                            className={`inline-block transition-transform duration-300 ease-out ${
                              isActive ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            {isActive ? "−" : "+"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Description & Smooth Expandable Technical Scope */}
                    <div
                      className={`lg:col-span-6 flex-col justify-center transition-all duration-300 ease-out ${
                        isActive ? "flex mt-3 lg:mt-0" : "hidden lg:flex"
                      }`}
                    >
                      <p
                        className={`text-xs sm:text-[13px] leading-relaxed transition-colors duration-200 ${
                          isActive
                            ? "text-zinc-300 block"
                            : "text-zinc-600 hidden lg:block"
                        }`}
                      >
                        {item.desc}
                      </p>

                      {/* Smooth Expandable Capabilities & Capacity (CSS Grid Rows Animation) */}
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          isActive
                            ? "grid-rows-[1fr] opacity-100 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-zinc-800/80"
                            : "grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0 border-transparent pointer-events-none"
                        }`}
                      >
                        <div className="overflow-hidden">
                          {/* Capabilities & Capacity Tags (Small & Consistent) */}
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {item.maxCapacity && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-zinc-900 border border-orange-500/40 text-[10px] sm:text-[11px] font-mono text-orange-300">
                                <span className="w-1 h-1 bg-orange-500 shrink-0" />
                                <span>
                                  {locale === "id" ? "Kapasitas Maksimal: " : "Max Capacity: "}
                                  <strong className="font-semibold text-white">{item.maxCapacity}</strong>
                                </span>
                              </span>
                            )}
                            {item.capabilities.map((cap, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-zinc-900 border border-zinc-800 text-[10px] sm:text-[11px] font-mono text-zinc-300"
                              >
                                <span className="w-1 h-1 bg-orange-500 shrink-0" />
                                <span>{cap}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 4: Desktop Square Toggle Icon */}
                    <div className="hidden lg:flex lg:col-span-1 items-center justify-end">
                      <div
                        className={`w-9 h-9 flex items-center justify-center transition-all duration-300 ease-out text-sm font-mono ${
                          isActive
                            ? "bg-orange-600 text-white font-bold"
                            : "border border-zinc-300 text-zinc-400 group-hover:border-orange-600 group-hover:text-orange-600"
                        }`}
                      >
                        <span
                          className={`inline-block transition-transform duration-300 ease-out ${
                            isActive ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          {isActive ? "−" : "+"}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
