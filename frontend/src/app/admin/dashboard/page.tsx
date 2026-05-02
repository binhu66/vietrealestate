"use client";
import { properties } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import Link from "next/link";
import { Building2, TrendingUp, Eye, Users, Star, Home, Key, BarChart3 } from "lucide-react";
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
    { label: t.admin.totalProps, value: active.length, icon: <Building2 className="w-6 h-6" />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: t.admin.forSale, value: forSale.length, icon: <Home className="w-6 h-6" />, color: "text-red-400", bg: "bg-red-400/10" },
    { label: t.admin.forRent, value: forRent.length, icon: <Key className="w-6 h-6" />, color: "text-green-400", bg: "bg-green-400/10" },
    { label: t.admin.vipListings, value: vip.length, icon: <Star className="w-6 h-6" />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: t.admin.totalViews, value: totalViews.toLocaleString(), icon: <Eye className="w-6 h-6" />, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: t.admin.totalUsers, value: "2", icon: <Users className="w-6 h-6" />, color: "text-pink-400", bg: "bg-pink-400/10" },
  ];

  const recent = [...active]
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">{t.admin.dashboard}</h1>
        <p className="text-gray-400 mt-1">{t.admin.dashboardSubtitle}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent listings */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">{t.admin.recentListings}</h2>
            <Link href="/admin/bat-dong-san" className="text-red-400 text-sm hover:text-red-300">
              {t.admin.manage} →
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white font-medium truncate">
                    {locale === "en" ? (p.titleEn || p.title) : locale === "zh" ? (p.titleZh || p.title) : p.title}
                  </div>
                  <div className="text-xs text-gray-500">{p.district} · {formatPrice(p.price, p.priceUnit)}</div>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${p.type === "ban" ? "bg-red-900/50 text-red-400" : "bg-blue-900/50 text-blue-400"}`}>
                  {p.type === "ban" ? t.admin.sale : t.admin.rent}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By category */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-bold text-white mb-4">{t.admin.byCategory}</h2>
          <div className="space-y-3">
            {Object.entries(byCat).map(([cat, count]) => {
              const pct = Math.round((count / active.length) * 100);
              const labels = t.categories as Record<string, string>;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{labels[cat] || cat}</span>
                    <span>{count} tin ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
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
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-red-600 hover:bg-gray-800 transition-all"
          >
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="text-sm text-gray-300 font-medium">{a.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
