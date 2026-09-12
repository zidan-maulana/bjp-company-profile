"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, KeyRound, Mail, ArrowRight } from "lucide-react";
import {
  requestPasswordResetOtpAction,
  verifyPasswordResetOtpAction,
  resetPasswordWithTokenAction,
} from "@/actions/auth";
import { useAdminLayout } from "./AdminLayoutContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

type ModalStep = "CONFIRM_EMAIL" | "ENTER_OTP" | "NEW_PASSWORD";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  defaultEmail = "admin@barunajayaplastik.com",
}: ChangePasswordModalProps) {
  const { showToast } = useAdminLayout();
  const [step, setStep] = useState<ModalStep>("CONFIRM_EMAIL");
  const [email, setEmail] = useState(defaultEmail || "admin@barunajayaplastik.com");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("CONFIRM_EMAIL");
    setOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
    setSuccessMessage(null);
    setDevOtpHint(null);
    onClose();
  };

  // Step 1: Send OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Silakan masukkan email administrator.");
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await requestPasswordResetOtpAction({ email: email.trim() });
      if (res.success) {
        setCountdown(60);
        setStep("ENTER_OTP");
        setSuccessMessage(res.message || "Kode OTP 6-digit telah dikirim ke email Anda.");
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
          setOtp(res.devOtp); // auto-fill in dev mode
        }
      } else {
        setErrorMessage(res.message || "Gagal mengirimkan kode OTP.");
      }
    } catch (err) {
      console.error("Error requesting OTP:", err);
      setErrorMessage("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (otp.trim().length !== 6) {
      setErrorMessage("Kode OTP harus berupa 6 digit angka.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const res = await verifyPasswordResetOtpAction({
        email: email.trim(),
        otp: otp.trim(),
      });

      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setStep("NEW_PASSWORD");
        setSuccessMessage(res.message || "Kode OTP terverifikasi! Silakan tentukan kata sandi baru.");
      } else {
        setErrorMessage(res.message || "Kode OTP yang Anda masukkan salah.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setErrorMessage("Terjadi kesalahan saat memverifikasi kode OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Save New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("Kata sandi baru minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await resetPasswordWithTokenAction({
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setSuccessMessage(res.message || "Kata sandi berhasil diperbarui!");
        showToast("Kata sandi akun administrator berhasil diperbarui.", {
          title: "Kata Sandi Diperbarui",
          type: "success",
        });
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setErrorMessage(res.message || "Gagal memperbarui kata sandi.");
      }
    } catch (err) {
      console.error("Error submitting new password:", err);
      setErrorMessage("Terjadi kesalahan saat memproses kata sandi baru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-6 sm:p-8 w-full max-w-[480px] shadow-2xl rounded-none">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#2E2E2E]">
          <div>
            <div className="flex items-center gap-2 text-orange-500 text-[10px] font-mono tracking-[0.2em] uppercase">
              <KeyRound className="w-3.5 h-3.5" />
              <span>KEAMANAN ADMINISTRATOR</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-wide mt-1">
              Ganti Kata Sandi
            </h3>
            <p className="text-[11px] text-[#888888] font-mono mt-0.5">
              Verifikasi kode OTP 6-digit dikirimkan ke Gmail terdaftar.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progressive Step Indicator */}
        <div className="flex items-center justify-between px-1 py-1 mb-4 text-[10px] font-mono select-none">
          <div className={`flex items-center gap-1.5 ${step === "CONFIRM_EMAIL" ? "text-orange-500 font-bold" : "text-zinc-500"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step !== "CONFIRM_EMAIL" ? "bg-emerald-950 text-emerald-400 border border-emerald-700" : "bg-orange-600 text-white"}`}>
              {step !== "CONFIRM_EMAIL" ? "✓" : "1"}
            </span>
            <span>EMAIL</span>
          </div>
          <span className="text-zinc-700">──</span>
          <div className={`flex items-center gap-1.5 ${step === "ENTER_OTP" ? "text-orange-500 font-bold" : step === "NEW_PASSWORD" ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step === "NEW_PASSWORD" ? "bg-emerald-950 text-emerald-400 border border-emerald-700" : step === "ENTER_OTP" ? "bg-orange-600 text-white" : "bg-[#141414] border border-[#2B2B2B] text-zinc-400"}`}>
              {step === "NEW_PASSWORD" ? "✓" : "2"}
            </span>
            <span>KODE OTP</span>
          </div>
          <span className="text-zinc-700">──</span>
          <div className={`flex items-center gap-1.5 ${step === "NEW_PASSWORD" ? "text-orange-500 font-bold" : "text-zinc-500"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step === "NEW_PASSWORD" ? "bg-orange-600 text-white" : "bg-[#141414] border border-[#2B2B2B] text-zinc-400"}`}>
              3
            </span>
            <span>SANDI BARU</span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-[11px] font-mono flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dev OTP Helper */}
        {devOtpHint && (
          <div className="mb-4 p-2 bg-[#141414] border border-orange-500/30 text-orange-400 text-[10px] font-mono flex items-center justify-between">
            <span>Simulasi Dev OTP:</span>
            <span className="font-bold tracking-widest bg-orange-950/60 px-2 py-0.5 border border-orange-500/40">
              {devOtpHint}
            </span>
          </div>
        )}

        {/* STEP 1: CONFIRM EMAIL & REQUEST OTP */}
        {step === "CONFIRM_EMAIL" && (
          <form onSubmit={handleRequestOtp} className="space-y-6 pt-1">
            <div className="space-y-2.5">
              <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase px-1">
                EMAIL ADMINISTRATOR
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@barunajayaplastik.com"
                className="w-full bg-white/[0.02] border-b border-[#333333] focus:border-orange-600 text-white font-sans text-xs sm:text-sm px-3.5 py-3 outline-none [color-scheme:dark]"
              />
              <p className="text-[10px] text-[#777777] font-mono px-1 pt-1.5 truncate">
                Kode verifikasi 6-digit akan dikirim ke Gmail.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp || countdown > 0}
              className="w-full mt-4 py-4 px-6 bg-[#F24E1E] hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
            >
              {isSendingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>MENGIRIM KODE OTP...</span>
                </>
              ) : countdown > 0 ? (
                <span>TUNGGU ({countdown}s)</span>
              ) : (
                <span>KIRIM KODE OTP KE GMAIL</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER & VERIFY OTP */}
        {step === "ENTER_OTP" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 pt-1">
            <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-[#2E2E2E] text-[11px] font-mono">
              <div className="truncate pr-2">
                <span className="text-[#888888]">Terkirim ke: </span>
                <span className="text-white font-semibold">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("CONFIRM_EMAIL");
                  setErrorMessage(null);
                }}
                className="text-orange-400 hover:text-orange-300 text-[10px] underline cursor-pointer shrink-0"
              >
                Ubah Email
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase px-1 text-center">
                KODE OTP (6 DIGIT DARI GMAIL) <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Contoh: 849201"
                required
                autoFocus
                className="w-full bg-white/[0.02] border-b-2 border-[#333333] focus:border-orange-600 text-orange-400 font-mono text-center tracking-[0.4em] text-xl py-3 outline-none [color-scheme:dark]"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono px-1 pt-1">
              <span className="text-[#666666]">Tidak menerima kode?</span>
              {countdown > 0 ? (
                <span className="text-zinc-500">Kirim ulang ({countdown}s)</span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isSendingOtp}
                  className="text-orange-500 hover:text-orange-400 underline cursor-pointer"
                >
                  Kirim Ulang OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifyingOtp || otp.length !== 6}
              className="w-full mt-4 py-4 px-6 bg-[#F24E1E] hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>MEMVERIFIKASI KODE...</span>
                </>
              ) : (
                <span>VERIFIKASI KODE OTP</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: SET NEW PASSWORD */}
        {step === "NEW_PASSWORD" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kode valid! Masukkan kata sandi baru Anda.</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase px-1">
                KATA SANDI BARU (MIN. 8 KARAKTER) <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="w-full bg-white/[0.02] border-b border-[#333333] focus:border-orange-600 text-white font-sans text-xs sm:text-sm px-3.5 pr-10 py-2 outline-none [color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-1"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase px-1">
                KONFIRMASI KATA SANDI BARU <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.02] border-b border-[#333333] focus:border-orange-600 text-white font-sans text-xs sm:text-sm px-3.5 pr-10 py-2 outline-none [color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#F24E1E] hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>MENYIMPAN KATA SANDI...</span>
                  </>
                ) : (
                  <span>SIMPAN KATA SANDI BARU</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
