"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParallax } from "@/hooks/useParallax";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";
import { CompanyInfoData, StandardCard } from "@/lib/data/types";

interface BjpStandardSectionProps {
  companyInfo?: CompanyInfoData | null;
}

export default function BjpStandardSection({ companyInfo }: BjpStandardSectionProps) {
  const { locale, t } = useLanguage();

  let standardCards: StandardCard[] = t.standards.cards;
  if (locale === "id" && companyInfo?.standardsCards) {
    try {
      const parsed = JSON.parse(companyInfo.standardsCards);
      if (Array.isArray(parsed) && parsed.length > 0) {
        standardCards = parsed;
      }
    } catch {
      standardCards = t.standards.cards;
    }
  }

  const standardsEyebrow =
    locale === "id" && companyInfo?.standardsEyebrow
      ? companyInfo.standardsEyebrow
      : t.standards.eyebrow;

  const standardsTitle =
    locale === "id" && companyInfo?.standardsTitle
      ? companyInfo.standardsTitle
      : t.standards.title;

  const standardsEditorial =
    locale === "id" && companyInfo?.standardsEditorial
      ? companyInfo.standardsEditorial
      : t.standards.editorial;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = isDesktop ? standardCards.length - 2 : standardCards.length - 1;

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Refs untuk Section, Viewport & Gesture Trackpad 2 Jari
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastSwipeTimeRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const maxIndexRef = useRef(maxIndex);
  maxIndexRef.current = maxIndex;

  // Listener untuk Trackpad Gesture 2 Jari: Aktif di seluruh section & Blokir Navigasi Back Browser
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Deteksi gestur horizontal (swipe 2 jari di trackpad)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
        // PENTING: Selalu cegah aksi default browser (seperti swipe back/forward history navigation)
        e.preventDefault();

        const now = Date.now();
        const COOLDOWN_MS = 800; // Durasi transisi kartu yang lebih tenang dan mewah

        // Jika kartu sedang bergeser, telan event inersia dan reset akumulator
        if (now - lastSwipeTimeRef.current < COOLDOWN_MS) {
          wheelAccumulatorRef.current = 0;
          return;
        }

        wheelAccumulatorRef.current += e.deltaX;

        // Reset akumulator jika gerakan terhenti sebelum mencapai batas threshold
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          wheelAccumulatorRef.current = 0;
        }, 120);

        const threshold = 30; // Ambang batas perpindahan kartu
        const currentIdx = currentIndexRef.current;
        const maxIdx = maxIndexRef.current;

        if (wheelAccumulatorRef.current > threshold && currentIdx < maxIdx) {
          lastSwipeTimeRef.current = now;
          wheelAccumulatorRef.current = 0;
          setCurrentIndex((prev) => Math.min(maxIdx, prev + 1));
        } else if (wheelAccumulatorRef.current < -threshold && currentIdx > 0) {
          lastSwipeTimeRef.current = now;
          wheelAccumulatorRef.current = 0;
          setCurrentIndex((prev) => Math.max(0, prev - 1));
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Pointer Events untuk 1-Click Drag Mouse & Touch Langsung
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Hanya klik kiri utama
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    if ((currentIndex === 0 && delta > 0) || (currentIndex === maxIndex && delta < 0)) {
      setDragOffset(delta * 0.25);
    } else {
      setDragOffset(delta);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
    const threshold = 35; // Sensitivitas responsif (35px)
    if (dragOffset < -threshold && currentIndex < maxIndex) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
    setDragOffset(0);
  };

  // Kalkulasi Efek Kedalaman & Beralih ke Belakang (Fluid Depth Layering)
  const getCardVisuals = (idx: number) => {
    const isActive = isDesktop
      ? idx === currentIndex || idx === currentIndex + 1
      : idx === currentIndex;
    const isPast = idx < currentIndex;

    if (isActive) {
      return {
        transform: "scale(1) translateY(0px)",
        opacity: 1,
        zIndex: 20,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
      };
    }

    if (isPast) {
      // Kartu yang beralih ke kiri: surut ke belakang dengan mulus dan proporsional
      return {
        transform: "scale(0.93) translateY(6px)",
        opacity: 0.35,
        zIndex: 10,
        boxShadow: "0 8px 24px -6px rgba(0, 0, 0, 0.5)",
      };
    }

    // isFuture: Kartu berikutnya menunggu di layer belakang
    return {
      transform: "scale(0.93) translateY(6px)",
      opacity: 0.45,
      zIndex: 10,
      boxShadow: "0 8px 24px -6px rgba(0, 0, 0, 0.5)",
    };
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

  const leftColRef = useParallax<HTMLDivElement>(-0.07);
  const rightColRef = useParallax<HTMLDivElement>(0.05);
  const [inViewRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.12 });

  return (
    <section
      ref={sectionRef}
      id="standar-mutu"
      className="relative bg-[#0D0D0D] text-zinc-100 py-16 sm:py-28 lg:py-32 border-t border-[#1C1C1C] overflow-hidden select-none overscroll-x-none"
      style={{
        overscrollBehaviorX: "none",
      }}
    >
      <div ref={inViewRef} className="relative max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
          
          {/* Sisi Kiri: Headline di atas, Paragraph & Buttons di bawah (Parallax on Desktop) */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 flex flex-col justify-between py-2 lg:will-change-transform"
          >
            {/* Top Area: Eyebrow + 2-Line Headline (Inframe Slide from Left) */}
            <div
              className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 bg-orange-600 inline-block" />
                <span className="text-[11px] font-mono font-semibold tracking-[0.25em] text-[#888888] uppercase">
                  {standardsEyebrow}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-[2.85rem] font-light text-white tracking-tight leading-[1.18] max-w-md">
                {standardsTitle}
              </h2>
            </div>

            {/* Bottom Area: Editorial Uppercase Monospace Paragraph + Buttons (Inframe Slide Up) */}
            <div
              className={`pt-8 lg:pt-0 transition-all duration-[1200ms] delay-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <p className="text-[11px] sm:text-[12px] font-mono text-[#A0A0A0] leading-relaxed uppercase tracking-wider mb-6 sm:mb-8 max-w-sm">
                {standardsEditorial}
              </p>

              <div className="flex flex-row items-center gap-4 sm:gap-6">
                <Link
                  href="#layanan"
                  onClick={(e) => handleSmoothScroll(e, "#layanan")}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-colors duration-200 active:scale-[0.99]"
                >
                  <span className="w-1.5 h-1.5 bg-white inline-block" />
                  <span>{t.standards.btnServices}</span>
                </Link>

                <Link
                  href="#kontak"
                  onClick={(e) => handleSmoothScroll(e, "#kontak")}
                  className="inline-flex items-center justify-center py-2 text-[11px] sm:text-xs font-mono font-semibold text-[#CCCCCC] hover:text-white uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-colors duration-200 whitespace-nowrap"
                >
                  {t.standards.btnContact}
                </Link>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Slider dengan 2 Card Berdampingan (Parallax on Desktop) */}
          <div
            ref={rightColRef}
            className="lg:col-span-7 flex flex-col justify-between [--card-w:100%] sm:[--card-w:calc((100%-20px)/2)] lg:will-change-transform"
          >
            <div
              className={`flex flex-col justify-between h-full transition-all duration-[1300ms] delay-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
            {/* Cards Carousel Viewport dengan Trackpad 2 Jari, 1-Click Drag & Anti-Clipping Padding */}
            <div
              ref={viewportRef}
              className={`overflow-hidden w-full select-none touch-pan-y py-6 -my-4 px-1 -mx-1 overscroll-x-none ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                overscrollBehaviorX: "none",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className="flex gap-5"
                style={{
                  transform: `translateX(calc(-${currentIndex} * (var(--card-w) + 20px) + ${dragOffset}px))`,
                  transition: isDragging
                    ? "none"
                    : "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
              >
                {standardCards.map((card, idx) => {
                  const visuals = getCardVisuals(idx);
                  const isActive = isDesktop
                    ? idx === currentIndex || idx === currentIndex + 1
                    : idx === currentIndex;
                  const isPast = idx < currentIndex;

                  return (
                    <div
                      key={card.id}
                      className="relative bg-[#2D2D2D] p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] w-[var(--card-w)] flex-shrink-0 select-none rounded-none"
                      style={{
                        transform: visuals.transform,
                        transformOrigin: "center center",
                        opacity: visuals.opacity,
                        zIndex: visuals.zIndex,
                        boxShadow: visuals.boxShadow,
                        transition: isDragging
                          ? "none"
                          : "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
                        willChange: "transform, opacity",
                      }}
                    >
                      {/* Depth Dim Overlay (Meredup ke belakang dengan akselerasi GPU murni, tanpa filter CPU lag) */}
                      <div
                        className="absolute inset-0 bg-[#0A0A0A] pointer-events-none z-10"
                        style={{
                          opacity: isActive ? 0 : isPast ? 0.65 : 0.45,
                          transition: isDragging
                            ? "none"
                            : "opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />

                      {/* 4 Titik Sudut Presisi Berwarna Orange dengan Jarak Lega dari Konten */}
                      <span className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 w-1 h-1 bg-orange-600 z-20 select-none" />
                      <span className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-1 h-1 bg-orange-600 z-20 select-none" />
                      <span className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 w-1 h-1 bg-orange-600 z-20 select-none" />
                      <span className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 w-1 h-1 bg-orange-600 z-20 select-none" />

                      {/* Top Content Area */}
                      <div className="relative z-20">
                        {/* Card ID dengan gap atas dan bawah proporsional */}
                        <span className="text-sm font-mono text-[#E0E0E0] block mt-5 sm:mt-6 mb-6 sm:mb-7">
                          {card.id}
                        </span>

                        {/* Card Headline (2 Baris Rapi & Sejajar Presisi) */}
                        <h3 className="text-lg sm:text-xl xl:text-2xl font-light text-white tracking-tight leading-[1.25] mb-2.5 sm:mb-3 min-h-[3.25rem] sm:min-h-[3.5rem] lg:min-h-[3.75rem] flex items-start">
                          {card.title}
                        </h3>

                        {/* Card Subtext Uppercase Putih Sesuai Headtext */}
                        <p className="text-[10px] sm:text-[10.5px] font-mono text-white leading-relaxed uppercase tracking-wider mb-4 sm:mb-5 min-h-[4.5rem] sm:min-h-[4.75rem]">
                          {card.desc}
                        </p>

                        {/* Thin Divider Line Directly Under Subtext Sesuai Referensi */}
                        <div className="w-full h-px bg-[#404040]" />
                      </div>

                      {/* Bottom Content Area: 6 Badges Grid (Naik ke atas dengan gap bawah simetris sesuai gap angka) */}
                      <div className="mt-6 sm:mt-8 mb-5 sm:mb-6 relative z-20">
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          {card.badges.map((badge, bIdx) => (
                            <div
                              key={bIdx}
                              className="px-1.5 sm:px-2 py-2 sm:py-2.5 bg-[#242424] border border-[#2B2B2B] text-[8px] sm:text-[8.5px] xl:text-[9px] font-mono text-[#8E8E8E] tracking-tight text-center flex items-center justify-center whitespace-nowrap rounded-none overflow-hidden"
                            >
                              {badge}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slide Indicator: Minimalist Precision Dash Bars */}
            <div className="w-full flex items-center gap-2.5 mt-6 sm:mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-none cursor-pointer ${
                      isActive
                        ? "w-12 sm:w-16 bg-orange-600"
                        : "w-6 sm:w-8 bg-[#2A2A2A] hover:bg-[#444444]"
                    }`}
                    aria-label={`Pindah ke slide ${idx + 1}`}
                  />
                );
              })}
            </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

