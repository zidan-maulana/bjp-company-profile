"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, Translations, translations } from "@/lib/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "bjp_preferred_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (savedLang && (savedLang === "id" || savedLang === "en")) {
        setLocaleState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {
      // localStorage may be unavailable in private browsing
    }
    setIsInitialized(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
    }
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // ignore storage error
    }
  };

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: translations[locale] || translations.id,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
