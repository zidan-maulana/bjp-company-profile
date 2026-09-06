import { db, isDatabaseOnline } from "@/lib/db";
import { readLocalData, writeLocalData } from "./storage";

export interface ServiceItemData {
  id: string;
  slug: string;
  number?: string;
  title: string;
  subtitle?: string;
  shortDesc: string;
  desc?: string;
  fullDesc: string;
  materials: string[];
  capabilities?: string[];
  maxCapacity: string | null;
  imageUrl: string | null;
  orderIndex: number;
}

export const DEFAULT_SERVICES: ServiceItemData[] = [
  {
    id: "01",
    slug: "cetakan-injeksi-plastik",
    number: "01",
    title: "Cetakan Injeksi Plastik",
    subtitle: "PLASTIC INJECTION MOLD",
    shortDesc: "PLASTIC INJECTION MOLD",
    desc: "Fabrikasi mold injeksi presisi single maupun multi-cavity untuk komponen otomotif, bodi elektronik, kemasan medis, dan perlengkapan industri.",
    fullDesc: "Fabrikasi mold injeksi presisi single maupun multi-cavity untuk komponen otomotif, bodi elektronik, kemasan medis, dan perlengkapan industri.",
    materials: [
      "Baja Stavax & DIN 1.2316",
      "Hot & Cold Runner System",
      "Multi-Cavity Presisi Tinggi",
    ],
    capabilities: [
      "Baja Stavax & DIN 1.2316",
      "Hot & Cold Runner System",
      "Multi-Cavity Presisi Tinggi",
    ],
    maxCapacity: null,
    imageUrl: null,
    orderIndex: 1,
  },
  {
    id: "02",
    slug: "cetakan-blowing-botol",
    number: "02",
    title: "Cetakan Blowing & Botol",
    subtitle: "PLASTIC BLOW MOLD",
    shortDesc: "PLASTIC BLOW MOLD",
    desc: "Pembuatan cetakan extrusion blow dan stretch blow untuk botol kosmetik, jeriken industri, wadah agrokimia, dan botol farmasi.",
    fullDesc: "Pembuatan cetakan extrusion blow dan stretch blow untuk botol kosmetik, jeriken industri, wadah agrokimia, dan botol farmasi.",
    materials: [
      "Insert Pinch-Off Baja BeCu",
      "Saluran Pendingin Baffle Cepat",
      "Finishing Cavity Mirror Polish",
    ],
    capabilities: [
      "Insert Pinch-Off Baja BeCu",
      "Saluran Pendingin Baffle Cepat",
      "Finishing Cavity Mirror Polish",
    ],
    maxCapacity: null,
    imageUrl: null,
    orderIndex: 2,
  },
  {
    id: "03",
    slug: "pemesinan-presisi-cnc-tooling",
    number: "03",
    title: "Pemesinan Presisi CNC & Tooling",
    subtitle: "PRECISION CNC MACHINING",
    shortDesc: "PRECISION CNC MACHINING",
    desc: "Pemesinan komponen mold menggunakan CNC Milling, CNC Lathe, Wire Cut, dan Sinker EDM dengan toleransi hingga skala mikron.",
    fullDesc: "Pemesinan komponen mold menggunakan CNC Milling, CNC Lathe, Wire Cut, dan Sinker EDM dengan toleransi hingga skala mikron.",
    materials: [
      "CNC Milling 3-Axis & 4-Axis",
      "Wire Cut & Sinker EDM Presisi",
      "Inspeksi Kekerasan HRC 48-52",
    ],
    capabilities: [
      "CNC Milling 3-Axis & 4-Axis",
      "Wire Cut & Sinker EDM Presisi",
      "Inspeksi Kekerasan HRC 48-52",
    ],
    maxCapacity: null,
    imageUrl: null,
    orderIndex: 3,
  },
  {
    id: "04",
    slug: "servis-modifikasi-mold",
    number: "04",
    title: "Servis & Modifikasi Mold",
    subtitle: "MOLD REPAIR & MODIFICATION",
    shortDesc: "MOLD REPAIR & MODIFICATION",
    desc: "Perbaikan cepat untuk rekondisi parting line aus, penambalan cavity/core dengan las laser presisi, serta penggantian insert aus.",
    fullDesc: "Perbaikan cepat untuk rekondisi parting line aus, penambalan cavity/core dengan las laser presisi, serta penggantian insert aus.",
    materials: [
      "Laser Welding & Micro TIG",
      "Rekondisi Parting Line Aus",
      "Modifikasi Core & Cavity",
    ],
    capabilities: [
      "Laser Welding & Micro TIG",
      "Rekondisi Parting Line Aus",
      "Modifikasi Core & Cavity",
    ],
    maxCapacity: null,
    imageUrl: null,
    orderIndex: 4,
  },
  {
    id: "05",
    slug: "desain-3d-cad-cam-rekayasa",
    number: "05",
    title: "Desain 3D CAD/CAM & Rekayasa",
    subtitle: "3D CAD/CAM & REVERSE DESIGN",
    shortDesc: "3D CAD/CAM & REVERSE DESIGN",
    desc: "Pemodelan 3D CAD/CAM dari sampel fisik atau gambar teknik 2D, analisis DFM aliran plastik, dan perancangan konstruksi mold.",
    fullDesc: "Pemodelan 3D CAD/CAM dari sampel fisik atau gambar teknik 2D, analisis DFM aliran plastik, dan perancangan konstruksi mold.",
    materials: [
      "Reverse Engineering Sampel",
      "Analisis DFM & Mold Flow",
      "CAD 3D SolidWorks & NX",
    ],
    capabilities: [
      "Reverse Engineering Sampel",
      "Analisis DFM & Mold Flow",
      "CAD 3D SolidWorks & NX",
    ],
    maxCapacity: null,
    imageUrl: null,
    orderIndex: 5,
  },
  {
    id: "06",
    slug: "uji-coba-garansi-sampel",
    number: "06",
    title: "Uji Coba & Garansi Sampel",
    subtitle: "MOLD TRIAL & QC SAMPLING",
    shortDesc: "MOLD TRIAL & QC SAMPLING",
    desc: "Uji coba cetak T0/T1 pada mesin injeksi untuk validasi parameter proses, verifikasi dimensi produk (FAI), dan penyerahan mold siap jalan.",
    fullDesc: "Uji coba cetak T0/T1 pada mesin injeksi untuk validasi parameter proses, verifikasi dimensi produk (FAI), dan penyerahan mold siap jalan.",
    materials: [
      "Uji Coba Cetak (Trial T0/T1)",
      "First Article Inspection (FAI)",
      "Garansi Siap Produksi Penuh",
    ],
    capabilities: [
      "Uji Coba Cetak (Trial T0/T1)",
      "First Article Inspection (FAI)",
      "Garansi Siap Produksi Penuh",
    ],
    maxCapacity: null,
    imageUrl: null,
    orderIndex: 6,
  },
];

export async function getActiveServices(): Promise<ServiceItemData[]> {
  if (await isDatabaseOnline()) {
    try {
      const services = await db.service.findMany({
        where: { deletedAt: null },
        orderBy: { orderIndex: "asc" },
      });

      if (services && services.length > 0) {
        return services.map((s, idx) => ({
          id: s.id,
          slug: s.slug,
          number: String(idx + 1).padStart(2, "0"),
          title: s.title,
          subtitle: s.shortDesc || "PRECISION MOLD SERVICE",
          shortDesc: s.shortDesc,
          desc: s.fullDesc || s.shortDesc,
          fullDesc: s.fullDesc,
          materials: s.materials,
          capabilities: s.materials,
          maxCapacity: s.maxCapacity,
          imageUrl: s.imageUrl,
          orderIndex: s.orderIndex,
        }));
      }
    } catch {
      // Database connection error / offline
    }
  }

  // Read from local JSON storage
  const local = await readLocalData<ServiceItemData[]>("services.json", DEFAULT_SERVICES);
  return local && local.length > 0 ? local : DEFAULT_SERVICES;
}

export async function saveServicesLocal(services: ServiceItemData[]): Promise<void> {
  await writeLocalData("services.json", services);
}
