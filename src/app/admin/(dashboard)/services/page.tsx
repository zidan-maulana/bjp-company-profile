import { getActiveServices } from "@/lib/data/services";
import ServicesClient from "@/components/admin/ServicesClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getActiveServices();
  return <ServicesClient initialServices={services} />;
}
