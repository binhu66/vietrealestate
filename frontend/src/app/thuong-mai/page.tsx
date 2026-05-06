"use client";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import SearchBar from "@/components/property/SearchBar";
import { properties } from "@/lib/data";
import type { Property } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import { Loader2 } from "lucide-react";

const COMMERCIAL_CATEGORIES = ["van-phong", "mat-bang", "kho-xuong", "khach-san"];

const COMMERCIAL_TYPE_MAP: Record<string, string> = {
  "van-phong": "office",
  "mat-bang":  "commercial",
  "kho-xuong": "warehouse",
  "khach-san": "other",
};

const PAGE_T = {
  vi: {
    all: "Tất cả", office: "Văn phòng", retail: "Mặt bằng", warehouse: "Kho, xưởng", hotel: "Khách sạn",
    sub: "Văn phòng, mặt bằng, kho xưởng, khách sạn",
    loading: "Đang tải bất động sản thương mại...",
    empty: "Chưa có bất động sản thương mại",
  },
  en: {
    all: "All", office: "Office", retail: "Retail Space", warehouse: "Warehouse", hotel: "Hotel",
    sub: "Offices, retail spaces, warehouses, hotels",
    loading: "Loading commercial properties...",
    empty: "No commercial properties yet",
  },
  zh: {
    all: "全部", office: "办公室", retail: "店面", warehouse: "仓库厂房", hotel: "酒店",
    sub: "办公室、店面、仓库厂房、酒店",
    loading: "加载商业地产中...",
    empty: "暂无商业地产",
  },
};

export default function ThuongMaiPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const L = PAGE_T[locale] ?? PAGE_T.vi;

  const [listings, setListings] = useState<Property[]>(
    properties.filter(p => COMMERCIAL_CATEGORIES.includes(p.category))
  );
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("standard_status", "Active")
        .in("property_type", ["office", "commercial", "warehouse", "other"])
        .order("vip_level", { ascending: false })
        .order("original_entry_timestamp", { ascending: false })
        .limit(120);

      if (!error && data && data.length > 0)
        setListings((data as unknown as DbListing[]).map(dbToProperty));
      setLoading(false);
    }
    fetch();
  }, []);

  const filtered = activeTab
    ? listings.filter(p => p.category === activeTab)
    : listings;

  const tabs = [
    { id: "",          label: L.all,       icon: "🏢" },
    { id: "van-phong", label: L.office,    icon: "🏗️" },
    { id: "mat-bang",  label: L.retail,    icon: "🏪" },
    { id: "kho-xuong", label: L.warehouse, icon: "🏭" },
    { id: "khach-san", label: L.hotel,     icon: "🏨" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">🏢 {t.nav.thuongMai}</h1>
        <p className="text-gray-500 mt-1">{L.sub}</p>
      </div>

      {/* Sub-category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(cat => {
          const cnt = cat.id ? listings.filter(p => p.category === cat.id).length : listings.length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-colors ${activeTab === cat.id ? "border-amber-500 bg-amber-50 text-amber-700 font-semibold" : "bg-white border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-700"}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{cnt}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin mr-3" />
          <span>{L.loading}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🏢</div>
          <p>{L.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}
