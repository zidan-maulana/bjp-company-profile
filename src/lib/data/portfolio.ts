import { db, isDatabaseOnline } from "@/lib/db";
import { readLocalData, writeLocalData } from "./storage";

export interface PortfolioItemImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  orderIndex: number;
}

export interface PortfolioItemRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  material: string;
  category: string;
  clientName: string | null;
  images: PortfolioItemImage[];
}

export const DEFAULT_PORTFOLIO_ITEMS: PortfolioItemRecord[] = [
  {
    id: "seed-01",
    slug: "mold-komponen-otomotif",
    title: "Mold Komponen Otomotif",
    description: "Cetakan injeksi presisi 8-cavity untuk komponen part otomotif interior & engine compartment dengan toleransi ketat.",
    material: "Stavax 2316",
    category: "Automotive",
    clientName: "Manufaktur Otomotif Cikarang",
    images: [
      {
        id: "img-01",
        imageUrl: "/portfolio/original-automotive-mold.jpg",
        caption: "Mold Komponen Otomotif",
        orderIndex: 0,
      },
    ],
  },
  {
    id: "seed-02",
    slug: "cetakan-botol-kosmetik",
    title: "Cetakan Botol Kosmetik",
    description: "Mold blowing botol kosmetik dan perawatan dengan finishing mirror polish untuk permukaan bening sempurna.",
    material: "Baja 2311 (Mirror Polish)",
    category: "Consumer Goods",
    clientName: "Industri Kosmetik Tangerang",
    images: [
      {
        id: "img-02",
        imageUrl: "/portfolio/original-cosmetic-bottle-mold.jpg",
        caption: "Cetakan Botol Kosmetik",
        orderIndex: 0,
      },
    ],
  },
  {
    id: "seed-03",
    slug: "housing-konektor-presisi",
    title: "Housing Konektor Presisi",
    description: "Mold injeksi micro-tolerance untuk electrical housing dan socket konektor dengan ketelitian dimensi ekstrem.",
    material: "Baja Perkakas Presisi (±0.01mm)",
    category: "Electronic & Appliances",
    clientName: "Elektronik Manufaktur Bekasi",
    images: [
      {
        id: "img-03",
        imageUrl: "/portfolio/original-precision-connector-mold.jpg",
        caption: "Housing Konektor Presisi",
        orderIndex: 0,
      },
    ],
  },
  {
    id: "seed-04",
    slug: "cetakan-alat-kesehatan",
    title: "Cetakan Alat Kesehatan",
    description: "Cetakan injeksi standar cleanroom medis untuk komponen syringe, tabung laboratorium, dan wadah steril.",
    material: "Baja Stavax Tahan Korosi",
    category: "Medical & Sanitary",
    clientName: "Produsen Alat Medis Karawang",
    images: [
      {
        id: "img-04",
        imageUrl: "/portfolio/original-medical-cleanroom-mold.jpg",
        caption: "Cetakan Alat Kesehatan",
        orderIndex: 0,
      },
    ],
  },
  {
    id: "seed-05",
    slug: "wadah-makanan-thin-wall",
    title: "Wadah Makanan Thin-Wall",
    description: "Cetakan thin-wall container berkecepatan tinggi dengan hot-runner multi-drop untuk efisiensi siklus produksi massal.",
    material: "Baja Fast Cycle (Hot Runner)",
    category: "Food & Beverage",
    clientName: "Food Packaging Industry",
    images: [
      {
        id: "img-05",
        imageUrl: "/portfolio/original-thinwall-food-mold.jpg",
        caption: "Wadah Makanan Thin-Wall",
        orderIndex: 0,
      },
    ],
  },
  {
    id: "seed-06",
    slug: "insert-core-cavity-presisi",
    title: "Insert Core & Cavity Presisi",
    description: "Pembuatan core dan cavity insert khusus dengan permesinan CNC Wire EDM untuk part mekanikal industri rumit.",
    material: "Baja Hardened HRC 52",
    category: "Industrial",
    clientName: "Tooling & Machine Partner",
    images: [
      {
        id: "img-06",
        imageUrl: "/portfolio/original-cnc-wire-edm-mold.jpg",
        caption: "Insert Core & Cavity Presisi",
        orderIndex: 0,
      },
    ],
  },
  {
    id: "seed-07",
    slug: "tutup-botol-flip-top-cap",
    title: "Tutup Botol & Flip-Top Cap",
    description: "Cetakan tutup galon & botol multi-cavity dengan mekanisme unscrewing otomatis untuk drat presisi bebas bocor.",
    material: "Baja Stavax 16-Cavity",
    category: "Food & Beverage",
    clientName: "Beverage Cap Manufacturer",
    images: [
      {
        id: "img-07",
        imageUrl: "/portfolio/original-bottle-cap-closure-mold.jpg",
        caption: "Tutup Botol & Flip-Top Cap",
        orderIndex: 0,
      },
    ],
  },
  {
    id: "seed-08",
    slug: "kemasan-jeriken-industri-5l",
    title: "Kemasan Jeriken Industri 5L",
    description: "Cetakan extrusion blow mold tangguh untuk jerigen kimia dan industri 5 Liter dengan ketebalan dinding merata.",
    material: "Baja Air 1730 Heavy Duty",
    category: "Industrial",
    clientName: "Chemical Packaging Factory",
    images: [
      {
        id: "img-08",
        imageUrl: "/portfolio/original-industrial-jerrycan-mold-v2.jpg",
        caption: "Kemasan Jeriken Industri 5L",
        orderIndex: 0,
      },
    ],
  },
];

export async function getActivePortfolio(categoryFilter?: string): Promise<PortfolioItemRecord[]> {
  if (await isDatabaseOnline()) {
    try {
      const portfolio = await db.portfolioItem.findMany({
        where: {
          deletedAt: null,
          category: categoryFilter && categoryFilter !== "ALL" ? categoryFilter : undefined,
        },
        include: {
          images: {
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (portfolio) {
        if (portfolio.length === 0 && (!categoryFilter || categoryFilter === "ALL")) {
          const totalCount = await db.portfolioItem.count();
          if (totalCount === 0) {
            return DEFAULT_PORTFOLIO_ITEMS;
          }
        }
        return portfolio.map((item: any) => ({
          id: String(item.id),
          slug: item.slug || "",
          title: item.title,
          description: item.description,
          material: item.material,
          category: item.category,
          clientName: item.clientName || null,
          images: (item.images || []).map((img: any) => ({
            id: String(img.id),
            imageUrl: img.imageUrl,
            caption: img.caption || null,
            orderIndex: img.orderIndex ?? 0,
          })),
        }));
      }
    } catch {
      // DB connection error / offline
    }
  }

  // Fallback to local storage
  const local = await readLocalData<PortfolioItemRecord[]>("portfolio.json", DEFAULT_PORTFOLIO_ITEMS);
  const items = local && local.length > 0 ? local : DEFAULT_PORTFOLIO_ITEMS;

  return categoryFilter && categoryFilter !== "ALL"
    ? items.filter((item) => item.category === categoryFilter)
    : items;
}

export async function savePortfolioLocal(items: PortfolioItemRecord[]): Promise<void> {
  await writeLocalData("portfolio.json", items);
}
