"use client";

import { createContext, useContext } from "react";

export interface AdminUser {
  name?: string;
  email?: string;
  role?: string;
}

export interface AdminLayoutContextType {
  user: AdminUser | null;
  openChangePassword: () => void;
  handleLogout: () => void;
  isLoggingOut: boolean;
}

export const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminLayoutProvider");
  }
  return context;
}
