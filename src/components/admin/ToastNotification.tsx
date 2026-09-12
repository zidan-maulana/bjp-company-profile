"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  text: string;
  title?: string;
  isError?: boolean;
  type?: "success" | "error" | "info";
  duration?: number;
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  return (
    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

function SingleToast({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const isError = toast.isError || toast.type === "error";
  const isInfo = toast.type === "info";
  const duration = toast.duration || 4500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role="alert"
      className={`pointer-events-auto w-full p-4 border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${
        isError
          ? "bg-[#181212]/95 border-red-500/50 shadow-red-950/50 text-white"
          : isInfo
          ? "bg-[#161412]/95 border-orange-500/50 shadow-orange-950/50 text-white"
          : "bg-[#101713]/95 border-emerald-500/50 shadow-emerald-950/50 text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 mt-0.5">
            {isError ? (
              <div className="w-6 h-6 rounded-full bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            ) : isInfo ? (
              <div className="w-6 h-6 rounded-full bg-orange-950/80 border border-orange-500/60 flex items-center justify-center text-orange-400">
                <Info className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h4
              className={`text-xs font-mono font-bold tracking-wider uppercase leading-tight ${
                isError ? "text-red-400" : isInfo ? "text-orange-400" : "text-emerald-400"
              }`}
            >
              {toast.title || (isError ? "Gagal Menyimpan" : isInfo ? "Informasi" : "Perubahan Tersimpan")}
            </h4>
            <p className="text-xs font-mono text-zinc-300 mt-1 leading-relaxed break-words">
              {toast.text}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="text-zinc-400 hover:text-white p-1 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
          title="Tutup Notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Countdown Line */}
      <div className="mt-3 w-full bg-zinc-800/80 h-0.5 overflow-hidden">
        <div
          className={`h-full animate-toast-progress ${
            isError ? "bg-red-500" : isInfo ? "bg-orange-500" : "bg-emerald-500"
          }`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
