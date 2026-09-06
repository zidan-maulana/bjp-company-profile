import { db, isDatabaseOnline } from "@/lib/db";
import { readLocalData, writeLocalData } from "./storage";

export interface StandardCard {
  id: string;
  title: string;
  desc: string;
  badges: string[];
}

export const DEFAULT_STANDARDS_CARDS: StandardCard[] = [
  {
    id: "[01]",
    title: "Toleransi mikron pada geometri rumit",
    desc: "KAMI MENERAPKAN PEMESINAN CNC HIGH-SPEED, WIRE CUT, DAN SINKER EDM DENGAN TOLERANSI HINGGA ±0.01 MM UNTUK MENJAGA AKURASI PROFIL CORE DAN CAVITY.",
    badges: [
      "BAJA IMPOR BERSERTIFIKAT",
      "TOLERANSI ±0.01 MM",
      "CNC HIGH-SPEED",
      "WIRE CUT & SINKER EDM",
      "PROFIL KAVITAS PRESISI",
      "VERIFIKASI CMM / MIKRON",
    ],
  },
  {
    id: "[02]",
    title: "Transparansi progres & koordinasi teknis",
    desc: "TIM ENGINEERING KAMI MEMBERIKAN LAPORAN PROGRES BERKALA, DOKUMENTASI DFM, SERTA RESPON TEKNIS CEPAT DARI TAHAP DESAIN HINGGA MOLD DIKIRIM KE PABRIK ANDA.",
    badges: [
      "LAPORAN PROGRES RUTIN",
      "REVIEW DOKUMEN DFM",
      "KONSULTASI TEKNIK LANGSUNG",
      "JADWAL DELIVERY JELAS",
      "RESPON CEPAT WORKSHOP",
      "PENDAMPINGAN TEKNIS",
    ],
  },
  {
    id: "[03]",
    title: "Siklus injeksi cepat & ketahanan jangka panjang",
    desc: "PERANCANGAN SALURAN PENDINGIN KONFORMAL DAN HEAT TREATMENT HRC 48-52 MEMASTIKAN CYCLE TIME LEBIH SINGKAT SERTA KETAHANAN MOLD HINGGA JUTAAN SHOT.",
    badges: [
      "OPTIMASI CYCLE TIME",
      "COOLING CIRCUIT MERATA",
      "HEAT TREATMENT HRC 48-52",
      "SISTEM RUNNER EFISIEN",
      "KETAHANAN JUTAAN SHOT",
      "MINIMALISASI SINK MARK",
    ],
  },
  {
    id: "[04]",
    title: "Uji coba cetak komprehensif & garansi mold",
    desc: "SETIAP MOLD DIUJI LANGSUNG PADA MESIN INJEKSI DENGAN INSPEKSI FAI DAN PENGUKURAN DIMENSI SEBELUM SERAH TERIMA, DIDUKUNG GARANSI SERVIS LENGKAP.",
    badges: [
      "UJI TRIAL T0 / T1",
      "FIRST ARTICLE INSPECTION",
      "GARANSI FUNGSIONAL MOLD",
      "SERVIS LASER WELDING",
      "REKONDISI PARTING LINE",
      "DUKUNGAN TEKNIS PABRIK",
    ],
  },
];

export const DEFAULT_COMPANY_INFO = {
  id: 1,
  companyName: "Baruna Jaya Plastik",
  tagline: "Produsen Mold & Cetakan Plastic Injection & Blowing Presisi",
  history: "Baruna Jaya Plastik berdiri sejak tahun 2001 di Kalideres, Jakarta Barat, berfokus pada pembuatan cetakan/mold presisi tinggi berbasis baja perkakas.",
  vision: "Menjadi mitra manufaktur cetakan plastik terpercaya di Indonesia dengan standar mutu presisi internasional.",
  mission: "Memberikan hasil mold presisi tinggi dengan daya tahan maksimal, pengiriman tepat waktu, dan layanan purna jual responsif.",
  address: "Jl. Kampung Belakang RT 001/05 No. 37, depan SD 04 Kamal, Kel. Kamal, Kec. Kalideres, Jakarta Barat",
  phone: "081283840614",
  email: "barunajayaplastik.bjp@gmail.com",
  operatingHours: "08.00 - 17.00 WIB (Senin - Sabtu)",
  googleMapsEmbed: "https://maps.google.com/?q=Kalideres+Jakarta+Barat",

  // Hero Section
  heroBgImage: "/mold-tool-close.jpg",
  heroHeadlineLine1: "Fabrikasi mold presisi",
  heroHeadlineLine2: "plastik injeksi & blowing.",
  heroStat1Value: "100",
  heroStat1Label: "Garansi Purna Jual",
  heroStat2Value: "24+",
  heroStat2Label: "Pengalaman Manufaktur",
  heroSpecDesc: "Spesialis mold injeksi & blowing presisi tinggi dengan baja impor Stavax & DIN 1.2316 bersertifikasi resmi.",

  // About / Story Section
  aboutEyebrow: "SEJAK 2001 DI KALIDERES, JAKARTA BARAT",
  aboutStatement: "Beroperasi sejak 2001, Baruna Jaya Plastik memproduksi cetakan injeksi dan blowing presisi berbasis baja perkakas untuk memastikan kestabilan dimensi part serta kelancaran lini perakitan Anda.",

  // Standards Section
  standardsEyebrow: "STANDAR MUTU PRESISI",
  standardsTitle: "Standar pengerjaan ketat untuk cetakan presisi tinggi.",
  standardsEditorial: "SETIAP MOLD DIKERJAKAN DENGAN SPESIFIKASI MATERIAL TERVERIFIKASI DAN KONTROL KUALITAS KETAT. DARI PEMESINAN HINGGA TRIAL AKHIR, STANDAR KAMI MEMASTIKAN CETAKAN LANGSUNG SIAP BEKERJA PADA LINI INJEKSI ANDA.",
  standardsCards: JSON.stringify(DEFAULT_STANDARDS_CARDS),
};

