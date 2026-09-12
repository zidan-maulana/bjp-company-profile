"use server";

import { db, isDatabaseOnline } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  createInquirySchema,
  updateInquiryStatusSchema,
  updateInquirySchema,
  CreateInquiryInput,
  UpdateInquiryStatusInput,
  UpdateInquiryInput,
} from "@/lib/validations/inquiry";
import { sendInquiryNotificationEmail } from "@/lib/email";

export async function submitInquiryAction(input: CreateInquiryInput) {
  const validated = createInquirySchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Input formulir tidak valid.",
    };
  }

  try {
    const inquiry = await db.inquiry.create({
      data: {
        name: validated.data.name,
        companyName: validated.data.companyName || null,
        email: validated.data.email,
        phone: validated.data.phone,
        serviceType: validated.data.serviceType || null,
        message: validated.data.message,
        status: "NEW",
      },
    });

    // Send email notification asynchronously
    await sendInquiryNotificationEmail({
      name: inquiry.name,
      companyName: inquiry.companyName,
      email: inquiry.email,
      phone: inquiry.phone,
      serviceType: inquiry.serviceType,
      message: inquiry.message,
    });

    return {
      success: true,
      data: inquiry,
      message: "Terima kasih! Pesan dan permintaan penawaran Anda telah kami terima.",
    };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return {
      success: false,
      message: "Gagal mengirimkan pesan. Silakan coba lagi nanti.",
    };
  }
}

export async function getInquiriesAction(statusFilter?: "NEW" | "CONTACTED" | "CLOSED") {
  try {
    const inquiries = await db.inquiry.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: inquiries };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return { success: false, data: [] };
  }
}

export async function updateInquiryStatusAction(input: UpdateInquiryStatusInput) {
  const validated = updateInquiryStatusSchema.safeParse(input);

  if (!validated.success) {
    return { success: false, message: "Data update status tidak valid." };
  }

  try {
    const updated = await db.inquiry.update({
      where: { id: validated.data.id },
      data: {
        status: validated.data.status,
        internalNote: validated.data.internalNote,
      },
    });
    revalidatePath("/admin/inquiries");
    return { success: true, data: updated, message: "Status inquiry berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return { success: false, message: "Gagal memperbarui status inquiry." };
  }
}

export async function updateInquiryAction(input: UpdateInquiryInput) {
  const validated = updateInquirySchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Data edit permintaan tidak valid.",
    };
  }

  try {
    const updated = await db.inquiry.update({
      where: { id: validated.data.id },
      data: {
        name: validated.data.name,
        companyName: validated.data.companyName || null,
        email: validated.data.email,
        phone: validated.data.phone,
        serviceType: validated.data.serviceType || null,
        message: validated.data.message,
        status: validated.data.status,
        internalNote: validated.data.internalNote || null,
      },
    });
    revalidatePath("/admin/inquiries");
    return { success: true, data: updated, message: "Data permintaan berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return { success: false, message: "Gagal memperbarui data permintaan." };
  }
}

export async function deleteInquiryAction(id: string) {
  if (!id) {
    return { success: false, message: "ID permintaan tidak valid." };
  }

  try {
    await db.inquiry.delete({
      where: { id },
    });
    revalidatePath("/admin/inquiries");
    return { success: true, message: "Permintaan masuk berhasil dihapus." };
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return { success: false, message: "Gagal menghapus permintaan masuk." };
  }
}

