import vi from "./vi";
import en from "./en";
import zh from "./zh";

export type Locale = "vi" | "en" | "zh";

const translations = { vi, en, zh };

export function getT(locale: Locale) {
  return translations[locale] ?? translations.vi;
}

export { vi, en, zh };
