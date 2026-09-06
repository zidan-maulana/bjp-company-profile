"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  const navLinks = [
    { name: t.nav.about, href: "#tentang-kami" },
    { name: t.nav.services, href: "#layanan" },
    { name: t.nav.standards, href: "#standar-mutu" },
    { name: t.nav.portfolio, href: "#portofolio" },
    { name: t.nav.contact, href: "#kontak" },
  ];

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
      setMobileMenuOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    tapCountRef.current += 1;

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    if (tapCountRef.current >= 3) {
      e.preventDefault();
      tapCountRef.current = 0;
      router.push("/admin/login");
      return;
    }

    // Reset tap count after 600ms if 3 taps not reached
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 600);

    handleSmoothScroll(e, "#hero");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isMounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        isScrolled
          ? "bg-[#090D14]/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
        {/* Brand Logo matching reference shape (Dual Slanted Parallelograms: Orange & White) */}
        <Link
          href="#hero"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group select-none cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <svg
              className="w-7 h-6"
              viewBox="0 0 32 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top Slanted Shape in Vibrant Orange */}
              <polygon points="10,0 28,0 20,11 2,11" fill="#EA580C" />
              {/* Bottom Slanted Shape in Clean White */}
              <polygon points="12,14 30,14 22,25 4,25" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="font-semibold text-base sm:text-lg tracking-wider text-white font-sans">
            BARUNA JAYA
          </span>
        </Link>

        {/* Center Navigation Links (Uppercase, widely tracked, minimalist) */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-[11px] font-mono tracking-[0.2em] text-zinc-300 hover:text-white transition-colors uppercase"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center">
          <Link
            href="#kontak"
            onClick={(e) => handleSmoothScroll(e, "#kontak")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-orange-500 text-zinc-950 hover:text-white transition-all duration-200 text-[11px] font-mono uppercase tracking-[0.15em] font-semibold group"
          >
            <span className="w-1.5 h-1.5 bg-orange-600 group-hover:bg-white transition-colors" />
            <span>{t.nav.cta}</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-label="Toggle menu"
          className="lg:hidden p-2 text-zinc-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090D14]/98 backdrop-blur-2xl border-b border-white/10 px-5 sm:px-8 py-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-xs font-mono tracking-widest text-zinc-300 hover:text-white uppercase py-2.5 px-2 hover:bg-white/5 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>


          <div className="pt-2">
            <Link
              href="#kontak"
              onClick={(e) => handleSmoothScroll(e, "#kontak")}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-orange-500 text-zinc-950 hover:text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors active:scale-[0.99]"
            >
              <span className="w-1.5 h-1.5 bg-orange-600" />
              <span>{t.nav.cta}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
