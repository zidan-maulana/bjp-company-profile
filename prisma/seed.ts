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

  // 4. Seed Portfolio Items & Multi-Photos
  const portfolioItem1 = await prisma.portfolioItem.upsert({
    where: { slug: "mold-injeksi-tutup-galon-4-cavity" },
    update: {},
    create: {
      slug: "mold-injeksi-tutup-galon-4-cavity",
      title: "Mold Injeksi Tutup Galon 4-Cavity",
      description:
        "Cetakan injeksi plastik 4-cavity menggunakan material baja Stavax 2316 (hardened 48 HRC) tahan korosi. Didesain presisi untuk hasil drat rapat dan bebas kebocoran.",
      material: "Baja Stavax 2316 (48 HRC)",
      category: "Injection",
      clientName: "Manufaktur Kemasan Plastik Jakarta",
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
            caption: "Tampilan permukaan core dan cavity mold tutup galon",
            orderIndex: 1,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
            caption: "Hasil sampel uji cetik produk plastik tutup galon",
            orderIndex: 2,
          },
        ],
      },
    },
  });

  const portfolioItem2 = await prisma.portfolioItem.upsert({
    where: { slug: "mold-blowing-botol-kemasan-500ml" },
    update: {},
    create: {
      slug: "mold-blowing-botol-kemasan-500ml",
      title: "Mold Blowing Botol Kemasan 500ml",
      description:
        "Cetakan blow molding untuk botol minuman 500ml menggunakan baja minyak 2311. Dilengkapi cooling jalur air terintegrasi untuk efisiensi pendinginan masal.",
      material: "Baja Minyak 2311 (30 HRC)",
      category: "Blowing",
      clientName: "Pabrik Botol Plastik Tangerang",
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
            caption: "Blok mold blowing bagian kiri dan kanan",
            orderIndex: 1,
          },
        ],
      },
    },
  });

  console.log("Portfolio items seeded:", portfolioItem1.title, ",", portfolioItem2.title);

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
