"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { cities, categories } from "@/lib/data";

const RESIDENTIAL_IDS = ["can-ho-chung-cu", "nha-rieng", "nha-biet-thu", "dat-nen"];
const COMMERCIAL_IDS = ["van-phong", "mat-bang", "kho-xuong", "khach-san"];

type Tab = "ban" | "thue" | "thuong-mai";

export default function SearchBar({ defaultTab = "ban" }: { defaultTab?: Tab }) {
  const { locale } = useLocale();
  const t = getT(locale);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const isCommercial = tab === "thuong-mai";
  const visibleCategories = categories.filter((c) =>
    isCommercial ? COMMERCIAL_IDS.includes(c.id) : RESIDENTIAL_IDS.includes(c.id)
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (isCommercial) {
      if (category) params.set("category", category);
      router.push(`/thuong-mai?${params.toString()}`);
      return;
    }
    params.set("type", tab);
    if (category) params.set("category", category);
    router.push(`/bat-dong-san?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-4xl mx-auto">
      {/* Tabs — two groups with divider */}
      <div className="flex items-center gap-1 mb-4">
        {/* Residential group */}
        <button
          onClick={() => { setTab("ban"); setCategory(""); }}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${tab === "ban" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {t.hero.tabMua}
        </button>
        <button
          onClick={() => { setTab("thue"); setCategory(""); }}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${tab === "thue" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {t.hero.tabThue}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Commercial group */}
        <button
          onClick={() => { setTab("thuong-mai"); setCategory(""); }}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${tab === "thuong-mai" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          🏢 {t.hero.tabThuongMai}
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.hero.placeholder}
            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* City select */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white min-w-[160px]"
        >
          <option value="">{t.hero.allCities}</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Category select — changes based on tab */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white min-w-[160px]"
        >
          <option value="">{t.hero.allCategories}</option>
          {visibleCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "en" ? c.labelEn : locale === "zh" ? c.labelZh : c.label}
            </option>
          ))}
        </select>

        {/* Search button */}
        <button
          type="submit"
          className={`text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${isCommercial ? "bg-amber-600 hover:bg-amber-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          <Search className="w-4 h-4" />
          {t.hero.btnSearch}
        </button>
      </form>
    </div>
  );
}
