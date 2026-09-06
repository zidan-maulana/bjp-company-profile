import { getCompanyInfo } from "@/lib/data/company";
import CompanyClient from "@/components/admin/CompanyClient";

export const dynamic = "force-dynamic";

export default async function AdminCompanyPage() {
  const companyInfo = await getCompanyInfo();
  return <CompanyClient initialInfo={companyInfo} />;
}
