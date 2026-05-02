"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, ChevronDown, MapPin } from "lucide-react";
import { Suspense } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import { properties, categories, cities, type Category, type PropertyType } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import SearchBar from "@/components/property/SearchBar";

function ListingsContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = getT(locale);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    type: (searchParams.get("type") || "") as PropertyType | "",
    category: (searchParams.get("category") || "") as Category | "",
    city: searchParams.get("city") || "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    bedrooms: "",
  });

  const q = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    let result = [...properties];
    if (filters.type) result = result.filter(p => p.type === filters.type);
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.city) result = result.filter(p => p.city === filters.city);
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.minArea) result = result.filter(p => p.area >= Number(filters.minArea));
    if (filters.maxArea) result = result.filter(p => p.area <= Number(filters.maxArea));
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        p.address.toLowerCase().includes(lower) ||
        p.district.toLowerCase().includes(lower)
      );
    }
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "area_desc") result.sort((a, b) => b.area - a.area);
    return result;
  }, [filters, q, sortBy]);

  function updateFilter(key: string, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  const priceRanges = [
    { label: "Dưới 1 tỷ", min: 0, max: 1 },
    { label: "1 - 3 tỷ", min: 1, max: 3 },
    { label: "3 - 5 tỷ", min: 3, max: 5 },
    { label: "5 - 10 tỷ", min: 5, max: 10 },
    { label: "Trên 10 tỷ", min: 10, max: 9999 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex gap-6">
        {/* Sidebar filter */}
        <aside className={`${showFilter ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> {t.filter.title}
            </h3>

            {/* Type */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Loại giao dịch</label>
              <div className="flex gap-2">
                {[{ v: "", l: "Tất cả" }, { v: "ban", l: "Bán" }, { v: "thue", l: "Cho thuê" }].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => updateFilter("type", opt.v)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${filters.type === opt.v ? "bg-red-600 text-white border-red-600" : "border-gray-200 text-gray-600 hover:border-red-400"}`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.city}</label>
              <select
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Tất cả tỉnh/thành</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.category}</label>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter("category", "")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${!filters.category ? "bg-red-50 text-red-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Tất cả loại
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter("category", cat.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${filters.category === cat.id ? "bg-red-50 text-red-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{locale === "en" ? cat.labelEn : locale === "zh" ? cat.labelZh : cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.priceRange}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Area range */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.areaRange} (m²)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minArea}
                  onChange={(e) => updateFilter("minArea", e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxArea}
                  onChange={(e) => updateFilter("maxArea", e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              onClick={() => setFilters({ type: "", category: "", city: "", minPrice: "", maxPrice: "", minArea: "", maxArea: "", bedrooms: "" })}
              className="w-full border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.filter.reset}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="md:hidden flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
              </button>
              <span className="text-sm text-gray-600">
                <strong className="text-gray-900">{filtered.length}</strong> tin đăng
                {q && <span> cho "<em>{q}</em>"</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="area_desc">Diện tích lớn nhất</option>
              </select>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">🏚️</div>
              <p className="font-medium">Không tìm thấy bất động sản phù hợp</p>
              <p className="text-sm mt-1">Hãy thử thay đổi bộ lọc</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
              {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
