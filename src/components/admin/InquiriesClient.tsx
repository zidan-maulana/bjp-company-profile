"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Search,
  Phone,
  Mail,
  Building,
  AlertCircle,
  Loader2,
  Trash2,
  Pencil,
  X,
  Save,
  CheckCircle2,
} from "lucide-react";
import {
  updateInquiryStatusAction,
  updateInquiryAction,
  deleteInquiryAction,
} from "@/actions/inquiry";
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

const SERVICE_OPTIONS = [
  "Pembuatan Mold Plastic Injection",
  "Pembuatan Mold Plastic Blowing",
  "Service & Modifikasi Cetakan Mold",
  "Konsultasi Desain & DFM Mold",
  "Lainnya",
];

export default function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [internalNoteInput, setInternalNoteInput] = useState("");
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editServiceType, setEditServiceType] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editStatus, setEditStatus] = useState<"NEW" | "CONTACTED" | "CLOSED">("NEW");
  const [editInternalNote, setEditInternalNote] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const handleOpenEdit = (inq: Inquiry) => {
    setEditId(inq.id);
    setEditName(inq.name);
    setEditCompanyName(inq.companyName || "");
    setEditEmail(inq.email);
    setEditPhone(inq.phone);
    setEditServiceType(inq.serviceType || SERVICE_OPTIONS[0]);
    setEditMessage(inq.message);
    setEditStatus(inq.status);
    setEditInternalNote(inq.internalNote || "");
    setIsEditModalOpen(true);
    setNotification(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    setNotification(null);

    try {
      const res = await updateInquiryAction({
        id: editId,
        name: editName.trim(),
        companyName: editCompanyName.trim() || undefined,
        email: editEmail.trim(),
        phone: editPhone.trim(),
        serviceType: editServiceType,
        message: editMessage.trim(),
        status: editStatus,
        internalNote: editInternalNote.trim() || undefined,
      });

      if (res.success && res.data) {
        const updated = res.data as unknown as Inquiry;
        setInquiries((prev) => prev.map((item) => (item.id === editId ? updated : item)));
        if (selectedInquiry?.id === editId) {
          setSelectedInquiry(updated);
          setInternalNoteInput(updated.internalNote || "");
        }
        setNotification({ text: `Permintaan dari "${editName}" berhasil diperbarui.` });
        setIsEditModalOpen(false);
        router.refresh();
      } else {
        setNotification({ text: res.message || "Gagal memperbarui data permintaan.", isError: true });
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: "Terjadi kesalahan saat memperbarui permintaan.", isError: true });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus permintaan masuk dari "${name}"?\nData akan dihapus secara permanen dari database.`
      )
    ) {
      setIsDeleting(true);
      setNotification(null);

      try {
        const res = await deleteInquiryAction(id);
        if (res.success) {
          setInquiries((prev) => prev.filter((item) => item.id !== id));
          if (selectedInquiry?.id === id) {
            setSelectedInquiry(null);
          }
          setNotification({ text: `Permintaan dari "${name}" berhasil dihapus.` });
          router.refresh();
        } else {
          setNotification({ text: res.message || "Gagal menghapus permintaan.", isError: true });
        }
      } catch (err) {
        console.error(err);
        setNotification({ text: "Terjadi kesalahan sistem saat menghapus.", isError: true });
      } finally {
        setIsDeleting(false);
      }
    }
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
        setNotification({ text: "Status tindak lanjut berhasil diperbarui." });
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

  const handleSaveInternalNote = async () => {
    if (!selectedInquiry) return;
    setIsUpdating(true);
    setNotification(null);

    try {
      const res = await updateInquiryStatusAction({
        id: selectedInquiry.id,
        status: selectedInquiry.status,
        internalNote: internalNoteInput,
      });

      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === selectedInquiry.id ? { ...item, internalNote: internalNoteInput } : item
          )
        );
        setSelectedInquiry({
          ...selectedInquiry,
          internalNote: internalNoteInput,
        });
        setNotification({ text: "Catatan internal tim berhasil disimpan." });
        router.refresh();
      } else {
        setNotification({ text: res.message || "Gagal menyimpan catatan.", isError: true });
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: "Terjadi kesalahan saat menyimpan catatan.", isError: true });
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

      {/* Global Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 text-xs font-mono flex items-center justify-between gap-2 border ${
            notification.isError
              ? "bg-red-950/50 border-red-500/40 text-red-200"
              : "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
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

      {/* Main Grid: Table & Detail Panel */}
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
                    <th className="p-3.5">Klien / Perusahaan</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredInquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => handleOpenDetail(inq)}
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
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(inq)}
                            className="px-2 py-1 bg-[#141414] border border-[#2B2B2B] hover:bg-orange-600 hover:text-white text-zinc-300 text-[11px] font-mono transition-colors"
                            title="Buka detail"
                          >
                            Buka
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(inq)}
                            className="p-1.5 bg-[#141414] border border-[#2B2B2B] hover:bg-zinc-800 hover:text-white text-zinc-400 text-[11px] font-mono transition-colors"
                            title="Edit data permintaan"
                          >
                            <Pencil className="w-3.5 h-3.5 text-orange-400" />
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(inq.id, inq.name)}
                            className="p-1.5 bg-[#141414] border border-[#2B2B2B] hover:bg-red-950/60 hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-[11px] font-mono transition-colors"
                            title="Hapus pesan permintaan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Detail Panel */}
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
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedInquiry)}
                  className="flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white px-2.5 py-1 bg-[#141414] border border-[#2B2B2B] hover:border-orange-500 transition-colors"
                  title="Edit data permintaan"
                >
                  <Pencil className="w-3 h-3 text-orange-400" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name)}
                  className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-red-300 px-2.5 py-1 bg-[#141414] border border-[#2B2B2B] hover:border-red-500/50 hover:bg-red-950/40 transition-colors"
                  title="Hapus permintaan masuk"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                  <span>Hapus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 bg-[#141414] border border-[#2B2B2B]"
                  title="Tutup detail"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

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
              {selectedInquiry.companyName && (
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Perusahaan / Instansi:</span>
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-zinc-400" />
                    {selectedInquiry.companyName}
                  </span>
                </div>
              )}
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Nomor Telepon / WhatsApp:</span>
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
                  Catatan Internal Tim Produksi:
                </label>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSaveInternalNote}
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-orange-400 hover:text-white px-2 py-1 bg-[#141414] border border-[#2B2B2B] hover:border-orange-500 transition-colors"
                >
                  <Save className="w-3 h-3" />
                  <span>Simpan Catatan</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Misal: Sudah kontak via WA, minta sampel produk botol HDPE 500ml, siap quote minggu depan..."
                className="w-full p-3 bg-[#141414] border border-[#333333] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 font-mono"
              />

              <div className="space-y-1.5 pt-1">
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

      {/* Edit Inquiry Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div>
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">
                  FORM EDIT PERMINTAAN
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Edit Data Leads: {editName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Nama Klien / Prospek *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Perusahaan / Instansi
                  </label>
                  <input
                    type="text"
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    placeholder="Contoh: PT. Sumber Makmur"
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="email@perusahaan.com"
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    No. HP / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Jenis Layanan Diminati
                  </label>
                  <select
                    value={editServiceType}
                    onChange={(e) => setEditServiceType(e.target.value)}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Status Tindak Lanjut
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "NEW" | "CONTACTED" | "CLOSED")}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="NEW">BARU (Belum Dihubungi)</option>
                    <option value="CONTACTED">DIHUBUNGI (Dalam Diskusi)</option>
                    <option value="CLOSED">SELESAI (Deal / Selesai)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                  Pesan / Rincian Spesifikasi Cetakan *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  placeholder="Rincian permintaan mold, ukuran part, material baja..."
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                  Catatan Internal Tim Produksi
                </label>
                <textarea
                  rows={3}
                  value={editInternalNote}
                  onChange={(e) => setEditInternalNote(e.target.value)}
                  placeholder="Catatan tim terkait perkembangan diskusi..."
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white border border-[#333333] bg-[#141414]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-mono font-semibold text-white bg-orange-600 hover:bg-orange-500 transition-colors disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

