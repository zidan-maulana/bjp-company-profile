"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Layers,
  FolderKanban,
  Building2,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  KeyRound,
  Loader2,
} from "lucide-react";
import { logoutAdminAction } from "@/actions/auth";
import ChangePasswordModal from "@/components/admin/ChangePasswordModal";
import ToastNotification, { ToastItem } from "./ToastNotification";
import { AdminLayoutContext, AdminUser, ToastOptions } from "./AdminLayoutContext";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: AdminUser | null;
}

const NAV_ITEMS = [
  {
    name: "Ringkasan",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Permintaan Masuk",
    href: "/admin/inquiries",
    icon: Inbox,
    badge: "Leads",
  },
  {
    name: "Katalog Layanan",
    href: "/admin/services",
    icon: Layers,
    badge: null,
  },
  {
    name: "Portofolio Cetakan",
    href: "/admin/portfolio",
    icon: FolderKanban,
    badge: null,
  },
  {
    name: "Konten & Profil",
    href: "/admin/company",
    icon: Building2,
    badge: "CMS",
  },
];

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (text: string, options?: ToastOptions) => {
    const newToast: ToastItem = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text,
      title: options?.title,
      isError: options?.isError,
      type: options?.type || (options?.isError ? "error" : "success"),
      duration: options?.duration || 4500,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari Portal Admin?")) {
      setIsLoggingOut(true);
      try {
        await logoutAdminAction();
        router.push("/admin/login");
        router.refresh();
      } catch (err) {
        console.error("Logout error:", err);
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <AdminLayoutContext.Provider
      value={{
        user: user ?? null,
        openChangePassword: () => setChangePasswordOpen(true),
        handleLogout,
        isLoggingOut,
        showToast,
      }}
    >
      <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 flex flex-col selection:bg-orange-600 selection:text-white">
        {/* Mobile Header Bar (Only visible on screens < lg) */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#141414]/95 border-b border-[#262626] backdrop-blur-md h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 text-zinc-400 hover:text-white border border-[#2B2B2B] bg-[#1A1A1A]"
              aria-label="Toggle navigation menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/admin" className="flex items-center gap-2">
              <svg className="w-5 h-4" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="10,0 28,0 20,11 2,11" fill="#EA580C" />
                <polygon points="12,14 30,14 22,25 4,25" fill="#FFFFFF" />
              </svg>
              <span className="font-bold text-sm tracking-wider text-white font-sans">
                BARUNA JAYA
              </span>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex min-h-screen">
          {/* Desktop Left Sidebar - FIXED & UN-SCROLLABLE */}
          <aside className="hidden lg:flex w-64 flex-col bg-[#141414] border-r border-[#262626] shrink-0 select-none sticky top-0 h-screen overflow-hidden">
            {/* Sidebar Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-[#262626] shrink-0">
              <Link href="/admin" className="flex items-center gap-2.5 group">
                <svg className="w-6 h-5" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="10,0 28,0 20,11 2,11" fill="#EA580C" />
                  <polygon points="12,14 30,14 22,25 4,25" fill="#FFFFFF" />
                </svg>
                <span className="font-bold text-sm tracking-wider text-white font-sans group-hover:text-orange-400 transition-colors">
                  BARUNA JAYA
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-3 space-y-1 overflow-hidden">
              <div className="px-3 py-2 text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                MODUL MANAJEMEN
              </div>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 font-mono text-xs tracking-wider transition-all ${
                      isActive
                        ? "bg-orange-600 text-white font-semibold shadow-md shadow-orange-950/40"
                        : "text-zinc-300 hover:text-white hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-zinc-400"}`} />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#1A1A1A] text-orange-400 border border-[#2B2B2B] uppercase">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer: User Profile & Logout Box (Pinned at Bottom) */}
            <div className="p-3 border-t border-[#262626] bg-[#141414] mt-auto shrink-0">
              <div className="p-2.5 bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {user?.email ? user.email.slice(0, 2).toUpperCase() : "AD"}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium text-white truncate leading-tight font-mono"
                      title={user?.email || "admin@barunajayaplastik.com"}
                    >
                      {user?.email || "admin@barunajayaplastik.com"}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase leading-tight mt-0.5">
                      {user?.role || "MASTER ADMIN"}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Keluar dari Portal"
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-colors cursor-pointer shrink-0"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Slide-over Drawer */}
          {mobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />

              <div className="relative w-72 bg-[#141414] border-r border-[#262626] p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-5" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="10,0 28,0 20,11 2,11" fill="#EA580C" />
                        <polygon points="12,14 30,14 22,25 4,25" fill="#FFFFFF" />
                      </svg>
                      <span className="font-bold text-sm tracking-wider text-white font-sans">
                        BARUNA JAYA
                      </span>
                    </div>
                    <button
                      onClick={() => setMobileSidebarOpen(false)}
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-3 font-mono text-xs tracking-wider transition-all ${
                            isActive
                              ? "bg-orange-600 text-white font-semibold"
                              : "text-zinc-300 hover:text-white hover:bg-[#1A1A1A]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="whitespace-nowrap">{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#1A1A1A] text-orange-400 border border-[#2B2B2B] uppercase">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-[#262626] space-y-3">
                  {/* User Profile Card */}
                  <div className="p-2.5 bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        {user?.email ? user.email.slice(0, 2).toUpperCase() : "AD"}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-medium text-white truncate leading-tight font-mono"
                          title={user?.email || "admin@barunajayaplastik.com"}
                        >
                          {user?.email || "admin@barunajayaplastik.com"}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase leading-tight mt-0.5">
                          {user?.role || "MASTER ADMIN"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      setChangePasswordOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1A1A1A] border border-[#2B2B2B] text-zinc-300 font-mono text-xs tracking-wider hover:bg-[#222222] transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-orange-500" />
                    <span>GANTI KATA SANDI</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-xs tracking-wider hover:bg-red-900/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>KELUAR PORTAL</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden p-4 sm:p-8 lg:p-10 max-w-[1600px]">
            {children}
          </main>
        </div>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          defaultEmail={user?.email || "admin@barunajayaplastik.com"}
        />

        {/* Global Toast / Pop-up Notification Container */}
        <ToastNotification toasts={toasts} onDismiss={dismissToast} />
      </div>
    </AdminLayoutContext.Provider>
  );
}
