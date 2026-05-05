"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, Loader2, X, ChevronDown } from "lucide-react";
import { Suspense } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import { properties, categories, cities, type Category, type PropertyType } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import SearchBar from "@/components/property/SearchBar";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import type { Property } from "@/lib/data";

const PAGE_SIZE = 24;

function ListingsContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = getT(locale);

  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy]       = useState("newest");
  const [filters, setFilters]     = useState({
    type:     (searchParams.get("type") || "") as PropertyType | "",
    category: (searchParams.get("category") || "") as Category | "",
    city:     searchParams.get("city") || "",
    minPrice: "",
    maxPrice: "",
    minArea:  "",
    maxArea:  "",
    bedrooms: "",
  });

  const [listings, setListings]       = useState<Property[]>(properties);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fromSupabase, setFromSupabase] = useState(false);
  const [page, setPage]               = useState(0);
  const [hasMore, setHasMore]         = useState(true);
  const [totalCount, setTotalCount]   = useState<number | null>(null);

  const q = searchParams.get("q") || "";

  const fetchListings = useCallback(async (pageNum: number, replace: boolean) => {
    if (replace) setLoading(true); else setLoadingMore(true);
    try {
      let query = supabase
        .from("listings")
        .select(LISTING_SELECT, { count: "exact" })
        .eq("standard_status", "Active")
        .order("vip_level", { ascending: false })
        .order("original_entry_timestamp", { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      // Apply server-side filters when possible
      if (filters.type === "ban")  query = query.eq("transaction_type", "For Sale");
      if (filters.type === "thue") query = query.eq("transaction_type", "For Rent");
      if (filters.city) query = query.eq("tinh_thanh", filters.city);
      if (q) query = query.textSearch("search_vector", q, { type: "websearch", config: "simple" });

      const { data, error, count } = await query;
      if (!error && data) {
        const mapped = (data as unknown as DbListing[]).map(dbToProperty);
        if (replace) {
          setListings(mapped);
        } else {
          setListings(prev => [...prev, ...mapped]);
        }
        setFromSupabase(true);
        if (count !== null) setTotalCount(count);
        setHasMore(data.length === PAGE_SIZE);
        setPage(pageNum);
      }
    } catch {
      // keep fallback
    } finally {
      if (replace) setLoading(false); else setLoadingMore(false);
    }
  }, [filters.type, filters.city, q]);

  useEffect(() => {
    fetchListings(0, true);
  }, [fetchListings]);

  // Client-side filters (category, price, area — applied after server fetch)
  const filtered = useMemo(() => {
    let result = [...listings];
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.minPrice) {
      const min = Number(filters.minPrice);
      result = result.filter(p => {
        const vnd = p.priceUnit === "ty" ? p.price * 1e9 : p.price * 1e6;
        return vnd >= min * 1e9;
      });
    }
    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      result = result.filter(p => {
        const vnd = p.priceUnit === "ty" ? p.price * 1e9 : p.price * 1e6;
        return vnd <= max * 1e9;
      });
    }
    if (filters.minArea) result = result.filter(p => p.area >= Number(filters.minArea));
    if (filters.maxArea) result = result.filter(p => p.area <= Number(filters.maxArea));
    if (sortBy === "price_asc")  result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "area_desc")  result.sort((a, b) => b.area - a.area);
    return result;
  }, [listings, filters, sortBy]);

  const availableCities = useMemo(() => {
    if (fromSupabase) {
      const set = new Set(listings.map(p => p.city));
      return Array.from(set).sort();
    }
    return cities;
  }, [listings, fromSupabase]);

  function updateFilter(key: string, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({ type: "", category: "", city: "", minPrice: "", maxPrice: "", minArea: "", maxArea: "", bedrooms: "" });
  }

  const FilterPanel = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" /> {t.filter.title}
      </h3>

      {/* Type */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Loại giao dịch</label>
        <div className="flex gap-2">
          {[{ v: "", l: "Tất cả" }, { v: "ban", l: "Bán" }, { v: "thue", l: "Thuê" }].map(opt => (
            <button key={opt.v} onClick={() => updateFilter("type", opt.v)}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${filters.type === opt.v ? "bg-red-600 text-white border-red-600" : "border-gray-200 text-gray-600 hover:border-red-400"}`}
            >{opt.l}</button>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.city}</label>
        <select value={filters.city} onChange={e => updateFilter("city", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
        >
          <option value="">Tất cả tỉnh/thành</option>
          {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.category}</label>
        <div className="space-y-1">
          <button onClick={() => updateFilter("category", "")}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${!filters.category ? "bg-red-50 text-red-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
          >Tất cả loại</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => updateFilter("category", cat.id)}
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
        <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.priceRange} (tỷ)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Từ" value={filters.minPrice} onChange={e => updateFilter("minPrice", e.target.value)}
            className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input type="number" placeholder="Đến" value={filters.maxPrice} onChange={e => updateFilter("maxPrice", e.target.value)}
            className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Area range */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t.filter.areaRange} (m²)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Từ" value={filters.minArea} onChange={e => updateFilter("minArea", e.target.value)}
            className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input type="number" placeholder="Đến" value={filters.maxArea} onChange={e => updateFilter("maxArea", e.target.value)}
            className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <button onClick={resetFilters}
        className="w-full border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >{t.filter.reset}</button>
    </div>
  );

  const activeFilterCount = [filters.type, filters.category, filters.city, filters.minPrice, filters.maxPrice, filters.minArea, filters.maxArea].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <FilterPanel />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <button onClick={() => setShowFilter(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 relative"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                <strong className="text-gray-900">{totalCount !== null ? totalCount.toLocaleString() : filtered.length}</strong> tin đăng
                {q && <span> · &ldquo;<em>{q}</em>&rdquo;</span>}
                {fromSupabase && <span className="text-xs text-green-600 ml-1">● live</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="area_desc">Diện tích lớn nhất</option>
              </select>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                ><Grid3X3 className="w-4 h-4" /></button>
                <button onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                ><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <span>Đang tải danh sách...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">🏚️</div>
              <p className="font-medium">Không tìm thấy bất động sản phù hợp</p>
              <p className="text-sm mt-1">Hãy thử thay đổi bộ lọc</p>
            </div>
          ) : (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                {filtered.map(p => <PropertyCard key={p.id} property={p} viewMode={viewMode} />)}
              </div>

              {/* Load more */}
              {hasMore && fromSupabase && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => fetchListings(page + 1, false)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60 shadow-sm"
                  >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                    {loadingMore ? "Đang tải..." : "Xem thêm tin đăng"}
                  </button>
                  {totalCount && (
                    <p className="text-xs text-gray-400 mt-2">
                      Đang hiển thị {listings.length.toLocaleString()} / {totalCount.toLocaleString()} tin
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Bộ lọc tìm kiếm
              </h3>
              <button onClick={() => setShowFilter(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel />
              <button onClick={() => setShowFilter(false)}
                className="w-full mt-4 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors"
              >
                Áp dụng ({filtered.length} kết quả)
              </button>
            </div>
          </div>
        </div>
      )}
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
