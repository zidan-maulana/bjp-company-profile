"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Save,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Info,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";
import { updateCompanyInfoAction } from "@/actions/company";
import { uploadImageAction } from "@/actions/upload";
import { CompanyInfoData, DEFAULT_STANDARDS_CARDS, StandardCard } from "@/lib/data/types";
import AdminHeaderActions from "./AdminHeaderActions";

interface CompanyClientProps {
  initialInfo: CompanyInfoData;
}

export default function CompanyClient({ initialInfo }: CompanyClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "hero" | "about" | "standards">("profile");

  // Parse standard cards safe
  let initialCards: StandardCard[] = DEFAULT_STANDARDS_CARDS;
  if (initialInfo?.standardsCards) {
    try {
      const parsed = JSON.parse(initialInfo.standardsCards);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialCards = parsed;
      }
    } catch {
      initialCards = DEFAULT_STANDARDS_CARDS;
    }
  }

  const [cards, setCards] = useState<StandardCard[]>(initialCards);

  const [formData, setFormData] = useState({
    // Profile & Contact
    companyName: initialInfo?.companyName || "Baruna Jaya Plastik",
    tagline: initialInfo?.tagline || "Produsen Mold & Cetakan Plastic Injection & Blowing Presisi",
    history: initialInfo?.history || "",
    vision: initialInfo?.vision || "",
    mission: initialInfo?.mission || "",
    address: initialInfo?.address || "",
    phone: initialInfo?.phone || "081283840614",
    email: initialInfo?.email || "barunajayaplastik.bjp@gmail.com",
    operatingHours: initialInfo?.operatingHours || "08.00 - 17.00 WIB (Senin - Sabtu)",
    googleMapsEmbed: initialInfo?.googleMapsEmbed || "",

    // Hero Section
    heroBgImage: initialInfo?.heroBgImage || "/mold-tool-close.jpg",
    heroHeadlineLine1: initialInfo?.heroHeadlineLine1 || "Fabrikasi mold presisi",
    heroHeadlineLine2: initialInfo?.heroHeadlineLine2 || "plastik injeksi & blowing.",
    heroStat1Value: initialInfo?.heroStat1Value || "100",
    heroStat1Label: initialInfo?.heroStat1Label || "Garansi Purna Jual",
    heroStat2Value: initialInfo?.heroStat2Value || "24+",
    heroStat2Label: initialInfo?.heroStat2Label || "Pengalaman Manufaktur",
    heroSpecDesc:
      initialInfo?.heroSpecDesc ||
      "Spesialis mold injeksi & blowing presisi tinggi dengan baja impor Stavax & DIN 1.2316 bersertifikasi resmi.",

    // About Section
    aboutEyebrow: initialInfo?.aboutEyebrow || "SEJAK 2001 DI KALIDERES, JAKARTA BARAT",
    aboutStatement:
      initialInfo?.aboutStatement ||
      "Beroperasi sejak 2001, Baruna Jaya Plastik memproduksi cetakan injeksi dan blowing presisi berbasis baja perkakas untuk memastikan kestabilan dimensi part serta kelancaran lini perakitan Anda.",

    // Standards Section
    standardsEyebrow: initialInfo?.standardsEyebrow || "STANDAR MUTU PRESISI",
    standardsTitle:
      initialInfo?.standardsTitle || "Standar pengerjaan ketat untuk cetakan presisi tinggi.",
    standardsEditorial:
      initialInfo?.standardsEditorial ||
      "SETIAP MOLD DIKERJAKAN DENGAN SPESIFIKASI MATERIAL TERVERIFIKASI DAN KONTROL KUALITAS KETAT. DARI PEMESINAN HINGGA TRIAL AKHIR, STANDAR KAMI MEMASTIKAN CETAKAN LANGSUNG SIAP BEKERJA PADA LINI INJEKSI ANDA.",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Handler
  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }

    // Tampilkan preview instan
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, heroBgImage: previewUrl }));

    setIsUploadingBg(true);
    setNotification(null);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await uploadImageAction(uploadData);

      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, heroBgImage: res.url as string }));
        setNotification({ text: "Foto Hero background berhasil diunggah ke Cloudflare R2." });
      } else {
        setNotification({
          text: res.error || "Gagal mengunggah foto ke Cloudflare R2.",
          isError: true,
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: "Terjadi gangguan saat mengunggah foto.", isError: true });
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleResetHeroBg = () => {
    setFormData((prev) => ({ ...prev, heroBgImage: "/mold-tool-close.jpg" }));
  };

  // Standards Card Handlers
  const handleCardChange = (index: number, field: keyof StandardCard, value: any) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCardBadgesChange = (index: number, badgesText: string) => {
    const badgesArray = badgesText
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    handleCardChange(index, "badges", badgesArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const payload = {
        ...formData,
        standardsCards: JSON.stringify(cards),
      };

      const res = await updateCompanyInfoAction(payload);
      if (res.success) {
        setNotification({ text: "Seluruh konten website & profil berhasil disimpan dan diperbarui di landing page." });
      } else {
        setNotification({ text: res.message || "Gagal menyimpan perubahan.", isError: true });
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: "Terjadi kesalahan saat menyimpan data.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil & Kontak", icon: Building2 },
    { id: "hero", label: "Hero Section & Background", icon: Sparkles },
    { id: "about", label: "Tentang Kami / Story", icon: BookOpen },
    { id: "standards", label: "Standar Mutu", icon: ShieldCheck },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Profil & Konten Website
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-1">
            Kelola teks, foto background Hero, narasi perusahaan, dan standar mutu publik.
          </p>
        </div>

        <AdminHeaderActions />
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-3.5 text-xs font-mono flex items-center gap-2.5 ${
            notification.isError
              ? "bg-red-950/40 border border-red-500/30 text-red-200"
              : "bg-emerald-950/40 border border-emerald-500/30 text-emerald-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Tab Navigation Segmented Bar */}
      <div className="bg-[#141414] border border-[#2B2B2B] p-1.5 grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2.5 px-3.5 py-3 text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-950/50"
                  : "bg-[#1A1A1A] text-zinc-400 hover:text-white hover:bg-[#242424] border border-[#2B2B2B]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: PROFIL & KONTAK */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {/* Card 1: Identitas & Slogan */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
              <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>Identitas & Slogan</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">BLOK 01</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Nama Perusahaan / Workshop</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Tagline / Slogan</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Sejarah & Rekam Jejak Workshop</label>
                  <textarea
                    rows={4}
                    name="history"
                    value={formData.history}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Kontak & Jam Kerja */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
              <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>Kontak & Jam Kerja</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">BLOK 02</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Nomor WhatsApp / Telp (Otomatis ke Tombol Konsultasi)</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Email Resmi</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Jam Operasional</label>
                  <input
                    type="text"
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Alamat Workshop */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
              <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>Alamat Workshop Kalideres</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">BLOK 03</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Alamat Lengkap Workshop</label>
                  <textarea
                    rows={4}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Visi & Misi */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
              <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                  <Info className="w-4 h-4" />
                  <span>Visi & Misi Perusahaan</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">BLOK 04</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Visi Perusahaan</label>
                  <textarea
                    rows={2}
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Misi Perusahaan</label>
                  <textarea
                    rows={2}
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO SECTION & BACKGROUND */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            {/* Background Image Card */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
              <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Foto Background Hero Section</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">HERO VISUAL</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Visual Preview (Kiri: Lebar & Mengesankan) */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="relative aspect-video w-full flex-1 min-h-[220px] bg-[#141414] border border-[#333333] overflow-hidden group">
                    <Image
                      src={formData.heroBgImage || "/mold-tool-close.jpg"}
                      alt="Hero Background Preview"
                      fill
                      className="object-cover brightness-[0.6] contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-between p-4">
                      <div>
                        <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-semibold">
                          PREVIEW TAMPILAN HERO
                        </div>
                        <div className="text-xs font-mono text-white font-medium uppercase tracking-wider mt-0.5">
                          {formData.heroBgImage === "/mold-tool-close.jpg"
                            ? "Foto Default Bawaan Workshop"
                            : "Foto Kustom Aktif"}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-black/70 border border-white/20 text-zinc-300 px-2 py-1 uppercase">
                        16 : 9
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload & Technical Specs Panel (Kanan: Padat & Terstruktur) */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-[#141414] border border-[#2B2B2B] p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                      <span className="text-xs font-mono text-zinc-300 uppercase font-semibold">Spesifikasi Media</span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE BACKGROUND
                      </span>
                    </div>

                    {/* Parameter Grid */}
                    <div className="grid grid-cols-2 gap-2.5 pt-3 text-[11px] font-mono">
                      <div className="p-2.5 bg-[#1A1A1A] border border-[#2B2B2B]">
                        <span className="text-[10px] text-zinc-500 block uppercase">Rasio Aspek</span>
                        <span className="text-white font-semibold">16:9 Landscape</span>
                      </div>
                      <div className="p-2.5 bg-[#1A1A1A] border border-[#2B2B2B]">
                        <span className="text-[10px] text-zinc-500 block uppercase">Resolusi Ideal</span>
                        <span className="text-white font-semibold">1920 × 1080 px</span>
                      </div>
                      <div className="p-2.5 bg-[#1A1A1A] border border-[#2B2B2B]">
                        <span className="text-[10px] text-zinc-500 block uppercase">Format File</span>
                        <span className="text-white font-semibold">JPG, PNG, WebP</span>
                      </div>
                      <div className="p-2.5 bg-[#1A1A1A] border border-[#2B2B2B]">
                        <span className="text-[10px] text-zinc-500 block uppercase">Filter Otomatis</span>
                        <span className="text-white font-semibold">Dark Tint 60%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#262626]">
                    <label className={`w-full h-10 ${isUploadingBg ? "bg-orange-800 cursor-not-allowed opacity-80" : "bg-orange-600 hover:bg-orange-500 cursor-pointer"} text-white text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors shadow-md`}>
                      {isUploadingBg ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengunggah ke R2...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Unggah Foto Baru</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingBg}
                        onChange={handleHeroBgUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.heroBgImage !== "/mold-tool-close.jpg" && (
                      <button
                        type="button"
                        onClick={handleResetHeroBg}
                        className="w-full h-9 bg-[#1E1E1E] hover:bg-[#282828] text-zinc-300 text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#333333]"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                        <span>Kembalikan Foto Bawaan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Headlines & Stats Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* Left Column: Headlines */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
                <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                    <Layers className="w-4 h-4" />
                    <span>Headline Utama (2 Baris)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">HERO TEXT</span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-zinc-300 mb-3 uppercase">Headline Baris 1</label>
                    <input
                      type="text"
                      name="heroHeadlineLine1"
                      value={formData.heroHeadlineLine1}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-3 uppercase">Headline Baris 2</label>
                    <input
                      type="text"
                      name="heroHeadlineLine2"
                      value={formData.heroHeadlineLine2}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-3 uppercase">Deskripsi Teknis (Sebelah Tombol CTA)</label>
                    <textarea
                      rows={3}
                      name="heroSpecDesc"
                      value={formData.heroSpecDesc}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors leading-relaxed resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: 2 Stat Cards */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
                <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Dua Kartu Statistik Hero</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">HERO STATS</span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  {/* Stat Card 1 */}
                  <div className="p-4 bg-[#141414] border border-[#2B2B2B] space-y-3">
                    <span className="text-orange-400 font-bold uppercase text-[11px] block">Kartu Statistik 1</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-zinc-400 mb-2 text-[10px] uppercase">Nilai/Angka</label>
                        <input
                          type="text"
                          name="heroStat2Value"
                          value={formData.heroStat2Value}
                          onChange={handleChange}
                          placeholder="24+"
                          className="w-full p-2 bg-[#1A1A1A] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-zinc-400 mb-2 text-[10px] uppercase">Label Statistik</label>
                        <input
                          type="text"
                          name="heroStat2Label"
                          value={formData.heroStat2Label}
                          onChange={handleChange}
                          placeholder="Pengalaman Manufaktur"
                          className="w-full p-2 bg-[#1A1A1A] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="p-4 bg-[#141414] border border-[#2B2B2B] space-y-3">
                    <span className="text-orange-400 font-bold uppercase text-[11px] block">Kartu Statistik 2</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-zinc-400 mb-2 text-[10px] uppercase">Nilai/Angka</label>
                        <input
                          type="text"
                          name="heroStat1Value"
                          value={formData.heroStat1Value}
                          onChange={handleChange}
                          placeholder="100"
                          className="w-full p-2 bg-[#1A1A1A] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-zinc-400 mb-2 text-[10px] uppercase">Label Statistik</label>
                        <input
                          type="text"
                          name="heroStat1Label"
                          value={formData.heroStat1Label}
                          onChange={handleChange}
                          placeholder="Garansi Purna Jual"
                          className="w-full p-2 bg-[#1A1A1A] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TENTANG KAMI / STORY */}
        {activeTab === "about" && (
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
            <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                <BookOpen className="w-4 h-4" />
                <span>Story & Editorial Statement Section</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">ABOUT STORY</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-mono">
              {/* Kolom Kiri: Label Eyebrow & Preview (Sempit) */}
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between">
                <div>
                  <label className="block text-zinc-300 mb-3 uppercase font-medium">Label Eyebrow Kiri</label>
                  <input
                    type="text"
                    name="aboutEyebrow"
                    value={formData.aboutEyebrow}
                    onChange={handleChange}
                    placeholder="Tentang Kami"
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Preview Badge - Ukuran shape sama persis dengan input di atasnya */}
                <div className="pt-3">
                  <label className="block text-zinc-300 mb-3 uppercase font-medium">Preview Badge Publik</label>
                  <div className="w-full p-2.5 bg-[#141414] border border-[#333333] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-600 inline-block shrink-0" />
                    <span className="text-[11px] font-mono font-semibold tracking-[0.2em] text-zinc-300 uppercase truncate">
                      {formData.aboutEyebrow || "TENTANG KAMI"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Pernyataan Editorial Besar (Sama rata dengan 2 shape kiri) */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
                <label className="block text-zinc-300 mb-3 uppercase font-medium">Pernyataan Editorial Besar</label>
                <textarea
                  name="aboutStatement"
                  value={formData.aboutStatement}
                  onChange={handleChange}
                  placeholder="Tuliskan pernyataan komitmen / narasi utama perusahaan..."
                  className="w-full flex-1 min-h-[110px] p-3 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STANDAR MUTU */}
        {activeTab === "standards" && (
          <div className="space-y-6">
            {/* Section Headings */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 space-y-4">
              <div className="pb-3 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pengantar Standar Mutu</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">HEADER</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs font-mono">
                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Label Eyebrow</label>
                  <input
                    type="text"
                    name="standardsEyebrow"
                    value={formData.standardsEyebrow}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-3 uppercase">Judul Utama Standar</label>
                  <input
                    type="text"
                    name="standardsTitle"
                    value={formData.standardsTitle}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-zinc-300 mb-3 uppercase">Paragraf Editorial Standar</label>
                  <textarea
                    rows={3}
                    name="standardsEditorial"
                    value={formData.standardsEditorial}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500 transition-colors leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 4 Cards Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  4 Kartu Pilar Standar Mutu (Carousel)
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {cards.map((card, idx) => (
                  <div key={card.id || idx} className="bg-[#1A1A1A] border border-[#2B2B2B] p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
                      <span className="text-orange-400 font-mono font-bold text-xs">{card.id}</span>
                      <span className="text-[10px] font-mono text-zinc-400">PILAR {idx + 1}</span>
                    </div>

                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <label className="block text-zinc-300 mb-2 text-[11px] uppercase">Judul Kartu</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                          className="w-full p-2 bg-[#141414] border border-[#333333] text-white text-xs font-sans focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-300 mb-2 text-[11px] uppercase">Deskripsi / Subteks</label>
                        <textarea
                          rows={3}
                          value={card.desc}
                          onChange={(e) => handleCardChange(idx, "desc", e.target.value)}
                          className="w-full p-2 bg-[#141414] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500 resize-none leading-relaxed uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-300 mb-2 text-[11px] uppercase">
                          Badges / Poin Spesifikasi (Pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          value={card.badges.join(", ")}
                          onChange={(e) => handleCardBadgesChange(idx, e.target.value)}
                          className="w-full p-2 bg-[#141414] border border-[#333333] text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                          placeholder="BAJA IMPOR, TOLERANSI ±0.01 MM, CNC HIGH-SPEED..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Save Bar */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] py-3 px-4 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-30 shadow-xl mt-8 mb-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <span className="text-orange-400 font-bold">*</span>
            <span>Perubahan akan otomatis terupdate seketika pada landing page website.</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto h-9 px-5 bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-orange-950/40 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>MENYIMPAN PERUBAHAN...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>SIMPAN PERUBAHAN WEBSITE</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
