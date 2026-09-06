"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ExternalLink,
  Tag,
  ImageIcon,
  ChevronDown,
} from "lucide-react";
import {
  createPortfolioAction,
  updatePortfolioAction,
  softDeletePortfolioAction,
} from "@/actions/portfolio";
import { PortfolioItemInput } from "@/lib/validations/portfolio";
import AdminHeaderActions from "./AdminHeaderActions";

interface PortfolioImage {
  id?: string;
  imageUrl: string;
  caption?: string | null;
  orderIndex?: number;
}

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  material: string;
  category: string;
  clientName: string | null;
  images: PortfolioImage[];
  createdAt: string | Date;
}

interface PortfolioClientProps {
  initialItems: PortfolioItem[];
}

const CATEGORIES = [
  "ALL",
  "Automotive",
  "Food & Beverage",
  "Consumer Goods",
  "Electronic & Appliances",
  "Medical & Sanitary",
  "Industrial",
];

export default function PortfolioClient({ initialItems }: PortfolioClientProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Automotive");
  const [material, setMaterial] = useState("Baja 2311 Pre-hardened");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(
    (item) => activeCategory === "ALL" || item.category === activeCategory
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file foto maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
        setImageFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Automotive");
    setMaterial("Baja 2311 Pre-hardened");
    setClientName("");
    setDescription("");
    setImageUrl("");
    setImageFileName("");
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    resetForm();
    setModalOpen(true);
    setNotification(null);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setMaterial(item.material);
    setClientName(item.clientName || "");
    setDescription(item.description);
    const currentImg = item.images?.[0]?.imageUrl || "";
    setImageUrl(currentImg);
    setImageFileName(currentImg ? "Foto Dokumentasi Tersimpan" : "");
    setCaption(item.images?.[0]?.caption || item.title);
    setModalOpen(true);
    setNotification(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    const payload: PortfolioItemInput = {
      title,
      category,
      material,
      clientName: clientName || undefined,
      description,
      images: [
        {
          imageUrl: imageUrl || "/hero-bg.webp",
          caption: caption || title,
          orderIndex: 0,
        },
      ],
    };

    try {
      if (editingItem) {
        const res = await updatePortfolioAction(editingItem.id, payload);
        if (res.success && res.data) {
          const updated = res.data as unknown as PortfolioItem;
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? updated : it))
          );
          setNotification({ text: `Portofolio "${title}" berhasil diperbarui.` });
          setModalOpen(false);
        } else {
          setNotification({ text: res.message || "Gagal memperbarui portofolio.", isError: true });
        }
      } else {
        const res = await createPortfolioAction(payload);
        if (res.success && res.data) {
          setItems((prev) => [res.data as unknown as PortfolioItem, ...prev]);
          setNotification({ text: "Portofolio cetakan baru berhasil ditambahkan." });
          setModalOpen(false);
        } else {
          setNotification({ text: res.message || "Gagal membuat portofolio.", isError: true });
        }
      }
    } catch (err) {
      console.error(err);
      setNotification({ text: "Terjadi gangguan sistem saat menyimpan portofolio.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus cetakan "${name}" dari galeri portofolio?`)) {
      try {
        const res = await softDeletePortfolioAction(id);
        if (res.success) {
          setItems((prev) => prev.filter((item) => item.id !== id));
          setNotification({ text: `Portofolio "${name}" berhasil dihapus.` });
        } else {
          setNotification({ text: res.message || "Gagal menghapus.", isError: true });
        }
      } catch (err) {
        console.error(err);
        setNotification({ text: "Gagal memproses penghapusan.", isError: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Galeri Portofolio Hasil Mold
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-1">
            Dokumentasi cetakan presisi hasil produksi.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-nowrap">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="h-10 px-4 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors shadow-md shadow-orange-950/40 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah Portofolio</span>
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

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#262626]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "bg-orange-600 text-white font-semibold border border-orange-600"
                : "bg-[#141414] border border-[#2B2B2B] text-zinc-400 hover:text-white hover:bg-[#1E1E1E]"
            }`}
          >
            {cat === "ALL" ? "SEMUA KATEGORI" : cat}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-[#1A1A1A] border border-[#2B2B2B] p-12 text-center">
            <FolderKanban className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-400">Belum ada portofolio pada kategori ini.</p>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Klik &quot;Tambah Portofolio&quot; untuk mengunggah dokumentasi cetakan baru.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#1A1A1A] border border-[#2B2B2B] flex flex-col justify-between hover:border-orange-500/40 transition-all group overflow-hidden"
            >
              {/* Image Preview Box - Static Crisp (No Zoom on Hover) */}
              <div className="relative aspect-video w-full bg-[#0D0D0D] overflow-hidden border-b border-[#262626]">
                {item.images && item.images[0]?.imageUrl ? (
                  <img
                    src={item.images[0].imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#141414]/90 backdrop-blur-md text-[10px] font-mono text-orange-400 border border-[#2B2B2B] uppercase">
                  {item.category}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Portofolio"
                        className="p-1.5 text-zinc-400 hover:text-orange-400 hover:bg-orange-950/30 transition-colors shrink-0 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Hapus Portofolio"
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#262626] space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Baja Perkakas:</span>
                    <span className="text-white font-medium">{item.material}</span>
                  </div>
                  {item.clientName && (
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Klien:</span>
                      <span className="text-zinc-300">{item.clientName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] w-full max-w-lg p-5 sm:p-6 space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <h3 className="text-base font-bold text-white">
                {editingItem ? "Edit Portofolio Cetakan" : "Tambah Portofolio Cetakan"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Judul Cetakan / Part
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Precision Mold Tutup Galon 19L (8 Cavity)"
                  required
                  className="w-full px-3 py-2 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                    Kategori Sektor
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 pr-10 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer font-mono text-xs"
                    >
                      <option value="Automotive">Automotive</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Consumer Goods">Consumer Goods</option>
                      <option value="Electronic & Appliances">Electronic & Appliances</option>
                      <option value="Medical & Sanitary">Medical & Sanitary</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 flex items-center">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                    Material Baja
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Contoh: Baja 2311 Pre-hardened"
                    required
                    className="w-full px-3 py-2 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Nama Klien / Brand (Opsional)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Manufaktur Otomotif Cikarang"
                  className="w-full px-3 py-2 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Deskripsi Teknis Cetakan
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jumlah cavity, sistem runner, siklus waktu cetak, serta keunggulan presisi mold..."
                  required
                  className="w-full px-3 py-2 bg-[#141414] border border-[#333333] text-white focus:outline-none focus:border-orange-500 transition-colors leading-relaxed text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-zinc-300 mb-3 uppercase">
                  Foto Dokumentasi Cetakan
                </label>

                {imageUrl ? (
                  <div className="p-2 bg-[#141414] border border-[#333333] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-8 h-8 bg-black border border-[#2B2B2B] shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt="Preview cetakan" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 text-xs font-mono">
                        <p className="text-white truncate font-medium text-[11px]">{imageFileName || "Foto Cetakan Terpilih"}</p>
                        <p className="text-[9px] text-emerald-400">Foto siap diunggah</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-zinc-300 hover:text-white text-[10px] font-mono transition-colors cursor-pointer"
                      >
                        Ganti
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl("");
                          setImageFileName("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        title="Hapus foto"
                        className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3.5 bg-[#141414] border border-dashed border-[#333333] hover:border-orange-500/60 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono font-medium text-white group-hover:text-orange-300 transition-colors truncate">
                        Pilih / Unggah Foto Cetakan
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        (JPG, PNG, WEBP maks. 5MB)
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-[#1A1A1A] border border-[#2B2B2B] text-[10px] font-mono text-zinc-300 group-hover:text-white group-hover:border-orange-500/40 shrink-0">
                      Browse
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#141414] border border-[#333333] text-zinc-400 hover:text-white text-xs uppercase transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold flex items-center gap-2 text-xs uppercase transition-colors shadow-lg shadow-orange-950/40 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Simpan Perubahan" : "Simpan Portofolio"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
