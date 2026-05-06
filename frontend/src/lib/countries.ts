"use client";
/**
 * Country / market registry for the SEA expansion roadmap.
 *
 * Vietnam is the only LIVE market today; all others are placeholders that
 * land on a "Coming soon" notice. To enable a new country:
 *   1. Set its `live: true`
 *   2. Add corresponding listings + agents data + locale fallbacks
 *   3. Update the homepage and search filters to use the active country
 */

import { useEffect, useState, useCallback } from "react";

export type CountryCode = "vn" | "sg" | "my" | "th" | "id" | "ph" | "kh" | "la";

export interface Country {
  code: CountryCode;
  flag: string;
  /** Display name keyed by locale; falls back to `en`. */
  name: Record<"vi" | "en" | "zh", string>;
  /** Currency ISO code (display + future conversion). */
  currency: string;
  /** Whether listings/agents/news are populated. */
  live: boolean;
  /** Optional override for the production hostname per market. */
  host?: string;
}

export const COUNTRIES: readonly Country[] = [
  {
    code: "vn",
    flag: "🇻🇳",
    name: { vi: "Việt Nam", en: "Vietnam", zh: "越南" },
    currency: "VND",
    live: true,
    host: "binhorizon.com",
  },
  {
    code: "sg",
    flag: "🇸🇬",
    name: { vi: "Singapore", en: "Singapore", zh: "新加坡" },
    currency: "SGD",
    live: false,
  },
  {
    code: "my",
    flag: "🇲🇾",
    name: { vi: "Malaysia", en: "Malaysia", zh: "马来西亚" },
    currency: "MYR",
    live: false,
  },
  {
    code: "th",
    flag: "🇹🇭",
    name: { vi: "Thái Lan", en: "Thailand", zh: "泰国" },
    currency: "THB",
    live: false,
  },
  {
    code: "id",
    flag: "🇮🇩",
    name: { vi: "Indonesia", en: "Indonesia", zh: "印度尼西亚" },
    currency: "IDR",
    live: false,
  },
  {
    code: "ph",
    flag: "🇵🇭",
    name: { vi: "Philippines", en: "Philippines", zh: "菲律宾" },
    currency: "PHP",
    live: false,
  },
  {
    code: "kh",
    flag: "🇰🇭",
    name: { vi: "Campuchia", en: "Cambodia", zh: "柬埔寨" },
    currency: "USD",
    live: false,
  },
  {
    code: "la",
    flag: "🇱🇦",
    name: { vi: "Lào", en: "Laos", zh: "老挝" },
    currency: "LAK",
    live: false,
  },
] as const;

const STORAGE_KEY = "binhorizon.country";

/** Persisted country selection. Defaults to `vn` (the only live market). */
export function useCountry() {
  const [country, setCountryState] = useState<CountryCode>("vn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CountryCode | null;
      if (saved && COUNTRIES.some((c) => c.code === saved && c.live)) {
        setCountryState(saved);
      }
    } catch {
      /* SSR / privacy mode */
    }
  }, []);

  const setCountry = useCallback((code: CountryCode) => {
    setCountryState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  return { country, setCountry };
}

export function getCountry(code: CountryCode): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}
