"use client";
import Link from "next/link";
import { Building2, Eye, Users, Star, Home, Key, Loader2, RefreshCw } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import type { Property } from "@/lib/data";
import { formatPrice } from "@/lib/data";

const DASH_T = {
  vi: { loading: "Đang tải...", noListings: "Chưa có tin đăng nào", noData: "Chưa có dữ liệu" },
  en: { loading: "Loading...", noListings: "No listings yet", noData: "No data yet" },
  zh: { loading: "加载中...", noListings: "暂无房源", noData: "暂无数据" },
} as const;

interface Stats {
  total: number;
  forSale: number;
  forRent: number;
  vip: number;
  totalViews: number;
}

export default function DashboardPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const dt = DASH_T[locale];

  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState<Stats>({ total: 0, forSale: 0, forRent: 0, vip: 0, totalViews: 0 });
  const [recent, setRecent]   = useState<Property[]>([]);
  const [byCat, setByCat]     = useState<Record<string, number>>({});

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("standard_status", "Active")
      .order("original_entry_timestamp", { ascending: false })
      .limit(200);

    if (data && data.length > 0) {
      const props = (data as unknown as DbListing[]).map(dbToProperty);
      const forSale = props.filter(p => p.type === "ban");
      const forRent = props.filter(p => p.type === "thue");
      const vip     = props.filter(p => p.isVip);
      const totalViews = props.reduce((s, p) => s + (p.views || 0), 0);

      const cat: Record<string, number> = {};
      props.forEach(p => { cat[p.category] = (cat[p.category] || 0) + 1; });

      setStats({ total: props.length, forSale: forSale.length, forRent: forRent.length, vip: vip.length, totalViews });
      setRecent(props.slice(0, 5));
      setByCat(cat);
    }
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    { label: t.admin.totalProps,  value: loading ? "…" : stats.total,                  icon: <Building2 className="w-5 h-5" />, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
    { label: t.admin.forSale,     value: loading ? "…" : stats.forSale,                icon: <Home className="w-5 h-5" />,      color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100" },
    { label: t.admin.forRent,     value: loading ? "…" : stats.forRent,                icon: <Key className="w-5 h-5" />,       color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100" },
    { label: t.admin.vipListings, value: loading ? "…" : stats.vip,                    icon: <Star className="w-5 h-5" />,      color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
    { label: t.admin.totalViews,  value: loading ? "…" : stats.totalViews.toLocaleString(), icon: <Eye className="w-5 h-5" />,  color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { label: t.admin.totalUsers,  value: "–",                                          icon: <Users className="w-5 h-5" />,     color: "text-pink-600",   bg: "bg-pink-50",   border: "border-pink-100" },
  ];

  function getTitle(p: Property) {
    if (locale === "en") return p.titleEn || p.title;
    if (locale === "zh") return p.titleZh || p.title;
    return p.title;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t.admin.dashboard}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.dashboardSubtitle}</p>
        </div>
        <button onClick={fetchData} disabled={loading} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(s => (
          <div key={s.label} className={`bg-white dark:bg-gray-900 border ${s.border} dark:border-gray-800 rounded-xl p-4 shadow-sm`}>
            <div className={`w-9 h-9 ${s.bg} dark:bg-opacity-20 ${s.color} rounded-lg flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className={`text-2xl font-black text-gray-900 dark:text-white ${loading && s.label !== t.admin.totalUsers ? "animate-pulse" : ""}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent listings */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">{t.admin.recentListings}</h2>
            <Link href="/admin/bat-dong-san" className="text-red-600 dark:text-red-400 text-sm hover:underline font-medium">{t.admin.manage} →</Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /><span className="text-sm">{dt.loading}</span></div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">{dt.noListings}</p>
          ) : (
            <div className="space-y-3">
              {recent.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-900 dark:text-white font-medium truncate">{getTitle(p)}</div>
                    <div className="text-xs text-gray-400">{p.district} · {formatPrice(p.price, p.priceUnit)}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${p.type === "ban" ? "bg-red-50 dark:bg-red-900/30 text-red-600" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600"}`}>
                    {p.type === "ban" ? t.admin.sale : t.admin.rent}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By category */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">{t.admin.byCategory}</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />)}
            </div>
          ) : Object.keys(byCat).length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">{dt.noData}</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                const pct = Math.round((count / stats.total) * 100);
                const labels = t.categories as Record<string, string>;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>{labels[cat] || cat}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/bat-dong-san", label: t.admin.manageProp, icon: "🏠" },
          { href: "/admin/nguoi-dung",   label: t.admin.manageUsers, icon: "👥" },
          { href: "/bat-dong-san",       label: t.admin.viewSite, icon: "🌐" },
          { href: "/ban-do",             label: t.admin.mapView, icon: "🗺️" },
        ].map(a => (
          <Link key={a.href} href={a.href} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center hover:border-red-300 dark:hover:border-red-700 hover:shadow-md transition-all shadow-sm">
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{a.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
