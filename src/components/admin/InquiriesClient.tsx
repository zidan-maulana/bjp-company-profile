"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import { updateInquiryStatusAction } from "@/actions/inquiry";
import AdminHeaderActions from "./AdminHeaderActions";

interface Inquiry {
  id: string;
  name: string;
  companyName: string | null;
  email: string;
  phone: string;
  serviceType: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  internalNote: string | null;
  createdAt: string | Date;
}

interface InquiriesClientProps {
  initialInquiries: Inquiry[];
}

export default function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNoteInput, setInternalNoteInput] = useState("");
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  const filteredInquiries = inquiries.filter((item) => {
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      (item.companyName && item.companyName.toLowerCase().includes(query)) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.includes(query) ||
      (item.serviceType && item.serviceType.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setInternalNoteInput(inquiry.internalNote || "");
    setNotification(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: "NEW" | "CONTACTED" | "CLOSED") => {
    setIsUpdating(true);
    setNotification(null);

    try {
      const res = await updateInquiryStatusAction({
        id,
        status: newStatus,
        internalNote: internalNoteInput,
      });

      if (res.success && res.data) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus, internalNote: internalNoteInput } : item
          )
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({
            ...selectedInquiry,
            status: newStatus,
            internalNote: internalNoteInput,
          });
        }
        setNotification({ text: "Status & catatan berhasil diperbarui." });
        router.refresh();
      } else {
        setNotification({ text: res.message || "Gagal memperbarui status.", isError: true });
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: "Terjadi kesalahan saat mengupdate status.", isError: true });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono bg-orange-950/60 border border-orange-500/40 text-orange-400 font-semibold tracking-wider uppercase">
            BARU
          </span>
        );
      case "CONTACTED":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono bg-blue-950/60 border border-blue-500/40 text-blue-400 font-semibold tracking-wider uppercase">
            DIHUBUNGI
          </span>
        );
      case "CLOSED":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold tracking-wider uppercase">
            SELESAI
          </span>
        );
      default:
        return null;
    }
  };

  const formatPhoneForWA = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    return clean;
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Manajemen Permintaan Masuk (Leads)
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-1">
            Kelola penawaran dan prospek klien ({inquiries.length} pesan).
          </p>
        </div>

        <AdminHeaderActions />
      </div>

      <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, PT, email, WA..."
            className="w-full pl-9 pr-4 py-2 bg-[#141414] border border-[#333333] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "ALL", label: "SEMUA" },
            { key: "NEW", label: "BARU" },
            { key: "CONTACTED", label: "DIHUBUNGI" },
            { key: "CLOSED", label: "SELESAI" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
                statusFilter === tab.key
                  ? "bg-orange-600 text-white font-semibold"
                  : "bg-[#141414] border border-[#2B2B2B] text-zinc-400 hover:text-white hover:bg-[#1E1E1E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`bg-[#1A1A1A] border border-[#2B2B2B] ${selectedInquiry ? "lg:col-span-7" : "lg:col-span-12"}`}>
          <div className="p-4 border-b border-[#262626] flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 tracking-wider">
              DAFTAR PESAN ({filteredInquiries.length})
            </span>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Tidak ada pesan penawaran.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#262626] text-zinc-400 uppercase tracking-wider">
                    <th className="p-3.5">Tanggal</th>
                    <th className="p-3.5">Klien</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredInquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInternalNoteInput(inq.internalNote || "");
                        setNotification(null);
                      }}
                      className={`cursor-pointer transition-colors ${
                        selectedInquiry?.id === inq.id
                          ? "bg-orange-950/25 border-l-2 border-orange-500"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="p-3.5 text-zinc-400 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{inq.name}</div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                          {inq.companyName || inq.serviceType || "Konsultasi Mold"}
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {getStatusBadge(inq.status)}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-[#141414] border border-[#2B2B2B] hover:bg-orange-600 hover:text-white text-zinc-300 text-[11px] font-mono transition-colors"
                        >
                          Buka
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedInquiry && (
          <div className="lg:col-span-5 bg-[#1A1A1A] border border-[#2B2B2B] p-5 sm:p-6 space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <span className="text-[10px] font-mono text-orange-400 tracking-widest uppercase">
                  DETAIL PERMINTAAN
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedInquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 bg-[#141414] border border-[#2B2B2B]"
              >
                Tutup
              </button>
            </div>

            {notification && (
              <div
                className={`p-3 text-xs font-mono flex items-center gap-2 ${
                  notification.isError
                    ? "bg-red-950/50 border border-red-500/30 text-red-200"
                    : "bg-emerald-950/50 border border-emerald-500/30 text-emerald-200"
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{notification.text}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${formatPhoneForWA(selectedInquiry.phone)}?text=Halo%20${encodeURIComponent(
                  selectedInquiry.name
                )},%20kami%20dari%20Baruna%20Jaya%20Plastik%20ingin%20menindaklanjuti%20permintaan%20penawaran%20mold%20Anda.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs tracking-wider font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hubungi WA</span>
              </a>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Tindak%20Lanjut%20Penawaran%20Mold%20-%20Baruna%20Jaya%20Plastik`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#141414] border border-[#2B2B2B] hover:bg-[#262626] text-white font-mono text-xs tracking-wider transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kirim Email</span>
              </a>
            </div>

            <div className="space-y-3 bg-[#141414] border border-[#2B2B2B] p-4 font-mono text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Nomor Telepon:</span>
                <span className="text-white font-medium">{selectedInquiry.phone}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Alamat Email:</span>
                <span className="text-white font-medium">{selectedInquiry.email}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Jenis Layanan Diminati:</span>
                <span className="text-orange-400 font-medium">
                  {selectedInquiry.serviceType || "Konsultasi Teknis"}
                </span>
              </div>
              <div className="pt-2 border-t border-[#262626]">
                <span className="text-zinc-400 block text-[10px] uppercase mb-1">
                  Pesan / Spesifikasi Cetakan:
                </span>
                <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap bg-[#0D0D0D] p-2.5 border border-[#262626]">
                  {selectedInquiry.message}
                </p>
              </div>
              <div className="text-[10px] text-zinc-400">
                Waktu Terkirim: {new Date(selectedInquiry.createdAt).toLocaleString("id-ID")}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-3">
                Catatan Internal Tim Produksi:
              </label>
              <textarea
                rows={3}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Misal: Sudah kontak via WA, minta sampel produk botol HDPE 500ml, siap quote minggu depan..."
                className="w-full p-3 bg-[#141414] border border-[#333333] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 font-mono"
              />

              <div className="space-y-1.5">
                <span className="block text-[11px] font-mono text-zinc-400 uppercase">
                  Ubah Status Tindak Lanjut:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "NEW")}
                    className={`py-2 text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                      selectedInquiry.status === "NEW"
                        ? "bg-orange-600 text-white border-orange-500"
                        : "bg-[#141414] text-zinc-400 border-[#2B2B2B] hover:text-white hover:bg-[#1E1E1E]"
                    }`}
                  >
                    BARU
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "CONTACTED")}
                    className={`py-2 text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                      selectedInquiry.status === "CONTACTED"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-[#141414] text-zinc-400 border-[#2B2B2B] hover:text-white hover:bg-[#1E1E1E]"
                    }`}
                  >
                    DIHUBUNGI
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "CLOSED")}
                    className={`py-2 text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                      selectedInquiry.status === "CLOSED"
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-[#141414] text-zinc-400 border-[#2B2B2B] hover:text-white hover:bg-[#1E1E1E]"
                    }`}
                  >
                    SELESAI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
