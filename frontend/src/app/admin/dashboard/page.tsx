"use client";
import { properties, formatPrice } from "@/lib/data";
import Link from "next/link";
import { Building2, Eye, Users, Star, Home, Key } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

export default function DashboardPage() {
  const { locale } = useLocale();
  const t = getT(locale);

  const active = properties;
  const forSale = active.filter((p) => p.type === "ban");
  const forRent = active.filter((p) => p.type === "thue");
  const vip = active.filter((p) => p.isVip);
  const totalViews = active.reduce((sum, p) => sum + (p.views || 0), 0);

  const byCat: Record<string, number> = {};
  active.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1; });

  const stats = [
    { label: t.admin.totalProps, value: active.length, icon: <Building2 className="w-5 h-5" />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-900/40" },
    { label: t.admin.forSale, value: forSale.length, icon: <Home className="w-5 h-5" />, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-900/40" },
    { label: t.admin.forRent, value: forRent.length, icon: <Key className="w-5 h-5" />, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-100 dark:border-green-900/40" },
    { label: t.admin.vipListings, value: vip.length, icon: <Star className="w-5 h-5" />, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-100 dark:border-yellow-900/40" },
    { label: t.admin.totalViews, value: totalViews.toLocaleString(), icon: <Eye className="w-5 h-5" />, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-100 dark:border-purple-900/40" },
    { label: t.admin.totalUsers, value: "2", icon: <Users className="w-5 h-5" />, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-100 dark:border-pink-900/40" },
  ];

  const recent = [...active]
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 5);

  function getTitle(p: typeof active[0]) {
    if (locale === "en") return p.titleEn || p.title;
    if (locale === "zh") return p.titleZh || p.title;
    return p.title;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t.admin.dashboard}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.dashboardSubtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white dark:bg-gray-900 border ${s.border} rounded-xl p-4 shadow-sm`}>
            <div className={`w-9 h-9 ${s.bg} ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent listings */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">{t.admin.recentListings}</h2>
            <Link href="/admin/bat-dong-san" className="text-red-600 dark:text-red-400 text-sm hover:underline font-medium">
              {t.admin.manage} →
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-900 dark:text-white font-medium truncate">{getTitle(p)}</div>
                  <div className="text-xs text-gray-400">{p.district} · {formatPrice(p.price, p.priceUnit)}</div>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === "ban" ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
                  {p.type === "ban" ? t.admin.sale : t.admin.rent}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By category */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">{t.admin.byCategory}</h2>
          <div className="space-y-3">
            {Object.entries(byCat).map(([cat, count]) => {
              const pct = Math.round((count / active.length) * 100);
              const labels = t.categories as Record<string, string>;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{labels[cat] || cat}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/bat-dong-san", label: t.admin.manageProp, icon: "🏠" },
          { href: "/admin/nguoi-dung", label: t.admin.manageUsers, icon: "👥" },
          { href: "/bat-dong-san", label: t.admin.viewSite, icon: "🌐" },
          { href: "/ban-do", label: t.admin.mapView, icon: "🗺️" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center hover:border-red-300 dark:hover:border-red-700 hover:shadow-md transition-all shadow-sm"
          >
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{a.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
