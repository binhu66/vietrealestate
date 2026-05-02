"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { categories } from "@/lib/data";

export interface MapFilters {
  priceMin?: number;
  priceMax?: number;
  categoryIds: string[];
  bedroomsMin?: number;
  areaMin?: number;
  areaMax?: number;
}

export const EMPTY_FILTERS: MapFilters = { categoryIds: [] };

const PRICE_RANGES_BAN = [
  { label: "≤1 tỷ",   min: 0,  max: 1   },
  { label: "1–3 tỷ",  min: 1,  max: 3   },
  { label: "3–5 tỷ",  min: 3,  max: 5   },
  { label: "5–10 tỷ", min: 5,  max: 10  },
  { label: "10–20 tỷ",min: 10, max: 20  },
  { label: "≥20 tỷ",  min: 20, max: 9999},
];
const PRICE_RANGES_THUE = [
  { label: "≤5 tr/th",  min: 0,  max: 5  },
  { label: "5–10 tr",   min: 5,  max: 10 },
  { label: "10–20 tr",  min: 10, max: 20 },
  { label: "20–50 tr",  min: 20, max: 50 },
  { label: "≥50 tr/th", min: 50, max: 9999},
];
const BEDROOMS = [1, 2, 3, 4, "5+"] as const;
const AREA_PRESETS = [
  { label: "≤50 m²",   min: 0,   max: 50  },
  { label: "50–100",   min: 50,  max: 100 },
  { label: "100–200",  min: 100, max: 200 },
  { label: "200–500",  min: 200, max: 500 },
  { label: "≥500 m²",  min: 500, max: 9999},
];

type Tab = "price" | "type" | "rooms" | "more";

interface Props {
  open: boolean;
  onClose: () => void;
  listingTab: "ban" | "thue" | "thuong-mai";
  filters: MapFilters;
  onChange: (f: MapFilters) => void;
}

export default function MapFilterModal({ open, onClose, listingTab, filters, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("price");
  const [local, setLocal] = useState<MapFilters>({ ...filters });

  function patch(partial: Partial<MapFilters>) {
    setLocal(prev => ({ ...prev, ...partial }));
  }

  function toggleCategory(id: string) {
    const cur = local.categoryIds;
    patch({ categoryIds: cur.includes(id) ? cur.filter(c => c !== id) : [...cur, id] });
  }

  function isPriceActive(min: number, max: number) {
    return local.priceMin === min && local.priceMax === max;
  }

  function togglePrice(min: number, max: number) {
    if (isPriceActive(min, max)) patch({ priceMin: undefined, priceMax: undefined });
    else patch({ priceMin: min, priceMax: max });
  }

  function isAreaActive(min: number, max: number) {
    return local.areaMin === min && local.areaMax === max;
  }

  function toggleArea(min: number, max: number) {
    if (isAreaActive(min, max)) patch({ areaMin: undefined, areaMax: undefined });
    else patch({ areaMin: min, areaMax: max });
  }

  function reset() {
    setLocal(EMPTY_FILTERS);
  }

  function apply() {
    onChange(local);
    onClose();
  }

  if (!open) return null;

  const priceRanges = listingTab === "thue" ? PRICE_RANGES_THUE : PRICE_RANGES_BAN;
  const priceUnit   = listingTab === "thue" ? "tr/th" : "tỷ";

  const TABS: { id: Tab; label: string }[] = [
    { id: "price", label: "Giá" },
    { id: "type",  label: "Loại BĐS" },
    { id: "rooms", label: "Phòng ngủ" },
    { id: "more",  label: "Thêm" },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[380px] max-h-[88vh] flex flex-col overflow-hidden mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">Điều kiện lọc</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.id ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* ——— PRICE ——— */}
          {tab === "price" && <>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Tự chỉnh giá ({priceUnit})</p>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" placeholder="Thấp nhất"
                  value={local.priceMin ?? ""}
                  onChange={e => patch({ priceMin: e.target.value ? +e.target.value : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="number" min="0" placeholder="Cao nhất"
                  value={local.priceMax ?? ""}
                  onChange={e => patch({ priceMax: e.target.value ? +e.target.value : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Khoảng giá</p>
              <div className="grid grid-cols-3 gap-2">
                {priceRanges.map(r => (
                  <button
                    key={r.label}
                    onClick={() => togglePrice(r.min, r.max)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-colors ${isPriceActive(r.min, r.max) ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-red-300"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </>}

          {/* ——— TYPE ——— */}
          {tab === "type" && <>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Loại bất động sản</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => toggleCategory(c.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${local.categoryIds.includes(c.id) ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-red-300"}`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>}

          {/* ——— ROOMS ——— */}
          {tab === "rooms" && <>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Số phòng ngủ tối thiểu</p>
              <div className="flex gap-2">
                {BEDROOMS.map(b => {
                  const val = b === "5+" ? 5 : (b as number);
                  return (
                    <button
                      key={b}
                      onClick={() => patch({ bedroomsMin: local.bedroomsMin === val ? undefined : val })}
                      className={`flex-1 h-10 rounded-xl border text-sm font-semibold transition-colors ${local.bedroomsMin === val ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-red-300"}`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Diện tích (m²)</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {AREA_PRESETS.map(r => (
                  <button
                    key={r.label}
                    onClick={() => toggleArea(r.min, r.max)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-colors ${isAreaActive(r.min, r.max) ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-red-300"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" placeholder="Tối thiểu"
                  value={local.areaMin ?? ""}
                  onChange={e => patch({ areaMin: e.target.value ? +e.target.value : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number" min="0" placeholder="Tối đa"
                  value={local.areaMax ?? ""}
                  onChange={e => patch({ areaMax: e.target.value ? +e.target.value : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <span className="text-xs text-gray-400">m²</span>
              </div>
            </div>
          </>}

          {/* ——— MORE ——— */}
          {tab === "more" && <>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Diện tích (m²)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" placeholder="Tối thiểu"
                  value={local.areaMin ?? ""}
                  onChange={e => patch({ areaMin: e.target.value ? +e.target.value : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number" min="0" placeholder="Tối đa"
                  value={local.areaMax ?? ""}
                  onChange={e => patch({ areaMax: e.target.value ? +e.target.value : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <span className="text-xs text-gray-400">m²</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Số phòng ngủ tối thiểu</p>
              <div className="flex gap-2">
                {BEDROOMS.map(b => {
                  const val = b === "5+" ? 5 : (b as number);
                  return (
                    <button
                      key={b}
                      onClick={() => patch({ bedroomsMin: local.bedroomsMin === val ? undefined : val })}
                      className={`flex-1 h-10 rounded-xl border text-sm font-semibold transition-colors ${local.bedroomsMin === val ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-red-300"}`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </>}

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button
            onClick={reset}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Đặt lại
          </button>
          <button
            onClick={apply}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
