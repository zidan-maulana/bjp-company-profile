"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCompanyInfo, saveCompanyInfoLocal, CompanyInfoData } from "@/lib/data/company";

export async function getCompanyInfoAction() {
  const data = await getCompanyInfo();
  return { success: true, data };
}

export async function updateCompanyInfoAction(input: Partial<CompanyInfoData>) {
  try {
    // Pastikan primary key 'id' tidak ikut dimasukkan ke objek update Prisma
    const { id: _id, ...cleanData } = input as any;

    // 1. Persist ke Database jika online
    try {
      await db.companyInfo.upsert({
        where: { id: 1 },
        create: {
          id: 1,
          companyName: cleanData.companyName || "Baruna Jaya Plastik",
          tagline: cleanData.tagline,
          history: cleanData.history || "",
          vision: cleanData.vision,
          mission: cleanData.mission,
          address: cleanData.address || "",
          phone: cleanData.phone || "",
          email: cleanData.email || "",
          operatingHours: cleanData.operatingHours || "08.00 - 17.00 WIB",
          googleMapsEmbed: cleanData.googleMapsEmbed,

          heroBgImage: cleanData.heroBgImage,
          heroHeadlineLine1: cleanData.heroHeadlineLine1,
          heroHeadlineLine2: cleanData.heroHeadlineLine2,
          heroStat1Value: cleanData.heroStat1Value,
          heroStat1Label: cleanData.heroStat1Label,
          heroStat2Value: cleanData.heroStat2Value,
          heroStat2Label: cleanData.heroStat2Label,
          heroSpecDesc: cleanData.heroSpecDesc,

          aboutEyebrow: cleanData.aboutEyebrow,
          aboutStatement: cleanData.aboutStatement,

          standardsEyebrow: cleanData.standardsEyebrow,
          standardsTitle: cleanData.standardsTitle,
          standardsEditorial: cleanData.standardsEditorial,
          standardsCards: cleanData.standardsCards,
        },
        update: cleanData,
      });
    } catch (dbErr) {
      console.warn("DB update failed (falling back to local JSON persistence):", dbErr);
    }

    // 2. Persist ke local storage sebagai backup fail-safe
    const savedLocal = await saveCompanyInfoLocal(cleanData);

    revalidatePath("/", "page");
    revalidatePath("/admin/company", "page");
    revalidatePath("/admin", "layout");

    return { success: true, data: savedLocal, message: "Konten website & profil perusahaan berhasil diperbarui." };
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
