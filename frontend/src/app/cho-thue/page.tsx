"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/property/PropertyCard";
import SearchBar from "@/components/property/SearchBar";
import { properties } from "@/lib/data";

function ChoThueContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";

  let filtered = properties.filter((p) => p.type === "thue");
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (city) filtered = filtered.filter((p) => p.city === city);
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(lower) || p.address.toLowerCase().includes(lower)
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar defaultTab="thue" />
      </div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">🔑 Cho thuê bất động sản</h1>
        <p className="text-gray-500 mt-1">{filtered.length} tin đăng phù hợp</p>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🔑</div>
          <p>Không tìm thấy bất động sản cho thuê phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
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
