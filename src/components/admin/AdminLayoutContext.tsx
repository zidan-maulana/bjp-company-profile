"use client";

import { createContext, useContext } from "react";

export interface AdminUser {
  name?: string;
  email?: string;
  role?: string;
}

export interface ToastOptions {
  title?: string;
  isError?: boolean;
  type?: "success" | "error" | "info";
  duration?: number;
}

export interface AdminLayoutContextType {
  user: AdminUser | null;
  openChangePassword: () => void;
  handleLogout: () => void;
  isLoggingOut: boolean;
  showToast: (text: string, options?: ToastOptions) => void;
}

export const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminLayoutProvider");
  }
  return context;
}
