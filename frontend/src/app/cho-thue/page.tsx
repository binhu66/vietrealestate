"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/property/PropertyCard";
import SearchBar from "@/components/property/SearchBar";
import { properties } from "@/lib/data";
import type { Property } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import { Loader2 } from "lucide-react";

function ChoThueContent() {
  const searchParams = useSearchParams();
  const q        = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const city     = searchParams.get("city") || "";

  const [listings, setListings] = useState<Property[]>(
    properties.filter(p => p.type === "thue")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("standard_status", "Active")
        .eq("transaction_type", "For Rent")
        .order("vip_level", { ascending: false })
        .order("original_entry_timestamp", { ascending: false })
        .limit(120);

      const { data, error } = await query;
      if (!error && data && data.length > 0)
        setListings((data as unknown as DbListing[]).map(dbToProperty));
      setLoading(false);
    }
    fetch();
  }, []);

  let filtered = listings;
  if (category) filtered = filtered.filter(p => p.category === category);
  if (city)     filtered = filtered.filter(p => p.city === city);
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(lower) || p.address.toLowerCase().includes(lower)
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar defaultTab="thue" />
      </div>
      <div className="mb-4 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔑 Cho thuê bất động sản</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            {loading
              ? <><Loader2 className="w-3 h-3 animate-spin" /> Đang tải...</>
              : <><strong className="text-gray-800">{filtered.length}</strong> tin đăng phù hợp</>
            }
          </p>
        </div>
      </div>

      {/* Sub-category quick links */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "can-ho-chung-cu", label: "Căn hộ", icon: "🏢" },
          { id: "nha-rieng",       label: "Nhà riêng", icon: "🏠" },
          { id: "van-phong",       label: "Văn phòng", icon: "🏗️" },
          { id: "mat-bang",        label: "Mặt bằng", icon: "🏪" },
        ].map(cat => {
          const cnt = listings.filter(p => p.category === cat.id).length;
          return (
            <a
              key={cat.id}
              href={`/cho-thue?category=${cat.id}`}
              className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm transition-colors hover:border-blue-400 hover:text-blue-700 ${category === cat.id ? "border-blue-500 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-700"}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {cnt > 0 && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{cnt}</span>}
            </a>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin mr-3" />
          <span>Đang tải tin cho thuê...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🔑</div>
          <p>Không tìm thấy bất động sản cho thuê phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
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
