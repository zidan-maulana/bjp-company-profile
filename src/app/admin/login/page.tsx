"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth";
import {
  loginAdminAction,
  requestPasswordResetOtpAction,
  verifyPasswordResetOtpAction,
  resetPasswordWithTokenAction,
} from "@/actions/auth";

type ForgotStep = "EMAIL" | "OTP" | "NEW_PASSWORD";

export default function AdminLoginPage() {
  const [mode, setMode] = useState<"LOGIN" | "FORGOT">("LOGIN");

  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Progressive Forgot Password States
  const [forgotStep, setForgotStep] = useState<ForgotStep>("EMAIL");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const validation = loginSchema.safeParse({ email, password, rememberMe });
    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginAdminAction({ email, password, rememberMe });

      if (!result.success) {
        setErrorMessage(result.message || "Autentikasi gagal.");
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Autentikasi berhasil! Mengalihkan ke dashboard...");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 400);
    } catch (err) {
      console.error("Login client error:", err);
      setErrorMessage("Terjadi gangguan koneksi ke server. Silakan coba kembali.");
      setIsLoading(false);
    }
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMessage("Silakan masukkan email administrator.");
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await requestPasswordResetOtpAction({ email: forgotEmail.trim() });
      if (res.success) {
        setCountdown(60);
        setForgotStep("OTP");
        setSuccessMessage(res.message || "Kode OTP 6-digit telah dikirim ke Gmail Anda.");
        if (res.devOtp) {
          setOtp(res.devOtp); // Auto-fill in dev mode for testing speed
        }
      } else {
        setErrorMessage(res.message || "Gagal mengirimkan kode OTP.");
      }
    } catch (err) {
      console.error("Request OTP error:", err);
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
        email: forgotEmail.trim(),
        otp: otp.trim(),
      });

      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setForgotStep("NEW_PASSWORD");
        setSuccessMessage(res.message || "Kode OTP terverifikasi! Silakan tentukan kata sandi baru.");
      } else {
        setErrorMessage(res.message || "Kode OTP yang Anda masukkan salah.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setErrorMessage("Terjadi kesalahan saat memverifikasi kode OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Set New Password
  const handleResetSubmit = async (e: React.FormEvent) => {
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

    setIsResetting(true);

    try {
      const res = await resetPasswordWithTokenAction({
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setSuccessMessage(res.message || "Kata sandi berhasil diperbarui!");
        setTimeout(() => {
          setEmail(forgotEmail);
          setPassword(newPassword);
          setMode("LOGIN");
          setForgotStep("EMAIL");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setResetToken("");
          setSuccessMessage("Kata sandi berhasil diubah. Silakan masuk.");
        }, 1500);
      } else {
        setErrorMessage(res.message || "Gagal memperbarui kata sandi.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setErrorMessage("Terjadi kesalahan sistem saat menyimpan sandi baru.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-orange-600 selection:text-white">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-orange-600/10 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f0a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f0a_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[440px] z-10">
        {/* Form Container */}
        <div className="relative bg-[#1A1A1A] border border-[#2B2B2B] p-6 sm:p-8 rounded-none shadow-2xl">
          {/* 4 Corner Registration Dots */}
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 w-1.5 h-1.5 bg-orange-600 select-none" />
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 w-1.5 h-1.5 bg-orange-600 select-none" />
          <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-1.5 h-1.5 bg-orange-600 select-none" />
          <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-1.5 h-1.5 bg-orange-600 select-none" />

          {/* Centered Brand Title with Official BJP Dual-Parallelogram Logo */}
          <div className={`text-center ${mode === "LOGIN" ? "pb-5 mb-5 border-b border-[#2E2E2E]" : "pb-0 mb-0"}`}>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 group mb-2 select-none cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <svg
                  className="w-7 h-6"
                  viewBox="0 0 32 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top Slanted Shape in Vibrant Orange */}
                  <polygon points="10,0 28,0 20,11 2,11" fill="#EA580C" />
                  {/* Bottom Slanted Shape in Clean White */}
                  <polygon points="12,14 30,14 22,25 4,25" fill="#FFFFFF" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-[0.25em] text-white font-mono uppercase group-hover:text-orange-400 transition-colors">
                BARUNA JAYA
              </h2>
            </Link>
            <p className="text-[10px] font-mono text-[#888888] tracking-[0.2em] uppercase">
              {mode === "LOGIN"
                ? "PORTAL ADMINISTRATOR RESMI"
                : "PEMULIHAN KATA SANDI (OTP GMAIL)"}
            </p>
          </div>

          {/* Error Notification */}
          {errorMessage && (
            <div className="my-3 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-[11px] font-mono flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Notification */}
          {successMessage && (
            <div className="my-3 p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === "LOGIN" ? (
            /* ================= MODE: LOGIN ================= */
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4 sm:space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase px-1">
                  EMAIL ADMINISTRATOR <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@barunajayaplastik.com"
                  className="w-full bg-white/[0.02] border-b border-[#333333] focus:border-orange-600 text-white font-sans text-xs sm:text-sm px-3.5 py-2.5 outline-none transition-colors [color-scheme:dark]"
                />
                {fieldErrors.email && (
                  <p className="text-red-400 text-[10px] font-mono mt-1 px-1">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase px-1">
                  KATA SANDI <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.02] border-b border-[#333333] focus:border-orange-600 text-white font-sans text-xs sm:text-sm px-3.5 pr-10 py-2.5 outline-none transition-colors [color-scheme:dark]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-400 text-[10px] font-mono mt-1 px-1">
                    {fieldErrors.password[0]}
                  </p>
                )}
              </div>

              {/* Remember Me & Lupa Kata Sandi (Side-by-side Aligned) */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-none bg-white/[0.05] border-[#333333] text-orange-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-orange-600"
                  />
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    Ingat sesi login
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setForgotEmail(email || "admin@barunajayaplastik.com");
                    setForgotStep("EMAIL");
                    setMode("FORGOT");
                  }}
                  className="text-[11px] font-mono text-orange-500 hover:text-orange-400 tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-4 px-6 bg-[#F24E1E] hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>MEMVERIFIKASI...</span>
                  </>
                ) : (
                  <span>MASUK KE DASHBOARD</span>
                )}
              </button>
            </form>
          ) : (
            /* ================= MODE: FORGOT PASSWORD (PROGRESSIVE 3-STEP WIZARD) ================= */
            <div>
              {/* Progressive Step Indicator (Centered Vertically) */}
              <div className="flex items-center justify-between px-1 py-5 text-[10px] font-mono select-none">
                <div className={`flex items-center gap-1.5 ${forgotStep === "EMAIL" ? "text-orange-500 font-bold" : "text-zinc-500"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${forgotStep !== "EMAIL" ? "bg-emerald-950 text-emerald-400 border border-emerald-700" : "bg-orange-600 text-white"}`}>
                    {forgotStep !== "EMAIL" ? "✓" : "1"}
                  </span>
                  <span>EMAIL</span>
                </div>
                <span className="text-zinc-700">──</span>
                <div className={`flex items-center gap-1.5 ${forgotStep === "OTP" ? "text-orange-500 font-bold" : forgotStep === "NEW_PASSWORD" ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${forgotStep === "NEW_PASSWORD" ? "bg-emerald-950 text-emerald-400 border border-emerald-700" : forgotStep === "OTP" ? "bg-orange-600 text-white" : "bg-white/10 text-zinc-400"}`}>
                    {forgotStep === "NEW_PASSWORD" ? "✓" : "2"}
                  </span>
                  <span>KODE OTP</span>
                </div>
                <span className="text-zinc-700">──</span>
                <div className={`flex items-center gap-1.5 ${forgotStep === "NEW_PASSWORD" ? "text-orange-500 font-bold" : "text-zinc-500"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${forgotStep === "NEW_PASSWORD" ? "bg-orange-600 text-white" : "bg-white/10 text-zinc-400"}`}>
                    3
                  </span>
                  <span>SANDI BARU</span>
                </div>
              </div>

              {/* STEP 1: INPUT EMAIL */}
              {forgotStep === "EMAIL" && (
                <form onSubmit={handleRequestOtp} noValidate className="space-y-6 pt-1">
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-mono font-semibold tracking-[0.2em] text-[#888888] uppercase px-1">
                      EMAIL ADMINISTRATOR TERDAFTAR <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoFocus
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
                    className="w-full mt-4 py-4 px-6 bg-[#F24E1E] hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
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

              {/* STEP 2: VERIFIKASI KODE OTP */}
              {forgotStep === "OTP" && (
                <form onSubmit={handleVerifyOtp} noValidate className="space-y-6 pt-1">
                  <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-[#2E2E2E] text-[11px] font-mono">
                    <div className="truncate pr-2">
                      <span className="text-[#888888]">Terkirim ke: </span>
                      <span className="text-white font-semibold">{forgotEmail}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep("EMAIL");
                        setErrorMessage(null);
                        setSuccessMessage(null);
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
                    className="w-full mt-4 py-4 px-6 bg-[#F24E1E] hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
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

              {/* STEP 3: KATA SANDI BARU (Hanya muncul setelah OTP terverifikasi) */}
              {forgotStep === "NEW_PASSWORD" && (
                <form onSubmit={handleResetSubmit} noValidate className="space-y-6 pt-1">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kode valid! Masukkan kata sandi baru untuk akun {forgotEmail}.</span>
                  </div>

                  <div className="space-y-2.5">
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
                        className="w-full bg-white/[0.02] border-b border-[#333333] focus:border-orange-600 text-white font-sans text-xs sm:text-sm px-3.5 pr-10 py-3 outline-none [color-scheme:dark]"
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

                  <div className="space-y-2.5">
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
                        className="w-full bg-white/[0.02] border-b border-[#333333] focus:border-orange-600 text-white font-sans text-xs sm:text-sm px-3.5 pr-10 py-3 outline-none [color-scheme:dark]"
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

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full mt-4 py-4 px-6 bg-[#F24E1E] hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>MENYIMPAN KATA SANDI...</span>
                      </>
                    ) : (
                      <span>SIMPAN KATA SANDI BARU</span>
                    )}
                  </button>
                </form>
              )}

              {/* Back to Login Link */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setForgotStep("EMAIL");
                    setMode("LOGIN");
                  }}
                  className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Kembali ke Form Masuk
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back Link Outside Card */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-[11px] font-mono text-[#888888] hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            <span>KEMBALI KE WEBSITE UTAMA</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
