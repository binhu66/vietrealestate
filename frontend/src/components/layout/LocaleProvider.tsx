"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LocaleContext } from "@/lib/locale";
import type { Locale } from "@/i18n";

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [locale, setLocaleState] = useState<Locale>(() => {
    // SSR: return default synchronously
    return isAdmin ? "en" : "vi";
  });

  useEffect(() => {
    const stored = localStorage.getItem("vr_locale") as Locale | null;
    if (stored === "vi" || stored === "en" || stored === "zh") {
      setLocaleState(stored);
    } else {
      // First visit: admin defaults to en, frontend to vi
      const defaultLocale: Locale = pathname?.startsWith("/admin") ? "en" : "vi";
      setLocaleState(defaultLocale);
      localStorage.setItem("vr_locale", defaultLocale);
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("vr_locale", l);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