export type CompanyInfoData = typeof DEFAULT_COMPANY_INFO;

export async function getCompanyInfo(): Promise<CompanyInfoData> {
  const isOnline = await isDatabaseOnline();
  if (isOnline) {
    try {
      const companyInfo = await db.companyInfo.findUnique({ where: { id: 1 } });
      if (companyInfo) {
      return {
        id: 1,
        companyName: companyInfo.companyName || DEFAULT_COMPANY_INFO.companyName,
        tagline: companyInfo.tagline || DEFAULT_COMPANY_INFO.tagline,
        history: companyInfo.history || DEFAULT_COMPANY_INFO.history,
        vision: companyInfo.vision || DEFAULT_COMPANY_INFO.vision,
        mission: companyInfo.mission || DEFAULT_COMPANY_INFO.mission,
        address: companyInfo.address || DEFAULT_COMPANY_INFO.address,
        phone: companyInfo.phone || DEFAULT_COMPANY_INFO.phone,
        email: companyInfo.email || DEFAULT_COMPANY_INFO.email,
        operatingHours: companyInfo.operatingHours || DEFAULT_COMPANY_INFO.operatingHours,
        googleMapsEmbed: companyInfo.googleMapsEmbed || DEFAULT_COMPANY_INFO.googleMapsEmbed,

        // Hero Section
        heroBgImage: companyInfo.heroBgImage || DEFAULT_COMPANY_INFO.heroBgImage,
        heroHeadlineLine1: companyInfo.heroHeadlineLine1 || DEFAULT_COMPANY_INFO.heroHeadlineLine1,
        heroHeadlineLine2: companyInfo.heroHeadlineLine2 || DEFAULT_COMPANY_INFO.heroHeadlineLine2,
        heroStat1Value: companyInfo.heroStat1Value || DEFAULT_COMPANY_INFO.heroStat1Value,
        heroStat1Label: companyInfo.heroStat1Label || DEFAULT_COMPANY_INFO.heroStat1Label,
        heroStat2Value: companyInfo.heroStat2Value || DEFAULT_COMPANY_INFO.heroStat2Value,
        heroStat2Label: companyInfo.heroStat2Label || DEFAULT_COMPANY_INFO.heroStat2Label,
        heroSpecDesc: companyInfo.heroSpecDesc || DEFAULT_COMPANY_INFO.heroSpecDesc,

        // About Section
        aboutEyebrow: companyInfo.aboutEyebrow || DEFAULT_COMPANY_INFO.aboutEyebrow,
        aboutStatement: companyInfo.aboutStatement || DEFAULT_COMPANY_INFO.aboutStatement,

        // Standards Section
        standardsEyebrow: companyInfo.standardsEyebrow || DEFAULT_COMPANY_INFO.standardsEyebrow,
        standardsTitle: companyInfo.standardsTitle || DEFAULT_COMPANY_INFO.standardsTitle,
        standardsEditorial: companyInfo.standardsEditorial || DEFAULT_COMPANY_INFO.standardsEditorial,
        standardsCards: companyInfo.standardsCards || DEFAULT_COMPANY_INFO.standardsCards,
      };
    }
  } catch {
    // Database connection error / offline
  }
}

  // Fallback to local storage
  const local = await readLocalData<CompanyInfoData>("company-info.json", DEFAULT_COMPANY_INFO);
  return {
    ...DEFAULT_COMPANY_INFO,
    ...local,
  };
}

export async function saveCompanyInfoLocal(data: Partial<CompanyInfoData>): Promise<CompanyInfoData> {
  const current = await getCompanyInfo();
  const merged: CompanyInfoData = {
    ...current,
    ...data,
  };
  await writeLocalData("company-info.json", merged);
  return merged;
}
