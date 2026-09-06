import Link from "next/link";
import {
  Inbox,
  Layers,
  FolderKanban,
  Building2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { db, isDatabaseOnline } from "@/lib/db";
import AdminHeaderActions from "@/components/admin/AdminHeaderActions";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  let inquiriesCount = 0;
  let newInquiriesCount = 0;
  let servicesCount = 0;
  let portfolioCount = 0;
  let recentInquiries: any[] = [];
  let isDbConnected = false;

  if (await isDatabaseOnline()) {
    try {
      const [inquiries, services, portfolio] = await Promise.all([
        db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
        db.service.count({ where: { deletedAt: null } }),
        db.portfolioItem.count({ where: { deletedAt: null } }),
      ]);

      inquiriesCount = await db.inquiry.count();
      newInquiriesCount = await db.inquiry.count({ where: { status: "NEW" } });
      servicesCount = services;
      portfolioCount = portfolio;
      recentInquiries = inquiries;
      isDbConnected = true;
    } catch (err) {
      console.warn("Database overview fetch fallback:", err);
      // Graceful fallback for preview / offline demo
      isDbConnected = false;
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono bg-orange-950/60 border border-orange-500/40 text-orange-400 font-semibold tracking-wider uppercase">
            BARU
          </span>
        );
      case "CONTACTED":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950/60 border border-blue-500/40 text-blue-400 font-semibold tracking-wider uppercase">
            DIHUBUNGI
          </span>
        );
      case "CLOSED":
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold tracking-wider uppercase">
            SELESAI
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Page Title & Actions (Sebaris dengan Headline tanpa bottom line) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ringkasan Operasional
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-1">
            Pantau performa dan operasional bengkel.
          </p>
        </div>

        {/* Buttons ganti sandi, website publik & akun sebaris dengan headline */}
        <AdminHeaderActions />
      </div>

      {/* Metric Cards Grid - 3 Columns (Wider & Balanced) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {/* Metric 1: Total Leads */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[11px] font-mono tracking-wider uppercase">Total Permintaan</span>
            <div className="w-8 h-8 bg-white/[0.04] border border-[#2E2E2E] flex items-center justify-center text-zinc-300 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono">{inquiriesCount}</span>
            <span className="text-xs font-mono text-zinc-400">leads masuk</span>
          </div>
          <div className="mt-4 pt-3.5 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">Belum diproses:</span>
            <span className="text-orange-400 font-bold">{newInquiriesCount} baru</span>
          </div>
        </div>

        {/* Metric 2: Layanan */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[11px] font-mono tracking-wider uppercase">Katalog Layanan</span>
            <div className="w-8 h-8 bg-white/[0.04] border border-[#2E2E2E] flex items-center justify-center text-zinc-300 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono">{servicesCount}</span>
            <span className="text-xs font-mono text-zinc-400">divisi mold</span>
          </div>
          <div className="mt-4 pt-3.5 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">Status publik:</span>
            <span className="text-emerald-400 font-medium">Tersedia di web</span>
          </div>
        </div>

        {/* Metric 3: Portofolio */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[11px] font-mono tracking-wider uppercase">Portofolio Hasil</span>
            <div className="w-8 h-8 bg-white/[0.04] border border-[#2E2E2E] flex items-center justify-center text-zinc-300 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono">{portfolioCount}</span>
            <span className="text-xs font-mono text-zinc-400">item cetakan</span>
          </div>
          <div className="mt-4 pt-3.5 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">Dokumentasi:</span>
            <span className="text-zinc-300">Multi-foto galeri</span>
          </div>
        </div>
      </div>

      {/* Quick Access Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        <Link
          href="/admin/inquiries"
          className="p-5 bg-[#1A1A1A] border border-[#2B2B2B] hover:border-orange-500/50 hover:bg-[#1E1E1E] flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Inbox strokeWidth={1.35} className="w-9 h-9 sm:w-10 sm:h-10 text-orange-400 shrink-0 group-hover:text-orange-300 group-hover:scale-105 transition-all" />
            <div className="space-y-1 text-left min-w-0">
              <span className="block text-xs font-mono font-semibold text-orange-400 tracking-wider uppercase truncate">
                KELOLA LEADS
              </span>
              <p className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                Permintaan Penawaran & Kontak
              </p>
            </div>
          </div>
          <ChevronRight strokeWidth={1.75} className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
        </Link>

        <Link
          href="/admin/services"
          className="p-5 bg-[#1A1A1A] border border-[#2B2B2B] hover:border-orange-500/50 hover:bg-[#1E1E1E] flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Layers strokeWidth={1.35} className="w-9 h-9 sm:w-10 sm:h-10 text-orange-400 shrink-0 group-hover:text-orange-300 group-hover:scale-105 transition-all" />
            <div className="space-y-1 text-left min-w-0">
              <span className="block text-xs font-mono font-semibold text-orange-400 tracking-wider uppercase truncate">
                KATALOG MOLD
              </span>
              <p className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                Tambah & Update Layanan
              </p>
            </div>
          </div>
          <ChevronRight strokeWidth={1.75} className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
        </Link>

        <Link
          href="/admin/company"
          className="p-5 bg-[#1A1A1A] border border-[#2B2B2B] hover:border-orange-500/50 hover:bg-[#1E1E1E] flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Building2 strokeWidth={1.35} className="w-9 h-9 sm:w-10 sm:h-10 text-orange-400 shrink-0 group-hover:text-orange-300 group-hover:scale-105 transition-all" />
            <div className="space-y-1 text-left min-w-0">
              <span className="block text-xs font-mono font-semibold text-orange-400 tracking-wider uppercase truncate">
                PROFIL BENGKEL
              </span>
              <p className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                Alamat, Kontak & Jam Operasional
              </p>
            </div>
          </div>
          <ChevronRight strokeWidth={1.75} className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
        </Link>
      </div>

      {/* Recent Inquiries Section */}
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#262626]">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Permintaan Masuk Terbaru
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              5 prospek penawaran terakhir yang dikirim melalui formulir website
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-mono text-orange-400 hover:text-orange-300 uppercase tracking-wider transition-colors"
          >
            Lihat Semua
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#333333] bg-white/[0.02]">
            <Inbox className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-400 font-medium">Belum ada permintaan penawaran baru.</p>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Pesan yang dikirim pengunjung melalui form kontak akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#262626] text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Tanggal</th>
                  <th className="pb-3 pr-4">Nama / Perusahaan</th>
                  <th className="pb-3 pr-4">Layanan</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 pr-4 text-zinc-400 whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 pr-4 text-white">
                      <div className="font-semibold">{inquiry.name}</div>
                      {inquiry.companyName && (
                        <div className="text-[11px] text-zinc-400 font-normal">
                          {inquiry.companyName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-zinc-300">
                      {inquiry.serviceType || "Konsultasi Umum"}
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/inquiries?id=${inquiry.id}`}
                        className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:text-white transition-colors"
                      >
                        <span>Kelola</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
