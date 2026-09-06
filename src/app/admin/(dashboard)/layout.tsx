import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | Baruna Jaya Plastik",
  robots: "noindex, nofollow",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("bjp_admin_session");

  if (!sessionCookie?.value) {
    redirect("/admin/login");
  }

  let user = null;
  try {
    user = JSON.parse(sessionCookie.value);
  } catch {
    redirect("/admin/login");
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
