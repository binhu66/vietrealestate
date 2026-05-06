"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Eye, ChevronUp, ChevronDown, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/data";
import type { Property } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import Link from "next/link";
import AIListingParser from "@/components/admin/AIListingParser";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";

type SortField = "price" | "area" | "postedAt" | "views";

const PROPS_T = {
  vi: {
    fetchFailed: "Không thể tải dữ liệu",
    deleteFailed: "Không thể xóa: ",
    refresh: "Làm mới",
    loading: "Đang tải...",
    loadingFromDb: "Đang tải dữ liệu từ Supabase...",
    retry: "Thử lại",
    emptyDb: "Chưa có tin đăng nào trong Supabase",
  },
  en: {
    fetchFailed: "Failed to load data",
    deleteFailed: "Could not delete: ",
    refresh: "Refresh",
    loading: "Loading...",
    loadingFromDb: "Loading data from Supabase...",
    retry: "Retry",
    emptyDb: "No listings in Supabase yet",
  },
  zh: {
    fetchFailed: "无法加载数据",
    deleteFailed: "无法删除：",
    refresh: "刷新",
    loading: "加载中...",
    loadingFromDb: "正在从 Supabase 加载...",
    retry: "重试",
    emptyDb: "Supabase 中暂无房源",
  },
} as const;

export default function AdminPropertiesPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const pt = PROPS_T[locale];
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("postedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  async function fetchListings() {
    setLoading(true);
    setError(null);
    try {
      // Fetch all statuses for admin view (not just Active)
      const { data: rows, error: err, count } = await supabase
        .from("listings")
        .select(LISTING_SELECT + ", standard_status", { count: "exact" })
        .order("original_entry_timestamp", { ascending: false })
        .limit(200);

      if (err) throw err;
      if (rows) {
        setData((rows as unknown as DbListing[]).map(dbToProperty));
        setTotalCount(count ?? rows.length);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : pt.fetchFailed;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchListings(); }, []);

  async function handleDelete(id: string) {
    if (!confirm(t.admin.confirmDelete)) return;
    setDeletingId(id);
    const { error: err } = await supabase
      .from("listings")
      .update({ standard_status: "Withdrawn" })
      .eq("id", id);

    if (err) {
      alert(pt.deleteFailed + err.message);
    } else {
      setData(prev => prev.filter(p => p.id !== id));
      setTotalCount(c => c - 1);
    }
    setDeletingId(null);
  }

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  }

  function getTitle(p: Property) {
    if (locale === "en") return p.titleEn || p.title;
    if (locale === "zh") return p.titleZh || p.title;
    return p.title;
  }

  const filtered = data
    .filter(p => {
      const matchQ = !q
        || p.title.toLowerCase().includes(q.toLowerCase())
        || (p.titleEn || "").toLowerCase().includes(q.toLowerCase())
        || p.address.toLowerCase().includes(q.toLowerCase());
      const matchType = !typeFilter || p.type === typeFilter;
      return matchQ && matchType;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "price") return (a.price - b.price) * dir;
      if (sortField === "area") return (a.area - b.area) * dir;
      if (sortField === "views") return ((a.views || 0) - (b.views || 0)) * dir;
      return (new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime()) * dir;
    });

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? sortDir === "desc" ? <ChevronDown className="w-3 h-3 inline ml-0.5" /> : <ChevronUp className="w-3 h-3 inline ml-0.5" />
      : null;

  const stats = {
    total: data.length,
    ban: data.filter(p => p.type === "ban").length,
    thue: data.filter(p => p.type === "thue").length,
    vip: data.filter(p => p.isVip).length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t.admin.properties}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {loading ? pt.loading : `${totalCount} ${t.admin.propertiesLabel}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchListings}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
            title={pt.refresh}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <AIListingParser onSaved={() => fetchListings()} />
          <Link
            href="/dang-tin"
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> {t.admin.add}
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: t.admin.totalProps, value: stats.total, color: "text-gray-900 dark:text-white" },
          { label: t.admin.forSale, value: stats.ban, color: "text-red-600 dark:text-red-400" },
          { label: t.admin.forRent, value: stats.thue, color: "text-blue-600 dark:text-blue-400" },
          { label: t.admin.vipListings, value: stats.vip, color: "text-yellow-600 dark:text-yellow-400" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-center shadow-sm">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={t.admin.searchListings}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
        >
          <option value="">{t.admin.allTypes}</option>
          <option value="ban">{t.admin.forSale}</option>
          <option value="thue">{t.admin.forRent}</option>
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchListings} className="ml-auto underline hover:no-underline">{pt.retry}</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">{pt.loadingFromDb}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">{t.admin.listing}</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" onClick={() => toggleSort("price")}>
                    {t.property.price} <SortIcon field="price" />
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" onClick={() => toggleSort("area")}>
                    {t.property.area} <SortIcon field="area" />
                  </th>
                  <th className="text-left px-4 py-3">{t.admin.type}</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" onClick={() => toggleSort("views")}>
                    {t.admin.views} <SortIcon field="views" />
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" onClick={() => toggleSort("postedAt")}>
                    {t.property.postedAt} <SortIcon field="postedAt" />
                  </th>
                  <th className="text-left px-4 py-3">{t.admin.status}</th>
                  <th className="text-right px-4 py-3">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-12 h-9 object-cover rounded-lg shrink-0" />
                        <div className="min-w-0">
                          <div className="text-gray-900 dark:text-white font-medium truncate max-w-48">{getTitle(p)}</div>
                          <div className="text-gray-400 text-xs truncate">{p.district}, {p.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400 font-semibold whitespace-nowrap">
                      {formatPrice(p.price, p.priceUnit)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{p.area} m²</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === "ban" ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
                        {p.type === "ban" ? t.admin.sale : t.admin.rent}
                      </span>
                      {p.isVip && <span className="ml-1 text-xs px-1.5 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full font-medium">VIP</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{(p.views || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.postedAt}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                        {t.admin.active}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/bat-dong-san/${p.id}`} target="_blank" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-40"
                        >
                          {deletingId === p.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      {data.length === 0 ? pt.emptyDb : t.admin.noResults}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
