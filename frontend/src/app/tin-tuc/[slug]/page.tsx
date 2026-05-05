"use client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Clock, ChevronLeft, Tag } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { articles } from "@/lib/articles";
import { use } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  "Thị trường": "bg-red-50 text-red-700",    "Market": "bg-red-50 text-red-700",    "市场": "bg-red-50 text-red-700",
  "Pháp lý":    "bg-purple-50 text-purple-700", "Legal": "bg-purple-50 text-purple-700",  "法规": "bg-purple-50 text-purple-700",
  "Đầu tư":     "bg-green-50 text-green-700",   "Investment": "bg-green-50 text-green-700", "投资": "bg-green-50 text-green-700",
  "Thương mại": "bg-amber-50 text-amber-700",   "Commercial": "bg-amber-50 text-amber-700", "商业": "bg-amber-50 text-amber-700",
  "Kiến thức":  "bg-blue-50 text-blue-700",     "Knowledge": "bg-blue-50 text-blue-700",   "知识": "bg-blue-50 text-blue-700",
};

function formatDate(d: string, locale: string) {
  const date = new Date(d);
  if (locale === "en") return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  if (locale === "zh") return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}

// Minimal markdown → HTML: bold, headings, paragraphs
function renderMarkdown(md: string): string {
  return md
    .split("\n\n")
    .map(block => {
      if (block.startsWith("## ")) return `<h2>${block.slice(3).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</h2>`;
      if (block.startsWith("### ")) return `<h3>${block.slice(4).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</h3>`;
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block.split("\n").map(l => `<li>${l.replace(/^[-*]\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      if (/^\d+\./.test(block)) {
        const items = block.split("\n").map(l => `<li>${l.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`).join("");
        return `<ol>${items}</ol>`;
      }
      return `<p>${block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
    })
    .join("\n");
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locale } = useLocale();

  const article = articles.find(a => a.slug === slug);
  if (!article) notFound();

  const title   = locale === "en" ? article.titleEn   : locale === "zh" ? article.titleZh   : article.title;
  const catLabel = locale === "en" ? article.categoryEn : locale === "zh" ? article.categoryZh : article.category;
  const body    = locale === "en" ? article.bodyEn    : locale === "zh" ? article.bodyZh    : article.body;

  const related = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  const L = {
    vi: { back: "← Tin tức", relatedTitle: "Bài viết liên quan", readMore: "Đọc thêm →", minRead: "phút đọc" },
    en: { back: "← News", relatedTitle: "Related Articles", readMore: "Read more →", minRead: "min read" },
    zh: { back: "← 新闻", relatedTitle: "相关文章", readMore: "阅读更多 →", minRead: "分钟" },
  }[locale] ?? { back: "← Tin tức", relatedTitle: "Bài viết liên quan", readMore: "Đọc thêm →", minRead: "phút đọc" };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/tin-tuc" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> {L.back}
      </Link>

      {/* Hero image */}
      <div className="relative aspect-video overflow-hidden rounded-2xl mb-8">
        <img src={article.image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[catLabel] ?? "bg-gray-100 text-gray-700"}`}>
          <Tag className="w-3 h-3 inline mr-1" />{catLabel}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-5">{title}</h1>

      {/* Author / date / read */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
        <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author}</span>
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(article.date, locale)}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.readMin} {L.minRead}</span>
      </div>

      {/* Body */}
      <div
        className="prose prose-lg max-w-none text-gray-700
          prose-h2:text-xl prose-h2:font-black prose-h2:text-gray-900 prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-lg prose-h3:font-bold prose-h3:text-gray-800 prose-h3:mt-6 prose-h3:mb-2
          prose-p:leading-relaxed prose-p:mb-4
          prose-ul:my-4 prose-ul:pl-6 prose-ul:space-y-1 prose-li:text-gray-600
          prose-ol:my-4 prose-ol:pl-6 prose-ol:space-y-1
          prose-strong:font-bold prose-strong:text-gray-900"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-5">{L.relatedTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(a => {
              const rTitle = locale === "en" ? a.titleEn : locale === "zh" ? a.titleZh : a.title;
              return (
                <Link key={a.id} href={`/tin-tuc/${a.slug}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={a.image} alt={rTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">{rTitle}</h3>
                    <span className="text-xs text-red-600 font-medium">{L.readMore}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
