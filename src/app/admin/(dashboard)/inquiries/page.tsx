import { db, isDatabaseOnline } from "@/lib/db";
import InquiriesClient from "@/components/admin/InquiriesClient";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  let inquiries: any[] = [];

  if (await isDatabaseOnline()) {
    try {
      inquiries = await db.inquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.warn("Error fetching inquiries from DB, using fallback:", error);
      inquiries = [];
    }
  }

  return <InquiriesClient initialInquiries={inquiries} />;
}
