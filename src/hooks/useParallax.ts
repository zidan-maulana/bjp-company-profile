"use client";

import { useEffect, useRef } from "react";

/**
 * useParallax Hook
 * Menghasilkan efek animasi parallax 3D (translateY) yang mulus (60-120 FPS GPU-accelerated) saat scroll.
 * EKSKLUSIF HANYA AKTIF PADA DESKTOP (window.innerWidth >= minWidth, default 1024px / lg).
 * Pada mobile / tablet (< 1024px), transform dibersihkan sehingga tata letak mobile tetap 100% normal dan stabil.
 *
 * @param speed Koefisien kecepatan gerak (-0.2 s/d 0.3)
 * @param minWidth Batas breakpoint desktop (default 1024px)
 */
export function useParallax<T extends HTMLElement = HTMLElement>(
  speed: number = 0.1,
  minWidth: number = 1024
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      if (typeof window === "undefined") return;
      const isDesktop = window.innerWidth >= minWidth;
      const el = ref.current;
      if (!el) return;

      if (!isDesktop) {
        if (el.style.transform) {
          el.style.transform = "";
        }
        return;
      }

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Hanya kalkulasi jika elemen mendekati atau berada di viewport
      if (rect.bottom >= -200 && rect.top <= windowHeight + 200) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = elementCenter - viewportCenter;
        const yOffset = Math.round(distanceFromCenter * speed * 10) / 10;

        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(update);
    };

    const onResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Inisialisasi awal
    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ref.current) {
        ref.current.style.transform = "";
      }
    };
  }, [speed, minWidth]);

  return ref;
}
