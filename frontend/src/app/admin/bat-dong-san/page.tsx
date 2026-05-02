"use client";
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { properties as initialProps, formatPrice, categories } from "@/lib/data";
import type { Property } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import Link from "next/link";

export default function AdminPropertiesPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const [data, setData] = useState<Property[]>(initialProps);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortField, setSortField] = useState<"price" | "area" | "postedAt" | "views">("postedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleDelete(id: string) {
    if (confirm(t.admin.confirmDelete)) {
      setData((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  function getTitle(p: Property) {
    if (locale === "en") return p.titleEn || p.title;
    if (locale === "zh") return p.titleZh || p.title;
    return p.title;
  }

  const filtered = data
    .filter((p) => {
      const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.titleEn || "").toLowerCase().includes(q.toLowerCase()) || p.address.toLowerCase().includes(q.toLowerCase());
      const matchType = !typeFilter || p.type === typeFilter;
      return matchQ && matchType;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "price") return (a.price - b.price) * dir;
      if (sortField === "area") return (a.area - b.area) * dir;
      if (sortField === "views") return ((a.views || 0) - (b.views || 0)) * dir;
      return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime() > 0 ? dir : -dir;
    });

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field
      ? sortDir === "desc" ? <ChevronDown className="w-3 h-3 inline" /> : <ChevronUp className="w-3 h-3 inline" />
      : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">{t.admin.properties}</h1>
          <p className="text-gray-400 mt-1">{data.length} {t.admin.propertiesLabel}</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" /> {t.admin.add}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.admin.searchListings}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">{t.admin.allTypes}</option>
          <option value="ban">{t.admin.forSale}</option>
          <option value="thue">{t.admin.forRent}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">{t.admin.listing}</th>
                <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-300" onClick={() => toggleSort("price")}>
                  {t.property.price} <SortIcon field="price" />
                </th>
                <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-300" onClick={() => toggleSort("area")}>
                  {t.property.area} <SortIcon field="area" />
                </th>
                <th className="text-left px-4 py-3">{t.admin.type}</th>
                <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-300" onClick={() => toggleSort("views")}>
                  {t.admin.views} <SortIcon field="views" />
                </th>
                <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-300" onClick={() => toggleSort("postedAt")}>
                  {t.property.postedAt} <SortIcon field="postedAt" />
                </th>
                <th className="text-left px-4 py-3">{t.admin.status}</th>
                <th className="text-right px-4 py-3">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-12 h-9 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate max-w-48">{getTitle(p)}</div>
                        <div className="text-gray-500 text-xs truncate">{p.district}, {p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-red-400 font-semibold whitespace-nowrap">
                    {formatPrice(p.price, p.priceUnit)}
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{p.area} m²</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.type === "ban" ? "bg-red-900/50 text-red-400" : "bg-blue-900/50 text-blue-400"}`}>
                      {p.type === "ban" ? t.admin.sale : t.admin.rent}
                    </span>
                    {p.isVip && <span className="ml-1 text-xs px-1.5 py-0.5 bg-yellow-900/50 text-yellow-400 rounded-full">VIP</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{(p.views || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{p.postedAt}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">
                      {t.admin.active}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/bat-dong-san/${p.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title={t.admin.status}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-1.5 text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                        title={t.admin.edit}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title={t.admin.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-600">
                    {t.admin.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
