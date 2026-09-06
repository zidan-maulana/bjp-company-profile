"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";

interface PortfolioImage {
  id?: string;
  imageUrl: string;
  caption?: string | null;
  orderIndex?: number;
}

export interface PortfolioItemData {
  id: string;
  slug?: string;
  title: string;
  description: string;
  material: string;
  category: string;
  clientName?: string | null;
  images?: PortfolioImage[];
}

interface PortfolioSectionProps {
  initialItems?: PortfolioItemData[];
}

export default function PortfolioSection({ initialItems }: PortfolioSectionProps) {
  const { t } = useLanguage();

  const portfolioItems =
    initialItems && initialItems.length > 0
      ? initialItems.map((item, idx) => ({
          id: String(idx + 1).padStart(2, "0"),
          dbId: item.id,
          title: item.title,
          spec: `${item.category.toUpperCase()} • ${item.material.toUpperCase()}${
            item.clientName ? ` • ${item.clientName.toUpperCase()}` : ""
          }`,
          image:
            item.images && item.images[0]?.imageUrl
              ? item.images[0].imageUrl
              : "/portfolio/original-automotive-mold.jpg",
          description: item.description,
        }))
      : t.portfolio.items;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastSwipeTimeRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerPage(4);
      } else if (window.innerWidth >= 640) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(portfolioItems.length / cardsPerPage);
  const maxIndex = portfolioItems.length - cardsPerPage;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const maxIndexRef = useRef(maxIndex);
  maxIndexRef.current = maxIndex;

  const cardsPerPageRef = useRef(cardsPerPage);
  cardsPerPageRef.current = cardsPerPage;

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(Math.max(0, maxIndex));
    }
  }, [maxIndex, currentIndex]);

  // Listener untuk Trackpad Gesture 2 Jari (Swipe Halus & Anti Keluar Browser)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
        e.preventDefault();

        const now = Date.now();
        const COOLDOWN_MS = 1200; // Sinkron dengan durasi transisi 1200ms (tenang dan anggun)

        if (now - lastSwipeTimeRef.current < COOLDOWN_MS) {
          wheelAccumulatorRef.current = 0;
          return;
        }

        wheelAccumulatorRef.current += e.deltaX;

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          wheelAccumulatorRef.current = 0;
        }, 120);

        const threshold = 35;
        const currentIdx = currentIndexRef.current;
        const maxIdx = maxIndexRef.current;
        const step = cardsPerPageRef.current;

        if (wheelAccumulatorRef.current > threshold && currentIdx < maxIdx) {
          lastSwipeTimeRef.current = now;
          wheelAccumulatorRef.current = 0;
          setCurrentIndex((prev) => Math.min(maxIdx, prev + step));
        } else if (wheelAccumulatorRef.current < -threshold && currentIdx > 0) {
          lastSwipeTimeRef.current = now;
          wheelAccumulatorRef.current = 0;
          setCurrentIndex((prev) => Math.max(0, prev - step));
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Pointer Drag Mouse & Touch Langsung
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
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
    const threshold = 50;
    const step = cardsPerPage;
    if (dragOffset < -threshold && currentIndex < maxIndex) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + step));
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(0, prev - step));
    }
    setDragOffset(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - cardsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + cardsPerPage));
  };

  const currentPage = Math.min(
    totalPages,
    Math.floor(currentIndex / cardsPerPage) + 1
  );

  const headerRef = useParallax<HTMLDivElement>(-0.06);
  const cardsRef = useParallax<HTMLDivElement>(0.04);
  const [inViewRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.12 });

  return (
    <section
      ref={sectionRef}
      id="portofolio"
      className="relative bg-white text-zinc-950 py-20 sm:py-28 lg:py-32 border-t border-zinc-200 overflow-hidden select-none overscroll-x-none"
      style={{
        overscrollBehaviorX: "none",
      }}
    >
      <div ref={inViewRef} className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14">
        
        {/* Top Header: Eyebrow + Headline di Kiri, Deskripsi Editorial di Kanan (Parallax on Desktop) */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16 lg:will-change-transform"
        >
          {/* Eyebrow + Headline (Inframe Slide from Left) */}
          <div
            className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isInView ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <span className="w-1.5 h-1.5 bg-orange-600 inline-block" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.25em] text-zinc-500 uppercase">
                {t.portfolio.eyebrow}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-light text-zinc-950 tracking-tight leading-[1.2] max-w-2xl">
              {t.portfolio.title}
            </h2>
          </div>

          {/* Right Description (Inframe Fade Up) */}
          <div
            className={`max-w-sm transition-all duration-[1200ms] delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <p className="text-[11px] sm:text-[12px] font-mono text-zinc-600 leading-relaxed uppercase tracking-wider">
              {t.portfolio.subtitle}
            </p>
          </div>
        </div>

        {/* 4 Cards Row Carousel Container dengan Touch / Trackpad Drag (Parallax on Desktop) */}
        <div
          ref={cardsRef}
          className="lg:will-change-transform"
        >
        <div
          className={`transition-all duration-[1300ms] delay-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
        <div
          ref={viewportRef}
          className={`overflow-hidden w-full select-none touch-pan-y py-4 -my-4 overscroll-x-none [--card-w:100%] sm:[--card-w:calc((100%-24px)/2)] lg:[--card-w:calc((100%-72px)/4)] ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ overscrollBehaviorX: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="flex gap-6"
            style={{
              transform: `translateX(calc(-${currentIndex} * (var(--card-w) + 24px) + ${dragOffset}px))`,
              transition: isDragging
                ? "none"
                : "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "transform",
            }}
          >
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="w-[var(--card-w)] flex-shrink-0 relative group bg-[#FAFAFA] border border-zinc-200 hover:border-zinc-400 p-3 sm:p-4 rounded-none transition-colors duration-200"
              >
                {/* 4 Corner Precision Registration Dots Tetap Berwarna Orange */}
                <span className="absolute top-2 left-2 w-1 h-1 bg-orange-600 z-20" />
                <span className="absolute top-2 right-2 w-1 h-1 bg-orange-600 z-20" />
                <span className="absolute bottom-2 left-2 w-1 h-1 bg-orange-600 z-20" />
                <span className="absolute bottom-2 right-2 w-1 h-1 bg-orange-600 z-20" />

                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-200 rounded-none">
                  {item.image.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                  {/* Subtle Corner ID Pill */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white tracking-wider">
                    {item.id}
                  </span>
                </div>

                {/* Content Area */}
                <div className="pt-4 pb-2 px-1">
                  <h3 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-wider mt-1.5 line-clamp-1">
                    {item.spec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation: Pagination Counter & Arrow Buttons (Single-row mobile responsive) */}
        <div className="flex flex-row items-center justify-between gap-4 mt-6 sm:mt-5">
          
          {/* Left: Page Counter & Precision Indicator Dash */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <span className="text-[11px] sm:text-xs font-mono font-medium text-zinc-500 tracking-wider">
              {t.portfolio.pageLabel}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950">
              {String(currentPage).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>

            {/* Dash Indicators (Hidden on small mobile screens to keep row compact) */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
              {Array.from({ length: totalPages }).map((_, pIdx) => {
                const isActive = currentPage === pIdx + 1;
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setCurrentIndex(pIdx * cardsPerPage)}
                    className={`h-1 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-none cursor-pointer ${
                      isActive ? "w-10 bg-orange-600" : "w-5 bg-zinc-300 hover:bg-zinc-400"
                    }`}
                    aria-label={`Pindah ke halaman ${pIdx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Square Arrow Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-10 h-10 sm:w-11 sm:h-11 border flex items-center justify-center font-mono text-base transition-all duration-200 rounded-none cursor-pointer ${
                currentIndex === 0
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed bg-transparent"
                  : "border-zinc-300 text-zinc-800 hover:bg-orange-600 hover:border-orange-600 hover:text-white bg-white active:scale-95"
              }`}
              aria-label={t.portfolio.prevBtn}
            >
              ←
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`w-10 h-10 sm:w-11 sm:h-11 border flex items-center justify-center font-mono text-base transition-all duration-200 rounded-none cursor-pointer ${
                currentIndex >= maxIndex
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed bg-transparent"
                  : "border-zinc-300 text-zinc-800 hover:bg-orange-600 hover:border-orange-600 hover:text-white bg-white active:scale-95"
              }`}
              aria-label={t.portfolio.nextBtn}
            >
              →
            </button>
          </div>

        </div>
        </div>
        </div>

      </div>
    </section>
  );
}
