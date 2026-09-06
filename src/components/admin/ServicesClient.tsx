"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import {
  createServiceAction,
  updateServiceAction,
  softDeleteServiceAction,
} from "@/actions/services";
import { ServiceInput } from "@/lib/validations/service";
import AdminHeaderActions from "./AdminHeaderActions";

interface Service {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  materials: string[];
  maxCapacity: string | null;
  imageUrl: string | null;
  orderIndex: number;
}

interface ServicesClientProps {
  initialServices: Service[];
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [materialsStr, setMaterialsStr] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);

  const resetForm = () => {
    setTitle("");
    setShortDesc("");
    setFullDesc("");
    setMaterialsStr("");
    setMaxCapacity("");
    setImageUrl("");
    setOrderIndex(0);
    setEditingService(null);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    resetForm();
    setModalOpen(true);
    setNotification(null);
  };

  const handleOpenEdit = (svc: Service) => {
    setEditingService(svc);
    setTitle(svc.title);
    setShortDesc(svc.shortDesc);
    setFullDesc(svc.fullDesc);
    setMaterialsStr(svc.materials.join(", "));
    setMaxCapacity(svc.maxCapacity || "");
    setImageUrl(svc.imageUrl || "");
    setOrderIndex(svc.orderIndex);
    setModalOpen(true);
    setNotification(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    const materialsArray = materialsStr
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const payload: ServiceInput = {
      title,
      shortDesc,
      fullDesc,
      materials: materialsArray.length > 0 ? materialsArray : ["Baja 2311", "Baja 2316"],
      maxCapacity: maxCapacity || undefined,
      imageUrl: imageUrl || undefined,
      orderIndex: Number(orderIndex) || 0,
    };

    try {
      if (editingService) {
        const res = await updateServiceAction(editingService.id, payload);
        if (res.success && res.data) {
          setServices((prev) =>
            prev.map((s) => (s.id === editingService.id ? (res.data as Service) : s))
          );
          setNotification({ text: "Layanan berhasil diperbarui." });
          setModalOpen(false);
          router.refresh();
        } else {
          setNotification({ text: res.message || "Gagal mengupdate layanan.", isError: true });
        }
      } else {
        const res = await createServiceAction(payload);
        if (res.success && res.data) {
          setServices((prev) => [...prev, res.data as Service]);
          setNotification({ text: "Layanan baru berhasil ditambahkan." });
          setModalOpen(false);
          router.refresh();
        } else {
          setNotification({ text: res.message || "Gagal menambah layanan.", isError: true });
        }
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: "Terjadi kesalahan sistem.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan "${name}"?`)) {
      try {
        const res = await softDeleteServiceAction(id);
        if (res.success) {
          setServices((prev) => prev.filter((s) => s.id !== id));
          setNotification({ text: `Layanan "${name}" berhasil dihapus.` });
          router.refresh();
        } else {
          setNotification({ text: res.message || "Gagal menghapus.", isError: true });
        }
      } catch (err) {
        console.error(err);
        setNotification({ text: "Terjadi kesalahan saat menghapus layanan.", isError: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Katalog Layanan Molding
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-1">
            Kelola divisi dan spesifikasi cetakan mold.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-nowrap">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="h-10 px-4 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors shadow-md shadow-orange-950/40 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah Layanan</span>
          </button>
          <AdminHeaderActions />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-3.5 text-xs font-mono flex items-center gap-2.5 ${
            notification.isError
              ? "bg-red-950/40 border border-red-500/30 text-red-200"
              : "bg-emerald-950/40 border border-emerald-500/30 text-emerald-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Services Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {services.length === 0 ? (
          <div className="col-span-full bg-[#1A1A1A] border border-[#2B2B2B] p-12 text-center">
            <Layers className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-400">Belum ada layanan yang tersimpan.</p>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Klik &quot;Tambah Layanan&quot; untuk menambahkan divisi cetakan baru.
            </p>
          </div>
        ) : (
          services.map((svc) => (
            <div
              key={svc.id}
              className="bg-[#1A1A1A] border border-[#2B2B2B] p-5 flex flex-col justify-between hover:border-orange-500/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
                    URUTAN #{svc.orderIndex}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(svc)}
                      title="Edit Layanan"
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#141414] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(svc.id, svc.title)}
                      title="Hapus Layanan"
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {svc.shortDesc}
                  </p>
                </div>

                {/* Materials Tags */}
                {svc.materials && svc.materials.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
                      Pilihan Baja Perkakas:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {svc.materials.map((mat) => (
                        <span
                          key={mat}
                          className="px-2 py-0.5 text-[10px] font-mono bg-[#141414] border border-[#2B2B2B] text-zinc-300"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {svc.maxCapacity && (
                  <div className="text-[11px] font-mono text-orange-400 pt-1">
                    Kapasitas: {svc.maxCapacity}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Slug: /{svc.slug}</span>
                <span className="text-emerald-400">AKTIF</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] w-full max-w-lg p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <h3 className="text-base font-bold text-white">
                {editingService ? "Edit Layanan Molding" : "Tambah Layanan Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Nama Layanan / Divisi
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Plastic Injection Mold Making"
                  required
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Deskripsi Singkat (Ringkasan Web)
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Pembuatan cetakan presisi tinggi untuk komponen otomotif & elektronik..."
                  required
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Deskripsi Lengkap / Spesifikasi Teknis
                </label>
                <textarea
                  rows={4}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Penjelasan tahapan perancangan CAD 3D, pemilihan baja, proses milling CNC, hingga uji coba sampel T0/T1..."
                  required
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Bahan Baja Perkakas (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={materialsStr}
                  onChange={(e) => setMaterialsStr(e.target.value)}
                  placeholder="Baja 2311, Baja 2316, Baja 1730, S50C"
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                    Kapasitas Maksimal
                  </label>
                  <input
                    type="text"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="Contoh: s/d 500 Ton"
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#141414] border border-[#333333] text-zinc-400 hover:text-white uppercase transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold flex items-center gap-2 uppercase transition-colors"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingService ? "Simpan Perubahan" : "Tambah Layanan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
