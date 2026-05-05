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

export default function ThuongMaiPage() {
  const { locale } = useLocale();
  const t = getT(locale);

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
    { id: "",          label: "Tất cả", icon: "🏢" },
    { id: "van-phong", label: "Văn phòng", icon: "🏗️" },
    { id: "mat-bang",  label: "Mặt bằng", icon: "🏪" },
    { id: "kho-xuong", label: "Kho, xưởng", icon: "🏭" },
    { id: "khach-san", label: "Khách sạn", icon: "🏨" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">🏢 {t.nav.thuongMai}</h1>
        <p className="text-gray-500 mt-1">Văn phòng, mặt bằng, kho xưởng, khách sạn</p>
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
          <span>Đang tải bất động sản thương mại...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🏢</div>
          <p>Chưa có bất động sản thương mại</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}
