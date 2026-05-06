"use client";
import dynamic from "next/dynamic";
import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { properties, formatPrice, categories } from "@/lib/data";
import type { Property } from "@/lib/data";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronDown, MapPin } from "lucide-react";
import MapFilterModal, { type MapFilters, EMPTY_FILTERS } from "@/components/map/MapFilterModal";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), { ssr: false });

const COMMERCIAL_IDS = ["van-phong", "mat-bang", "kho-xuong", "khach-san"];

type ListingTab = "ban" | "thue" | "thuong-mai";

function priceInTy(p: Property): number {
  if (p.priceUnit === "ty")           return p.price;
  if (p.priceUnit === "trieu")        return p.price / 1000;
  if (p.priceUnit === "trieu/thang")  return p.price / 1000;
  return p.price / 1_000_000;
}

function countActiveFilters(f: MapFilters): number {
  let n = 0;
  if (f.priceMin !== undefined || f.priceMax !== undefined) n++;
  if (f.categoryIds.length > 0) n++;
  if (f.bedroomsMin !== undefined) n++;
  if (f.areaMin !== undefined || f.areaMax !== undefined) n++;
  return n;
}

function MapContent() {
  const { locale } = useLocale();
  const t = getT(locale);
  const searchParams = useSearchParams();
  const focusLat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
  const focusLng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
  const focusId  = searchParams.get("id") ?? undefined;

  const [tab, setTab]                     = useState<ListingTab>("ban");
  const [filters, setFilters]             = useState<MapFilters>(EMPTY_FILTERS);
  const [modalOpen, setModalOpen]         = useState(false);
  const [sortOpen, setSortOpen]           = useState(false);
  const [sort, setSort]                   = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [polygonIds, setPolygonIds]       = useState<string[] | null>(null);
  const [allListings, setAllListings]     = useState<Property[]>(properties);

  // Fetch all active listings from Supabase (with coords for map)
  useEffect(() => {
    async function fetchAll() {
      const { data, error } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("standard_status", "Active")
        .not("lat", "is", null)
        .order("vip_level", { ascending: false })
        .order("original_entry_timestamp", { ascending: false })
        .limit(500);

      if (!error && data && data.length > 0) {
        setAllListings((data as unknown as DbListing[]).map(dbToProperty));
      }
    }
    fetchAll();
  }, []);

  // ── Active filter chips ──────────────────────────────────────────────────
  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const min = filters.priceMin ?? 0;
    const max = filters.priceMax;
    activeChips.push({
      label: max && max < 9999 ? `${min}–${max} tỷ` : `≥${min} tỷ`,
      clear: () => setFilters(f => ({ ...f, priceMin: undefined, priceMax: undefined })),
    });
  }
  filters.categoryIds.forEach(id => {
    const cat = categories.find(c => c.id === id);
    if (cat) activeChips.push({
      label: cat.label,
      clear: () => setFilters(f => ({ ...f, categoryIds: f.categoryIds.filter(x => x !== id) })),
    });
  });
  if (filters.bedroomsMin !== undefined) {
    activeChips.push({
      label: `${filters.bedroomsMin}+ PN`,
      clear: () => setFilters(f => ({ ...f, bedroomsMin: undefined })),
    });
  }
  if (filters.areaMin !== undefined || filters.areaMax !== undefined) {
    const min = filters.areaMin ?? 0;
    const max = filters.areaMax;
    activeChips.push({
      label: max && max < 9999 ? `${min}–${max} m²` : `≥${min} m²`,
      clear: () => setFilters(f => ({ ...f, areaMin: undefined, areaMax: undefined })),
    });
  }

  // ── Filter + sort logic ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allListings.filter(p => {
      if (tab === "ban" && p.type !== "ban") return false;
      if (tab === "thue" && p.type !== "thue") return false;
      if (tab === "thuong-mai" && !COMMERCIAL_IDS.includes(p.category)) return false;

      if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(p.category)) return false;

      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        const pt = priceInTy(p);
        if (filters.priceMin !== undefined && pt < filters.priceMin) return false;
        if (filters.priceMax !== undefined && filters.priceMax < 9999 && pt > filters.priceMax) return false;
      }

      if (filters.bedroomsMin !== undefined && (p.bedrooms ?? 0) < filters.bedroomsMin) return false;

      if (filters.areaMin !== undefined && p.area < filters.areaMin) return false;
      if (filters.areaMax !== undefined && filters.areaMax < 9999 && p.area > filters.areaMax) return false;

      return true;
    });

    if (polygonIds !== null) list = list.filter(p => polygonIds.includes(p.id));

    if (sort === "price_asc")  list = [...list].sort((a, b) => priceInTy(a) - priceInTy(b));
    if (sort === "price_desc") list = [...list].sort((a, b) => priceInTy(b) - priceInTy(a));
    return list;
  }, [allListings, tab, filters, sort, polygonIds]);

  const mapFiltered = filtered.filter(p => p.lat && p.lng);

  const TABS: { id: ListingTab; label: string; color: string; active: string }[] = [
    { id: "ban",       label: t.map.tabSale,       color: "text-gray-600 hover:text-red-600",   active: "text-red-600 border-b-2 border-red-600" },
    { id: "thue",      label: t.map.tabRent,       color: "text-gray-600 hover:text-blue-600",  active: "text-blue-600 border-b-2 border-blue-600" },
    { id: "thuong-mai",label: t.map.tabCommercial, color: "text-gray-600 hover:text-amber-600", active: "text-amber-600 border-b-2 border-amber-600" },
  ];

  const SORT_LABELS = { newest: t.map.sortNewest, price_asc: t.map.sortPriceAsc, price_desc: t.map.sortPriceDesc };

  return (
    <div className="flex h-[calc(100vh-5.75rem)] -mb-14 sm:mb-0">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden hidden md:flex">

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setFilters(EMPTY_FILTERS); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === t.id ? t.active : t.color}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Count + polygon indicator */}
        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center gap-2">
          <span>
            <span className="font-semibold text-gray-800">{filtered.length}</span> {t.map.listings}
          </span>
          {polygonIds !== null && (
            <span className="flex items-center gap-1 ml-auto px-2 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-200 font-medium">
              ✏️ {t.map.inDrawArea}
              <button onClick={() => setPolygonIds(null)} className="ml-1 hover:text-red-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Filter bar */}
        <div className="px-3 py-2 border-b border-gray-100 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${countActiveFilters(filters) > 0 ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t.map.filter}
              {countActiveFilters(filters) > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                  {countActiveFilters(filters)}
                </span>
              )}
            </button>

            <div className="relative ml-auto">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-300 transition-colors"
              >
                {SORT_LABELS[sort]}
                <ChevronDown className="w-3 h-3" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  {(Object.entries(SORT_LABELS) as [typeof sort, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setSortOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors ${sort === key ? "bg-red-50 text-red-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {activeChips.map(chip => (
                <span key={chip.label} className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200">
                  {chip.label}
                  <button onClick={chip.clear} className="ml-0.5 hover:text-red-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="px-2 py-0.5 text-xs text-gray-500 hover:text-red-600 underline transition-colors"
              >
                {t.map.clearAll}
              </button>
            </div>
          )}
        </div>

        {/* Property list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2 p-6">
              <MapPin className="w-8 h-8 opacity-40" />
              <p className="text-center">{t.map.noResults}</p>
              <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-red-600 hover:underline text-xs">{t.map.clearFilter}</button>
            </div>
          ) : (
            filtered.map((p) => (
              <Link
                key={p.id}
                href={`/bat-dong-san/${p.id}`}
                className="flex gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors group"
              >
                <div className="relative shrink-0">
                  <img src={p.images[0]} alt={p.title} className="w-16 h-14 object-cover rounded-lg" />
                  {!p.lat && (
                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-white opacity-70" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${p.type === "ban" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      {p.type === "ban" ? t.map.sell : t.map.rent}
                    </span>
                    {p.isVip && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">VIP</span>}
                  </div>
                  <div className="text-red-600 font-bold text-sm leading-tight">{formatPrice(p.price, p.priceUnit, locale)}</div>
                  <div className="text-gray-800 text-xs font-medium truncate group-hover:text-red-700 transition-colors">{p.title}</div>
                  <div className="text-gray-400 text-xs flex items-center gap-2 mt-0.5">
                    <span className="truncate">{p.district}</span>
                    {p.area && <span>· {p.area}m²</span>}
                    {p.bedrooms && <span>· {p.bedrooms}{t.map.bedroomsAbbr}</span>}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <PropertyMap
          properties={mapFiltered}
          focusLat={focusLat}
          focusLng={focusLng}
          focusId={focusId}
          onPolygonFilter={setPolygonIds}
        />
      </div>

      <MapFilterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        listingTab={tab}
        filters={filters}
        onChange={setFilters}
      />
    </div>
  );
}

export default function BanDoPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-5.75rem)] flex items-center justify-center text-gray-500">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Đang tải bản đồ...</p>
        </div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
