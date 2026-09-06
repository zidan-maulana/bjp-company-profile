"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { submitInquiryAction } from "@/actions/inquiry";
import { createInquirySchema } from "@/lib/validations/inquiry";
import { useParallax } from "@/hooks/useParallax";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/context/LanguageContext";

interface CompanyInfoData {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  operatingHours?: string | null;
}

interface ConsultationSectionProps {
  companyInfo?: CompanyInfoData | null;
}

export default function ConsultationSection({ companyInfo }: ConsultationSectionProps = {}) {
  const { t, locale } = useLanguage();
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.12 });
  const bgRef = useParallax<HTMLDivElement>(0.18);
  const leftColRef = useParallax<HTMLDivElement>(-0.06);
  const cardRef = useParallax<HTMLDivElement>(0.04);

  const rawPhone = companyInfo?.phone || "081283840614";
  const waPhone = rawPhone.startsWith("0")
    ? "62" + rawPhone.slice(1)
    : rawPhone.replace(/\D/g, "");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "injection-mold",
    specs: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const serviceOptions = [
    { value: "injection-mold", label: t.consultation.serviceOptions.injection },
    { value: "blow-mold", label: t.consultation.serviceOptions.blowing },
    { value: "cnc-edm", label: t.consultation.serviceOptions.cnc },
    { value: "mass-production", label: t.consultation.serviceOptions.trial },
    { value: "mold-modification", label: t.consultation.serviceOptions.repair },
  ];

  const serviceLabels: Record<string, string> = {
    "injection-mold": t.consultation.serviceOptions.injection,
    "blow-mold": t.consultation.serviceOptions.blowing,
    "cnc-edm": t.consultation.serviceOptions.cnc,
    "mass-production": t.consultation.serviceOptions.trial,
    "mold-modification": t.consultation.serviceOptions.repair,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const serviceLabels: Record<string, string> = {
      "injection-mold": t.consultation.serviceOptions.injection,
      "blow-mold": t.consultation.serviceOptions.blowing,
      "cnc-edm": t.consultation.serviceOptions.cnc,
      "mass-production": t.consultation.serviceOptions.trial,
      "mold-modification": t.consultation.serviceOptions.repair,
    };

    const selectedService = serviceLabels[formData.service] || formData.service;

    const formattedMessage =
      formData.specs && formData.specs.trim().length >= 10
        ? formData.specs.trim()
        : `Konsultasi layanan: ${selectedService}. Catatan spesifikasi: ${
            formData.specs.trim() || "Menunggu diskusi teknis lebih lanjut"
          }`;

    // 1. Client-side Zod validation
    const validationResult = createInquirySchema.safeParse({
      name: formData.name.trim(),
      companyName: formData.company.trim() || undefined,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      serviceType: selectedService,
      message: formattedMessage,
    });

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") {
          const uiField = path === "message" ? "specs" : path;
          formattedErrors[uiField] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      return;
    }

    // 2. Prepare WhatsApp URL with pre-filled technical data
    const greeting =
      locale === "id"
        ? "Halo Baruna Jaya Plastik, saya ingin berkonsultasi mengenai proyek cetakan mold:"
        : "Hello Baruna Jaya Plastik, I would like to consult on a mold tooling project:";
    const labelName = locale === "id" ? "*Nama:*" : "*Name:*";
    const labelCompany = locale === "id" ? "*Perusahaan:*" : "*Company:*";
    const labelEmail = "*Email:*";
    const labelPhone = locale === "id" ? "*No. Telp/WA:*" : "*Phone/WA:*";
    const labelService = locale === "id" ? "*Layanan:*" : "*Service:*";
    const labelSpecs = locale === "id" ? "*Spesifikasi/Catatan:*" : "*Specifications/Notes:*";

    const waText = encodeURIComponent(
      `${greeting}\n\n` +
      `${labelName} ${formData.name.trim()}\n` +
      `${labelCompany} ${formData.company.trim() || "-"}\n` +
      `${labelEmail} ${formData.email.trim()}\n` +
      `${labelPhone} ${formData.phone.trim()}\n` +
      `${labelService} ${selectedService}\n` +
      `${labelSpecs} ${formData.specs.trim() || "-"}`
    );
    const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

    setIsSubmitting(true);
    setLastWaUrl(waUrl);

    try {
      // 3. Simpan data lead ke PostgreSQL via Server Action
      const response = await submitInquiryAction({
        name: formData.name.trim(),
        companyName: formData.company.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceType: selectedService,
        message: formattedMessage,
      });

      if (!response.success && response.errors) {
        const serverFieldErrors: Record<string, string> = {};
        Object.entries(response.errors).forEach(([k, v]) => {
          if (Array.isArray(v) && v.length > 0) {
            const uiField = k === "message" ? "specs" : k;
            serverFieldErrors[uiField] = v[0];
          }
        });
        setFieldErrors(serverFieldErrors);
        setServerError(response.message || (locale === "id" ? "Gagal menyimpan formulir." : "Failed to submit form."));
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn("[BJP Inquiry Submission] Backend notice:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);

      // 4. Buka WhatsApp secara otomatis untuk percakapan instan
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 700);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="kontak"
      className="relative bg-[#0D0D0D] text-zinc-100 py-16 sm:py-24 lg:py-32 overflow-hidden select-none border-t border-[#1C1C1C]"
    >
      {/* Background Visual Manufaktur Redup Presisi Khas Dark Industrial (Parallax on Desktop) */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[8%] -bottom-[8%] h-[116%] z-0 pointer-events-none lg:will-change-transform"
      >
        <Image
          src="/portfolio/original-automotive-mold.jpg"
          alt="Workshop Cetakan Presisi Baruna Jaya Plastik"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-15 brightness-[0.35] contrast-125"
        />
        {/* Lapisan Gradient Vignette Charcoal #0D0D0D Selaras Standar Mutu */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/85 to-[#0D0D0D]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/70" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-stretch">
          
          {/* Kolom Kiri: Eyebrow + Head + Sub + Bottom Direct Support (Parallax on Desktop) */}
          <div
            ref={leftColRef}
            className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between self-stretch py-1 sm:py-2 lg:will-change-transform"
          >
            {/* Top Group: Eyebrow + Head + Sub (Inframe Slide from Left) */}
            <div
              className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              {/* Eyebrow Tag: Dot Orange + Monospace Semibold Text-[#888888] Sesuai Standar Mutu */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="w-1.5 h-1.5 bg-orange-600 inline-block" />
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#888888] uppercase">
                  {t.consultation.eyebrow}
                </span>
              </div>

              {/* Head: font-light text-white tracking-tight leading-[1.18] Sesuai BjpStandardSection */}
              <h2 className="text-2xl sm:text-4xl lg:text-[2.85rem] xl:text-[3.25rem] font-light text-white tracking-tight leading-[1.16] sm:leading-[1.18] max-w-lg">
                <span className="block sm:whitespace-nowrap">{t.consultation.titleLine1}</span>
                <span className="block sm:whitespace-nowrap">{t.consultation.titleLine2}</span>
              </h2>

              {/* Sub: Editorial Uppercase Monospace text-[#A0A0A0] leading-relaxed Sesuai Standar Mutu (2 Sentences) */}
              <div className="mt-6 sm:mt-10 max-w-lg">
                <p className="text-[11px] sm:text-[12px] font-mono text-[#A0A0A0] uppercase tracking-wider leading-relaxed">
                  {t.consultation.subtitleLine1}<br className="hidden sm:inline" />{" "}
                  {t.consultation.subtitleLine2}<br className="hidden sm:inline" />{" "}
                  {t.consultation.subtitleLine3}
                </p>
              </div>
            </div>

            {/* Blok Kontak Langsung WhatsApp (Inframe Slide Up) */}
            <div
              className={`pt-10 sm:pt-16 lg:pt-20 transition-all duration-[1200ms] delay-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <p className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase mb-3.5">
                {t.consultation.directChatLabel}
              </p>
              <a
                href={
                  locale === "id"
                    ? `https://wa.me/${waPhone}?text=Halo%20Baruna%20Jaya%20Plastik,%20saya%20ingin%20berkonsultasi%20langsung%20mengenai%20kebutuhan%20cetakan%20mold.`
                    : `https://wa.me/${waPhone}?text=Hello%20Baruna%20Jaya%20Plastik,%20I%20would%20like%20to%20consult%20directly%20regarding%20mold%20tooling.`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-5 py-3.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] hover:border-[#444444] text-white text-[11px] font-mono font-semibold tracking-[0.16em] uppercase transition-all duration-200 group cursor-pointer shadow-md w-full sm:w-auto"
              >
                {/* Logo WhatsApp Putih Murni */}
                <svg
                  className="w-4 h-4 text-white fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 3.42c-.19 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.56-.35-.3-.15-1.75-.86-2.02-1-.27-.13-.47-.2-.67.1-.2.3-.77.96-.94 1.16-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01" />
                </svg>
                <span>{t.consultation.directChatBtn}</span>
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Panel Formulir (Inframe Slide from Right + Parallax on Desktop) */}
          <div
            ref={cardRef}
            className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end items-center lg:items-stretch lg:will-change-transform"
          >
            <div
              className={`w-full max-w-[540px] transition-all duration-[1300ms] delay-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isInView ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
            <div className="relative bg-[#1A1A1A] border border-[#2B2B2B] p-6 sm:p-8 lg:p-9 shadow-2xl rounded-none w-full">
              
              {/* 4 Corner Registration Dots Permanen Oranye Khas BJP */}
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 w-1 h-1 bg-orange-600 z-20 select-none" />
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 w-1 h-1 bg-orange-600 z-20 select-none" />
              <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-1 h-1 bg-orange-600 z-20 select-none" />
              <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-1 h-1 bg-orange-600 z-20 select-none" />

              {/* Panel Header */}
              <div className="mt-1 mb-6 sm:mb-7 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-mono font-semibold uppercase tracking-[0.2em] text-white">
                  {t.consultation.formTitle}
                </h3>
                <div className="w-full h-px bg-[#2E2E2E] mt-3" />
              </div>

              {serverError && (
                <div className="mb-5 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-[11px] font-mono">
                  {serverError}
                </div>
              )}

              {submitted ? (
                <div className="py-10 text-center space-y-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600/20 border border-orange-600 text-orange-500 mb-1">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-mono font-semibold text-white tracking-wide uppercase">
                      {t.consultation.successTitle}
                    </h4>
                    <p className="text-xs font-mono text-[#A0A0A0] max-w-sm mx-auto leading-relaxed">
                      {t.consultation.successDesc}
                    </p>
                  </div>

                  {/* Tombol Langsung Buka Chat WhatsApp jika Popup Terhalang */}
                  {lastWaUrl && (
                    <div className="pt-2">
                      <a
                        href={lastWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold tracking-[0.16em] uppercase transition-colors shadow-lg cursor-pointer w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 3.42c-.19 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.56-.35-.3-.15-1.75-.86-2.02-1-.27-.13-.47-.2-.67.1-.2.3-.77.96-.94 1.16-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01" />
                        </svg>
                        <span>{locale === "id" ? "Buka Chat WhatsApp" : "Open WhatsApp Chat"}</span>
                      </a>
                    </div>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          service: "injection-mold",
                          specs: "",
                        });
                        setFieldErrors({});
                        setServerError(null);
                      }}
                      className="mt-2 px-4 py-2 border border-[#333333] hover:border-[#555555] text-xs font-mono text-[#CCCCCC] hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {t.consultation.sendAnother}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                  
                  {/* Field 1: Nama Lengkap */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase">
                      {t.consultation.labels.name} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        clearFieldError("name");
                      }}
                      className={`w-full bg-transparent border-b ${
                        fieldErrors.name ? "border-orange-500" : "border-[#333333] focus:border-orange-600"
                      } text-white font-sans font-light text-base sm:text-sm py-2 sm:py-1.5 outline-none transition-colors`}
                    />
                    {fieldErrors.name && (
                      <p className="text-orange-500 text-[10px] font-mono mt-0.5">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Field 2 & 3: Work Email & Phone Number (Grid 2 Kolom) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase">
                        {t.consultation.labels.email} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          clearFieldError("email");
                        }}
                        className={`w-full bg-transparent border-b ${
                          fieldErrors.email ? "border-orange-500" : "border-[#333333] focus:border-orange-600"
                        } text-white font-sans font-light text-base sm:text-sm py-2 sm:py-1.5 outline-none transition-colors`}
                      />
                      {fieldErrors.email && (
                        <p className="text-orange-500 text-[10px] font-mono mt-0.5">{fieldErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase">
                        {t.consultation.labels.phone} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          clearFieldError("phone");
                        }}
                        className={`w-full bg-transparent border-b ${
                          fieldErrors.phone ? "border-orange-500" : "border-[#333333] focus:border-orange-600"
                        } text-white font-sans font-light text-base sm:text-sm py-2 sm:py-1.5 outline-none transition-colors`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-orange-500 text-[10px] font-mono mt-0.5">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Field 4: Company Name (Opsional) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase">
                        {t.consultation.labels.company}
                      </label>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        {locale === "id" ? "(Opsional)" : "(Optional)"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => {
                        setFormData({ ...formData, company: e.target.value });
                        clearFieldError("companyName");
                      }}
                      className="w-full bg-transparent border-b border-[#333333] focus:border-orange-600 text-white font-sans font-light text-base sm:text-sm py-2 sm:py-1.5 outline-none transition-colors"
                    />
                  </div>

                  {/* Field 5: Service Required Dropdown (Custom Industrial Dropdown) */}
                  <div className="space-y-1 relative" ref={dropdownRef}>
                    <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase">
                      {t.consultation.labels.service}
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="w-full bg-transparent border-b border-[#333333] focus:border-orange-600 text-white font-sans font-light text-base sm:text-sm pt-2 sm:pt-1.5 pb-3.5 pr-8 text-left outline-none transition-colors cursor-pointer flex items-center justify-between select-none"
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                      >
                        <span className="truncate text-white">
                          {serviceLabels[formData.service] || formData.service}
                        </span>
                        <span
                          className={`absolute right-1 top-[42%] -translate-y-1/2 pointer-events-none text-[#F24E1E] transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <svg className="w-2.5 h-2.5 text-[#F24E1E]" viewBox="0 0 10 6" fill="currentColor">
                            <path d="M0 0.5L5 5.5L10 0.5H0Z" />
                          </svg>
                        </span>
                      </button>

                      {isDropdownOpen && (
                        <div
                          role="listbox"
                          className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#141414] border border-[#2E2E2E] shadow-2xl overflow-hidden py-1 divide-y divide-[#222222]/80"
                        >
                          {serviceOptions.map((opt) => {
                            const isSelected = formData.service === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setFormData({ ...formData, service: opt.value });
                                  clearFieldError("serviceType");
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-sans outline-none transition-colors flex items-center justify-between group cursor-pointer ${
                                  isSelected
                                    ? "bg-[#1E1E1E] text-white"
                                    : "text-[#B5B5B5] hover:bg-[#1C1C1C] hover:text-white"
                                }`}
                              >
                                <span className="truncate pr-3">{opt.label}</span>
                                {isSelected ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-zinc-700 shrink-0 transition-colors" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field 6: Service Required Details / Specs (Input Presisi Seragam) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase">
                        {t.consultation.labels.specs}
                      </label>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        {locale === "id" ? "(Opsional)" : "(Optional)"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.specs}
                      onChange={(e) => {
                        setFormData({ ...formData, specs: e.target.value });
                        clearFieldError("specs");
                      }}
                      className={`w-full bg-transparent border-b ${
                        fieldErrors.specs ? "border-orange-500" : "border-[#333333] focus:border-orange-600"
                      } text-white font-sans font-light text-base sm:text-sm py-2 sm:py-1.5 outline-none transition-colors`}
                    />
                    {fieldErrors.specs && (
                      <p className="text-orange-500 text-[10px] font-mono mt-0.5">{fieldErrors.specs}</p>
                    )}
                  </div>

                  {/* Tombol Submit Oranye Presisi Sesuai Tombol Utama */}
                  <div className="pt-3 sm:pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-2.5 py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-semibold tracking-[0.18em] uppercase transition-colors duration-200 shadow-lg ${
                        isSubmitting ? "opacity-80 cursor-wait" : "cursor-pointer active:scale-[0.99]"
                      }`}
                    >
                      {isSubmitting && (
                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      <span>{isSubmitting ? t.consultation.submittingBtn : t.consultation.submitBtn}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
