import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Prisma seed for Baruna Jaya Plastik...");

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@barunajayaplastik.com" },
    update: {},
    create: {
      email: "admin@barunajayaplastik.com",
      name: "Admin BJP",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin user seeded:", admin.email);

  // 2. Seed Company Profile Info
  const companyInfo = await prisma.companyInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "Baruna Jaya Plastik",
      tagline: "Spesialis Mold & Cetakan Plastic Injection & Blowing Presisi Tinggi",
      history:
        "Berdiri sejak tahun 2001 di Kalideres, Jakarta Barat, Baruna Jaya Plastik berpengalaman lebih dari dua dekade dalam pembuatan cetakan (mold) berbahan dasar baja perkakas berkualisi tinggi (Baja Minyak 2311, Baja Stavax 2316, dan Baja Air 1730) untuk berbagai kebutuhan manufaktur industri plastik.",
      vision:
        "Menjadi produsen cetakan plastik presisi terdepan yang terpercaya di Indonesia dengan mengutamakan akurasi, kualitas material, dan ketepatan waktu pengerjaan.",
      mission:
        "Memberikan solusi rancang bangun cetakan plastik yang tahan lama, meminimalkan reject pada proses produksi klien, serta menyediakan layanan purna jual & service perbaikan cetakan yang responsif.",
      address:
        "Jl. Kampung Belakang RT 001/05 No. 37, depan SD 04 Kamal, Kel. Kamal, Kec. Kalideres, Jakarta Barat",
      phone: "081283840614",
      email: "barunajayaplastik.bjp@gmail.com",
      operatingHours: "Senin - Sabtu: 08.00 - 17.00 WIB",
      googleMapsEmbed: "https://maps.google.com/?q=Kalideres+Jakarta+Barat",
    },
  });
  console.log("Company Info seeded:", companyInfo.companyName);

  // 3. Seed Services
  const servicesData = [
    {
      slug: "pembuatan-mold-plastic-injection",
      title: "Pembuatan Mold Plastic Injection",
      shortDesc: "Rancang bangun cetakan injeksi plastik presisi tinggi untuk komponen otomotif, kemasan, dan kebutuhan industri.",
      fullDesc:
        "Layanan pembuatan cetakan plastic injection custom berbasis material baja perkakas berkualitas. Kami memproduksi mold 1-cavity hingga multi-cavity dengan tingkat kepresisian tinggi dan toleransi ketat, dirancang untuk siklus produksi masal jangka panjang.",
      materials: ["Baja Minyak 2311 (30 HRC, Free Hardened)", "Baja Stavax 2316 (48 HRC, Hardened)"],
      maxCapacity: "Lebar 50cm x Panjang 80cm",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
      orderIndex: 1,
    },
    {
      slug: "pembuatan-mold-plastic-blowing",
      title: "Pembuatan Mold Plastic Blowing",
      shortDesc: "Pembuatan cetakan botol, jerigen, dan wadah plastik berongga dengan sistem pendinginan optimal.",
      fullDesc:
        "Spesialis pembuatan cetakan blow molding untuk botol kemasan, jerigen, dan wadah plastik. Didesain dengan saluran pendingin (cooling channel) optimal untuk mempercepat cycle time dan memastikan ketebalan dinding produk seragam.",
      materials: ["Baja Minyak 2311 (30 HRC)", "Baja Air 1730 (20 HRC)"],
      maxCapacity: "Lebar 50cm x Panjang 80cm",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
      orderIndex: 2,
    },
    {
      slug: "service-dan-perbaikan-cetakan",
      title: "Service & Modifikasi Cetakan Mold",
      shortDesc: "Perbaikan cetakan aus, modifikasi cavity, polishing presisi, dan penggantian sparepart cetakan.",
      fullDesc:
        "Layanan pemeliharaan dan perbaikan mold plastik yang mengalami keausan, pecah, atau butuh modifikasi desain. Meliputi re-polishing permukaan cavity/core, penambahan ventilasi udara (air vent), perbaikan runner system, dan penyetelan ulang parting line.",
      materials: ["Baja Minyak 2311", "Baja Stavax 2316", "Baja Air 1730"],
      maxCapacity: "Lebar 50cm x Panjang 80cm",
      imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
      orderIndex: 3,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log("Services seeded successfully.");

  // 4. Seed Portfolio Items & Multi-Photos (8 Actual Landing Page Items)
  const portfolioSeedData = [
    {
      slug: "mold-komponen-otomotif",
      title: "Mold Komponen Otomotif",
      description: "Cetakan injeksi presisi 8-cavity untuk komponen part otomotif interior & engine compartment dengan toleransi ketat.",
      material: "Stavax 2316",
      category: "Automotive",
      clientName: "Manufaktur Otomotif Cikarang",
      imageUrl: "/portfolio/original-automotive-mold.jpg",
    },
    {
      slug: "cetakan-botol-kosmetik",
      title: "Cetakan Botol Kosmetik",
      description: "Mold blowing botol kosmetik dan perawatan dengan finishing mirror polish untuk permukaan bening sempurna.",
      material: "Baja 2311 (Mirror Polish)",
      category: "Consumer Goods",
      clientName: "Industri Kosmetik Tangerang",
      imageUrl: "/portfolio/original-cosmetic-bottle-mold.jpg",
    },
    {
      slug: "housing-konektor-presisi",
      title: "Housing Konektor Presisi",
      description: "Mold injeksi micro-tolerance untuk electrical housing dan socket konektor dengan ketelitian dimensi ekstrem.",
      material: "Baja Perkakas Presisi (±0.01mm)",
      category: "Electronic & Appliances",
      clientName: "Elektronik Manufaktur Bekasi",
      imageUrl: "/portfolio/original-precision-connector-mold.jpg",
    },
    {
      slug: "cetakan-alat-kesehatan",
      title: "Cetakan Alat Kesehatan",
      description: "Cetakan injeksi standar cleanroom medis untuk komponen syringe, tabung laboratorium, dan wadah steril.",
      material: "Baja Stavax Tahan Korosi",
      category: "Medical & Sanitary",
      clientName: "Produsen Alat Medis Karawang",
      imageUrl: "/portfolio/original-medical-cleanroom-mold.jpg",
    },
    {
      slug: "wadah-makanan-thin-wall",
      title: "Wadah Makanan Thin-Wall",
      description: "Cetakan thin-wall container berkecepatan tinggi dengan hot-runner multi-drop untuk efisiensi siklus produksi massal.",
      material: "Baja Fast Cycle (Hot Runner)",
      category: "Food & Beverage",
      clientName: "Food Packaging Industry",
      imageUrl: "/portfolio/original-thinwall-food-mold.jpg",
    },
    {
      slug: "insert-core-cavity-presisi",
      title: "Insert Core & Cavity Presisi",
      description: "Pembuatan core dan cavity insert khusus dengan permesinan CNC Wire EDM untuk part mekanikal industri rumit.",
      material: "Baja Hardened HRC 52",
      category: "Industrial",
      clientName: "Tooling & Machine Partner",
      imageUrl: "/portfolio/original-cnc-wire-edm-mold.jpg",
    },
    {
      slug: "tutup-botol-flip-top-cap",
      title: "Tutup Botol & Flip-Top Cap",
      description: "Cetakan tutup galon & botol multi-cavity dengan mekanisme unscrewing otomatis untuk drat presisi bebas bocor.",
      material: "Baja Stavax 16-Cavity",
      category: "Food & Beverage",
      clientName: "Beverage Cap Manufacturer",
      imageUrl: "/portfolio/original-bottle-cap-closure-mold.jpg",
    },
    {
      slug: "kemasan-jeriken-industri-5l",
      title: "Kemasan Jeriken Industri 5L",
      description: "Cetakan extrusion blow mold tangguh untuk jerigen kimia dan industri 5 Liter dengan ketebalan dinding merata.",
      material: "Baja Air 1730 Heavy Duty",
      category: "Industrial",
      clientName: "Chemical Packaging Factory",
      imageUrl: "/portfolio/original-industrial-jerrycan-mold-v2.jpg",
    },
  ];

  for (const item of portfolioSeedData) {
    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        material: item.material,
        category: item.category,
        clientName: item.clientName,
      },
      create: {
        slug: item.slug,
        title: item.title,
        description: item.description,
        material: item.material,
        category: item.category,
        clientName: item.clientName,
        images: {
          create: [
            {
              imageUrl: item.imageUrl,
              caption: item.title,
              orderIndex: 0,
            },
          ],
        },
      },
    });
  }

  console.log("8 Portfolio items seeded successfully.");

  // 5. Seed Testimonials
  const testimonials = [
    {
      clientName: "Bpk. Hendra S.",
      companyName: "PT Polymer Industri Utama",
      content:
        "Pengerjaan mold cetakan injection di Baruna Jaya Plastik sangat presisi. Material baja Stavax asli dan bergaransi, hasil cetakan tutup botol kami jadi minim burry.",
      rating: 5,
      isActive: true,
      orderIndex: 1,
    },
    {
      clientName: "Ibu Ratna K.",
      companyName: "CV Surya Plastik Mandiri",
      content:
        "Sudah langganan service & modifikasi mold blowing di BJP sejak 2018. Respon cepat, harga bersahabat, dan pengerjaan tepat waktu.",
      rating: 5,
      isActive: true,
      orderIndex: 2,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("Testimonials seeded successfully.");

  console.log("All seed data successfully injected!");
}

main()
  .catch((e) => {
    console.error("Error running seed script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
