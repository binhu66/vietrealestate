"use client";
import { createContext, useContext } from "react";
import type { Locale } from "@/i18n";

export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "vi", setLocale: () => {} });

export const useLocale = () => useContext(LocaleContext);
