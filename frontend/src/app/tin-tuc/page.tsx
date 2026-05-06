"use client";
import Link from "next/link";
import { Calendar, User, ChevronRight, TrendingUp, Home, Building2 } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { articles } from "@/lib/articles";

const CATEGORY_COLORS: Record<string, string> = {
  "Thị trường": "bg-red-50 text-red-700",   "Market": "bg-red-50 text-red-700",   "市场": "bg-red-50 text-red-700",
  "Pháp lý":   "bg-purple-50 text-purple-700", "Legal": "bg-purple-50 text-purple-700", "法规": "bg-purple-50 text-purple-700",
  "Đầu tư":    "bg-green-50 text-green-700",  "Investment": "bg-green-50 text-green-700", "投资": "bg-green-50 text-green-700",
  "Thương mại":"bg-amber-50 text-amber-700",  "Commercial": "bg-amber-50 text-amber-700", "商业": "bg-amber-50 text-amber-700",
  "Kiến thức": "bg-blue-50 text-blue-700",   "Knowledge": "bg-blue-50 text-blue-700",   "知识": "bg-blue-50 text-blue-700",
};

const PAGE_T = {
  vi: { heading: "Tin tức & Thị trường", sub: "Cập nhật mới nhất về bất động sản Việt Nam", readMore: "Đọc thêm", minRead: "phút đọc", latest: "Mới nhất", subscribe: "Đăng ký nhận bản tin thị trường", subscribeDesc: "Nhận cập nhật thị trường BĐS Việt Nam hàng tuần. Không spam.", emailPlaceholder: "Địa chỉ email của bạn", btn: "Đăng ký", trends: "Xu hướng thị trường", buyerGuides: "Cẩm nang mua nhà", invest: "Phân tích đầu tư" },
  en: { heading: "News & Market", sub: "Latest updates on Vietnam real estate", readMore: "Read more", minRead: "min read", latest: "Latest", subscribe: "Subscribe to Market Updates", subscribeDesc: "Weekly updates on Vietnam real estate market. No spam.", emailPlaceholder: "Your email address", btn: "Subscribe", trends: "Market Trends", buyerGuides: "Buyer Guides", invest: "Investment Analysis" },
  zh: { heading: "新闻与市场", sub: "越南房地产最新动态", readMore: "阅读更多", minRead: "分钟", latest: "最新", subscribe: "订阅市场快讯", subscribeDesc: "每周接收越南房产市场最新动态，无垃圾邮件", emailPlaceholder: "您的邮箱地址", btn: "订阅", trends: "市场趋势", buyerGuides: "购房指南", invest: "投资分析" },
};

function formatDate(d: string, locale: string) {
  const date = new Date(d);
  if (locale === "en") return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  if (locale === "zh") return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}

export default function TinTucPage() {
  const { locale } = useLocale();

  const articleTitle = (a: typeof articles[0]) =>
    locale === "en" ? a.titleEn : locale === "zh" ? a.titleZh : a.title;
  const articleExcerpt = (a: typeof articles[0]) =>
    locale === "en" ? a.excerptEn : locale === "zh" ? a.excerptZh : a.excerpt;
  const catLabel = (a: typeof articles[0]) =>
    locale === "en" ? a.categoryEn : locale === "zh" ? a.categoryZh : a.category;

  const featured = articles.filter(a => a.featured);
  const rest = articles.filter(a => !a.featured);

  const L = PAGE_T[locale] ?? PAGE_T.vi;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{L.heading}</h1>
        <p className="text-gray-500">{L.sub}</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: <TrendingUp className="w-5 h-5" />, label: L.trends, color: "text-red-600 bg-red-50" },
          { icon: <Home className="w-5 h-5" />, label: L.buyerGuides, color: "text-blue-600 bg-blue-50" },
          { icon: <Building2 className="w-5 h-5" />, label: L.invest, color: "text-green-600 bg-green-50" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>{item.icon}</div>
            <span className="text-sm font-semibold text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {featured.map(a => (
          <Link key={a.id} href={`/tin-tuc/${a.slug}`} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="relative aspect-video overflow-hidden">
              <img src={a.image} alt={articleTitle(a)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${CATEGORY_COLORS[catLabel(a)] ?? "bg-gray-100 text-gray-700"}`}>{catLabel(a)}</span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug mb-2 line-clamp-2">{articleTitle(a)}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{articleExcerpt(a)}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.date, locale)}</span>
                </div>
                <span>{a.readMin} {L.minRead}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Latest */}
      <h2 className="text-xl font-black text-gray-900 mb-6">{L.latest}</h2>
      <div className="space-y-4 mb-10">
        {rest.map(a => (
          <Link key={a.id} href={`/tin-tuc/${a.slug}`} className="group flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="relative w-28 h-20 shrink-0 overflow-hidden rounded-xl">
              <img src={a.image} alt={articleTitle(a)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[catLabel(a)] ?? "bg-gray-100 text-gray-700"}`}>{catLabel(a)}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">{articleTitle(a)}</h3>
              <p className="text-xs text-gray-400 line-clamp-1 mb-2">{articleExcerpt(a)}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.date, locale)}</span>
                <span className="ml-auto flex items-center gap-1 text-red-600 font-medium">{L.readMore} <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-xl font-black mb-2">{L.subscribe}</h3>
        <p className="text-red-100 text-sm mb-6 max-w-md mx-auto">{L.subscribeDesc}</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input type="email" placeholder={L.emailPlaceholder} className="flex-1 px-4 py-2.5 rounded-xl text-gray-900 text-sm focus:outline-none" />
          <button className="bg-white text-red-600 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors whitespace-nowrap">{L.btn}</button>
        </div>
      </div>
    </div>
  );
}
