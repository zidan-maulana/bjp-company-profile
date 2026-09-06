import { getActivePortfolioAction } from "@/actions/portfolio";
import PortfolioClient from "@/components/admin/PortfolioClient";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const res = await getActivePortfolioAction();
  const items = res.success ? res.data : [];

  return <PortfolioClient initialItems={items as any} />;
}
