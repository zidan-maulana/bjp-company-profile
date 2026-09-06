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
    // 1. Always persist to local storage first (fail-safe for local offline environments)
    const savedLocal = await saveCompanyInfoLocal(input);

    // 2. Also persist to Database if DB is reachable
    try {
      await db.companyInfo.upsert({
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

          heroBgImage: input.heroBgImage,
          heroHeadlineLine1: input.heroHeadlineLine1,
          heroHeadlineLine2: input.heroHeadlineLine2,
          heroStat1Value: input.heroStat1Value,
          heroStat1Label: input.heroStat1Label,
          heroStat2Value: input.heroStat2Value,
          heroStat2Label: input.heroStat2Label,
          heroSpecDesc: input.heroSpecDesc,

          aboutEyebrow: input.aboutEyebrow,
          aboutStatement: input.aboutStatement,

          standardsEyebrow: input.standardsEyebrow,
          standardsTitle: input.standardsTitle,
          standardsEditorial: input.standardsEditorial,
          standardsCards: input.standardsCards,
        },
        update: {
          ...input,
        },
      });
    } catch (dbErr) {
      console.warn("DB update failed (using local JSON persistence):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/company");
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
