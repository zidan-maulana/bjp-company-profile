"use server";

import { db } from "@/lib/db";

export async function getCompanyInfoAction() {
  try {
    let companyInfo = await db.companyInfo.findUnique({ where: { id: 1 } });
    if (!companyInfo) {
      companyInfo = await db.companyInfo.create({
        data: {
          id: 1,
          companyName: "Baruna Jaya Plastik",
          tagline: "Produsen Mold & Cetakan Plastic Injection & Blowing Presisi",
          history: "Baruna Jaya Plastik berdiri sejak tahun 2001 di Kalideres, Jakarta Barat, berfokus pada pembuatan cetakan/mold presisi tinggi berbasis baja perkakas.",
          vision: "Menjadi mitra manufaktur cetakan plastik terpercaya di Indonesia.",
          mission: "Memberikan hasil mold presisi tinggi dengan daya tahan maksimal dan layanan service responsif.",
          address: "Jl. Kampung Belakang RT 001/05 No. 37, depan SD 04 Kamal, Kel. Kamal, Kec. Kalideres, Jakarta Barat",
          phone: "081283840614",
          email: "barunajayaplastik.bjp@gmail.com",
          operatingHours: "08.00 - 17.00 WIB",
        },
      });
    }
    return { success: true, data: companyInfo };
  } catch (error) {
    console.error("Error fetching company info:", error);
    return { success: false, data: null };
  }
}

export async function updateCompanyInfoAction(input: {
  companyName?: string;
  tagline?: string;
  history?: string;
  vision?: string;
  mission?: string;
  address?: string;
  phone?: string;
  email?: string;
  operatingHours?: string;
  googleMapsEmbed?: string;
}) {
  try {
    const updated = await db.companyInfo.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        companyName: input.companyName || "Baruna Jaya Plastik",
        tagline: input.tagline,
        history: input.history || "",
        vision: input.vision,
        mission: input.mission,
        address: input.address || "",
        phone: input.phone || "",
        email: input.email || "",
        operatingHours: input.operatingHours || "08.00 - 17.00 WIB",
        googleMapsEmbed: input.googleMapsEmbed,
      },
      update: {
        ...input,
      },
    });
    return { success: true, data: updated, message: "Info profil perusahaan berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating company info:", error);
    return { success: false, message: "Gagal memperbarui profil perusahaan." };
  }
}

export async function getActiveTestimonialsAction() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
    });
    return { success: true, data: testimonials };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, data: [] };
  }
}
