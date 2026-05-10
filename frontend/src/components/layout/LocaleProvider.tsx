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
    let next: Locale;
    if (stored === "vi" || stored === "en" || stored === "zh") {
      next = stored;
    } else {
      next = pathname?.startsWith("/admin") ? "en" : "vi";
      localStorage.setItem("vr_locale", next);
    }
    setLocaleState(next);
    // Keep <html lang> in sync for SEO (Google reads this signal)
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("vr_locale", l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
