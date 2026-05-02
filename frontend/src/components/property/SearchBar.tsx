"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { cities, categories } from "@/lib/data";

export default function SearchBar({ defaultTab = "ban" }: { defaultTab?: "ban" | "thue" }) {
  const { locale } = useLocale();
  const t = getT(locale);
  const router = useRouter();
  const [tab, setTab] = useState<"ban" | "thue">(defaultTab);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tab) params.set("type", tab);
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    router.push(`/bat-dong-san?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {[
          { id: "ban" as const, label: t.hero.tabMua, color: "bg-red-600 text-white" },
          { id: "thue" as const, label: t.hero.tabThue, color: "bg-blue-600 text-white" },
        ].map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${tab === id ? color : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {label}
          </button>
        ))}
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

        {/* Category select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white min-w-[160px]"
        >
          <option value="">{t.hero.allCategories}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        {/* Search button */}
        <button
          type="submit"
          className="bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          {t.hero.btnSearch}
        </button>
      </form>
    </div>
  );
}
