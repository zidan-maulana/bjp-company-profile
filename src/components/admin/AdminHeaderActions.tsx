"use client";

import Link from "next/link";
import { KeyRound, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { useAdminLayout } from "./AdminLayoutContext";

export default function AdminHeaderActions() {
  const { openChangePassword } = useAdminLayout();

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-nowrap">
      {/* 1. Change Password Button */}
      <button
        type="button"
        onClick={openChangePassword}
        title="Ganti Kata Sandi Administrator"
        className="h-10 px-3.5 inline-flex items-center justify-center gap-2 border border-[#2B2B2B] hover:border-orange-500/50 bg-[#1A1A1A] hover:bg-orange-950/30 text-xs font-mono text-zinc-300 hover:text-orange-400 transition-colors whitespace-nowrap cursor-pointer shrink-0"
      >
        <KeyRound className="w-3.5 h-3.5 text-orange-500 shrink-0" />
        <span>Ganti Sandi</span>
      </button>

      {/* 2. Public Website Link Button */}
      <Link
        href="/"
        target="_blank"
        className="h-10 px-3.5 inline-flex items-center justify-center gap-2 border border-[#2B2B2B] hover:border-[#444444] bg-[#1A1A1A] hover:bg-[#222222] text-xs font-mono text-zinc-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
      >
        <ExternalLink className="w-3.5 h-3.5 text-orange-400 shrink-0" />
        <span>Website Publik</span>
      </Link>
    </div>
  );
}
