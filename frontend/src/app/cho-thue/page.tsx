"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/property/PropertyCard";
import SearchBar from "@/components/property/SearchBar";
import { properties } from "@/lib/data";
import type { Property } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import { Loader2, LayoutGrid, List } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

function ChoThueContent() {
  const { locale } = useLocale();
  const t = getT(locale);
  const searchParams = useSearchParams();
  const q        = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const city     = searchParams.get("city") || "";

  const [listings, setListings] = useState<Property[]>(
    properties.filter(p => p.type === "thue")
  );
  const [loading, setLoading]   = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("standard_status", "Active")
        .eq("transaction_type", "For Rent")
        .order("vip_level", { ascending: false })
        .order("original_entry_timestamp", { ascending: false })
        .limit(120);

      if (category) query = query.eq("category", category);
      if (city)     query = query.eq("tinh_thanh", city);
      if (q)        query = query.textSearch("search_vector", q, { type: "websearch", config: "simple" });

      const { data, error } = await query;
      if (!error && data && data.length > 0)
        setListings((data as unknown as DbListing[]).map(dbToProperty));
      else if (!error && data?.length === 0)
        setListings([]);
      setLoading(false);
    }
    fetchListings();
  }, [q, category, city]);

  // Client-side fallback filter for static data
  let filtered = listings;
  if (!loading && listings === properties.filter(p => p.type === "thue")) {
    if (category) filtered = filtered.filter(p => p.category === category);
    if (city)     filtered = filtered.filter(p => p.city === city);
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(lower) || p.address.toLowerCase().includes(lower)
      );
    }
  }

  const SUB_CATS = [
    { id: "can-ho-chung-cu", label: t.rentPage.apartment, icon: "🏢" },
    { id: "nha-rieng",       label: t.rentPage.house,     icon: "🏠" },
    { id: "van-phong",       label: t.rentPage.office,    icon: "🏗️" },
    { id: "mat-bang",        label: t.rentPage.retail,    icon: "🏪" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar defaultTab="thue" />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.rentPage.heading}</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            {loading
              ? <><Loader2 className="w-3 h-3 animate-spin" /> {t.rentPage.loading}</>
              : <><strong className="text-gray-800">{filtered.length}</strong> {t.rentPage.matchingListings}</>
            }
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}
            title={t.rentPage.gridView}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}
            title={t.rentPage.listView}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-category quick links */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/cho-thue"
          className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm transition-colors hover:border-blue-400 hover:text-blue-700 ${!category ? "border-blue-500 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-700"}`}
        >
          {t.rentPage.all}
        </a>
        {SUB_CATS.map(cat => (
          <a
            key={cat.id}
            href={`/cho-thue?category=${cat.id}`}
            className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm transition-colors hover:border-blue-400 hover:text-blue-700 ${category === cat.id ? "border-blue-500 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-700"}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </a>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin mr-3" />
          <span>{t.rentPage.loadingListings}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🔑</div>
          <p className="font-medium">{t.rentPage.noResults}</p>
          <a href="/cho-thue" className="mt-3 inline-block text-blue-600 hover:underline text-sm">{t.rentPage.viewAllRent}</a>
        </div>
      ) : (
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-3"
        }>
          {filtered.map(p => <PropertyCard key={p.id} property={p} viewMode={viewMode} />)}
        </div>
      )}
    </div>
  );
}

export default function ChoThuePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
      <ChoThueContent />
    </Suspense>
  );
}
