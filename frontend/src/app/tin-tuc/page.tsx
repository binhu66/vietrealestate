"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, User, ChevronRight, TrendingUp, Home, Building2, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { articles as staticArticles } from "@/lib/articles";
import { supabase } from "@/lib/supabase";

interface DbArticle {
  id: string;
  slug: string | null;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  author: string | null;
  published_at: string;
  read_min: number;
  is_featured: boolean;
  source: string;
  source_url: string;
  views: number;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  titleZh: string;
  excerpt: string;
  excerptEn: string;
  excerptZh: string;
  category: string;
  categoryEn: string;
  categoryZh: string;
  author: string;
  date: string;
  readMin: number;
  image: string;
  featured?: boolean;
  sourceUrl?: string;
  isExternal?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Thị trường":  "bg-red-50 text-red-700",
  "Market":      "bg-red-50 text-red-700",
  "市场":        "bg-red-50 text-red-700",
  "Pháp lý":    "bg-purple-50 text-purple-700",
  "Legal":       "bg-purple-50 text-purple-700",
  "法规":        "bg-purple-50 text-purple-700",
  "Đầu tư":     "bg-green-50 text-green-700",
  "Investment":  "bg-green-50 text-green-700",
  "投资":        "bg-green-50 text-green-700",
  "Thương mại":  "bg-amber-50 text-amber-700",
  "Commercial":  "bg-amber-50 text-amber-700",
  "商业":        "bg-amber-50 text-amber-700",
  "Kiến thức":  "bg-blue-50 text-blue-700",
  "Knowledge":   "bg-blue-50 text-blue-700",
  "知识":        "bg-blue-50 text-blue-700",
};

const CAT_EN: Record<string, string> = {
  "Thị trường": "Market", "Pháp lý": "Legal", "Đầu tư": "Investment",
  "Thương mại": "Commercial", "Kiến thức": "Knowledge",
};
const CAT_ZH: Record<string, string> = {
  "Thị trường": "市场", "Pháp lý": "法规", "Đầu tư": "投资",
  "Thương mại": "商业", "Kiến thức": "知识",
};

function dbToArticle(d: DbArticle): Article {
  return {
    id: d.id,
    slug: d.slug ?? d.id,
    title: d.title,
    titleEn: d.title,
    titleZh: d.title,
    excerpt: d.excerpt ?? "",
    excerptEn: d.excerpt ?? "",
    excerptZh: d.excerpt ?? "",
    category: d.category,
    categoryEn: CAT_EN[d.category] ?? d.category,
    categoryZh: CAT_ZH[d.category] ?? d.category,
    author: d.author ?? d.source,
    date: d.published_at,
    readMin: d.read_min,
    image: d.image_url ?? "/images/news-placeholder.jpg",
    featured: d.is_featured,
    sourceUrl: d.source_url,
    isExternal: d.source !== "manual",
  };
}

function formatDate(d: string, locale: string) {
  const date = new Date(d);
  if (locale === "en") return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  if (locale === "zh") return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}

function TinTucContent() {
  const { locale } = useLocale();
  const [articles, setArticles] = useState<Article[]>(staticArticles as unknown as Article[]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        let query = supabase
          .from("news_articles")
          .select("id, slug, title, excerpt, image_url, category, author, published_at, read_min, is_featured, source, source_url, views")
          .eq("status", "published")
          .order("is_featured", { ascending: false })
          .order("published_at", { ascending: false })
          .limit(50);

        if (activeCategory) query = query.eq("category", activeCategory);

        const { data } = await query;
        if (data && data.length > 0) {
          setArticles(data.map(dbToArticle));
        } else if (!activeCategory) {
          // DB empty or error — show static articles
          setArticles(staticArticles as unknown as Article[]);
        }
      } catch {
        // Network/Supabase error — keep static articles visible
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [activeCategory]);

  const articleTitle = (a: Article) =>
    locale === "en" ? a.titleEn : locale === "zh" ? a.titleZh : a.title;
  const articleExcerpt = (a: Article) =>
    locale === "en" ? a.excerptEn : locale === "zh" ? a.excerptZh : a.excerpt;
  const catLabel = (a: Article) =>
    locale === "en" ? a.categoryEn : locale === "zh" ? a.categoryZh : a.category;

  const featured = articles.filter(a => a.featured).slice(0, 2);
  const rest = articles.filter(a => !a.featured);

  const CATEGORIES = ["Thị trường", "Pháp lý", "Đầu tư", "Thương mại", "Kiến thức"];

  const L = {
    vi: { heading: "Tin tức & Thị trường", sub: "Cập nhật mới nhất về bất động sản Việt Nam", readMore: "Đọc thêm", minRead: "phút đọc", latest: "Mới nhất", all: "Tất cả", subscribe: "Đăng ký nhận bản tin thị trường", subscribeDesc: "Nhận cập nhật thị trường BĐS Việt Nam hàng tuần. Không spam.", emailPlaceholder: "Địa chỉ email của bạn", btn: "Đăng ký" },
    en: { heading: "News & Market", sub: "Latest updates on Vietnam real estate", readMore: "Read more", minRead: "min read", latest: "Latest", all: "All", subscribe: "Subscribe to Market Updates", subscribeDesc: "Weekly updates on Vietnam real estate market. No spam.", emailPlaceholder: "Your email address", btn: "Subscribe" },
    zh: { heading: "新闻与市场", sub: "越南房地产最新动态", readMore: "阅读更多", minRead: "分钟", latest: "最新", all: "全部", subscribe: "订阅市场快讯", subscribeDesc: "每周接收越南房产市场最新动态，无垃圾邮件", emailPlaceholder: "您的邮箱地址", btn: "订阅" },
  }[locale] ?? { heading: "Tin tức & Thị trường", sub: "Cập nhật mới nhất về bất động sản Việt Nam", readMore: "Đọc thêm", minRead: "phút đọc", latest: "Mới nhất", all: "Tất cả", subscribe: "Đăng ký nhận bản tin thị trường", subscribeDesc: "Nhận cập nhật thị trường BĐS Việt Nam hàng tuần. Không spam.", emailPlaceholder: "Địa chỉ email của bạn", btn: "Đăng ký" };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{L.heading}</h1>
        <p className="text-gray-500">{L.sub}</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <TrendingUp className="w-5 h-5" />, label: locale === "zh" ? "市场趋势" : locale === "en" ? "Market Trends" : "Xu hướng thị trường", color: "text-red-600 bg-red-50" },
          { icon: <Home className="w-5 h-5" />, label: locale === "zh" ? "购房指南" : locale === "en" ? "Buyer Guides" : "Cẩm nang mua nhà", color: "text-blue-600 bg-blue-50" },
          { icon: <Building2 className="w-5 h-5" />, label: locale === "zh" ? "投资分析" : locale === "en" ? "Investment Analysis" : "Phân tích đầu tư", color: "text-green-600 bg-green-50" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>{item.icon}</div>
            <span className="text-sm font-semibold text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("")}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${!activeCategory ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-200 hover:border-red-400"}`}
        >
          {L.all}
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? "" : cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${activeCategory === cat ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-200 hover:border-red-400"}`}
          >
            {locale === "en" ? CAT_EN[cat] : locale === "zh" ? CAT_ZH[cat] : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Đang tải tin tức...</span>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {featured.map(a => {
                const href = a.isExternal ? a.sourceUrl! : `/tin-tuc/${a.slug}`;
                const target = a.isExternal ? "_blank" : "_self";
                return (
                  <a key={a.id} href={href} target={target} rel={a.isExternal ? "noopener noreferrer" : undefined} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      {a.image && a.image !== "/images/news-placeholder.jpg" ? (
                        <img src={a.image} alt={articleTitle(a)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                      )}
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
                  </a>
                );
              })}
            </div>
          )}

          {/* Latest */}
          <h2 className="text-xl font-black text-gray-900 mb-6">{L.latest}</h2>
          <div className="space-y-4 mb-10">
            {rest.map(a => {
              const href = a.isExternal ? a.sourceUrl! : `/tin-tuc/${a.slug}`;
              const target = a.isExternal ? "_blank" : "_self";
              return (
                <a key={a.id} href={href} target={target} rel={a.isExternal ? "noopener noreferrer" : undefined} className="group flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
                  <div className="relative w-28 h-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {a.image && a.image !== "/images/news-placeholder.jpg" ? (
                      <img src={a.image} alt={articleTitle(a)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[catLabel(a)] ?? "bg-gray-100 text-gray-700"}`}>{catLabel(a)}</span>
                      {a.isExternal && <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">{a.author}</span>}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">{articleTitle(a)}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-2">{articleExcerpt(a)}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.date, locale)}</span>
                      <span className="ml-auto flex items-center gap-1 text-red-600 font-medium">{L.readMore} <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </>
      )}

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

export default function TinTucPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin inline" /></div>}>
      <TinTucContent />
    </Suspense>
  );
}
