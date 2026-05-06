"use client";
import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Trash2, Eye, Star, ExternalLink, Rss, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NewsArticle {
  id: string;
  source: string;
  source_url: string;
  slug: string | null;
  title: string;
  excerpt: string | null;
  category: string;
  author: string | null;
  published_at: string;
  is_featured: boolean;
  views: number;
  status: string;
  image_url: string | null;
}

const SOURCE_LABELS: Record<string, string> = {
  vnexpress: "VnExpress",
  cafef: "Cafef",
  batdongsan: "BatDongSan",
  manual: "Thủ công",
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapeResult, setScrapeResult] = useState<{ inserted: number; skipped: number; errors: string[] } | null>(null);

  async function fetchArticles() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("news_articles")
      .select("id, source, source_url, slug, title, excerpt, category, author, published_at, is_featured, views, status, image_url")
      .order("published_at", { ascending: false })
      .limit(100);
    if (err) setError(err.message);
    else setArticles(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchArticles(); }, []);

  async function toggleFeatured(id: string, current: boolean) {
    await supabase.from("news_articles").update({ is_featured: !current }).eq("id", id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, is_featured: !current } : a));
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "published" ? "hidden" : "published";
    await supabase.from("news_articles").update({ status: next }).eq("id", id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: next } : a));
  }

  async function deleteArticle(id: string) {
    if (!confirm("Xóa bài viết này?")) return;
    await supabase.from("news_articles").delete().eq("id", id);
    setArticles(prev => prev.filter(a => a.id !== id));
  }

  async function triggerScrape() {
    setScraping(true);
    setScrapeResult(null);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const res = await fetch(`${supabaseUrl}/functions/v1/scrape-news`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const result = await res.json();
        setScrapeResult(result);
        await fetchArticles();
      } else {
        setScrapeResult({ inserted: 0, skipped: 0, errors: [`HTTP ${res.status}`] });
      }
    } catch (e) {
      setScrapeResult({ inserted: 0, skipped: 0, errors: [(e as Error).message] });
    }
    setScraping(false);
  }

  const total = articles.length;
  const published = articles.filter(a => a.status === "published").length;
  const featured = articles.filter(a => a.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Quản lý tin tức</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{total} bài • {published} đang hiện • {featured} nổi bật</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={triggerScrape}
            disabled={scraping}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Rss className={`w-4 h-4 ${scraping ? "animate-pulse" : ""}`} />
            {scraping ? "Đang thu thập..." : "Thu thập RSS"}
          </button>
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {scrapeResult && (
        <div className={`rounded-xl border p-4 text-sm ${scrapeResult.errors.length > 0 ? "bg-yellow-50 border-yellow-200 text-yellow-800" : "bg-green-50 border-green-200 text-green-800"}`}>
          <strong>Kết quả thu thập:</strong> Thêm mới: {scrapeResult.inserted} • Bỏ qua (trùng): {scrapeResult.skipped}
          {scrapeResult.errors.length > 0 && (
            <div className="mt-2 text-red-600">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Lỗi: {scrapeResult.errors.join("; ")}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Đang tải...</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-8"></th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Nguồn</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Danh mục</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Lượt xem</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Nổi bật</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {articles.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    {a.image_url ? (
                      <img src={a.image_url} alt="" className="w-8 h-8 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs">🏠</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(a.published_at).toLocaleDateString("vi-VN")}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                      {SOURCE_LABELS[a.source] ?? a.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{a.category}</td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="flex items-center justify-end gap-1 text-gray-400">
                      <Eye className="w-3 h-3" />{a.views}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleFeatured(a.id, a.is_featured)} className={`p-1 rounded transition-colors ${a.is_featured ? "text-yellow-500 hover:text-yellow-400" : "text-gray-300 hover:text-yellow-500"}`}>
                      <Star className="w-4 h-4" fill={a.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(a.id, a.status)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${a.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                      {a.status === "published" ? "Hiện" : "Ẩn"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button onClick={() => deleteArticle(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {articles.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-2">Chưa có bài viết nào</p>
              <p className="text-sm">Nhấn "Thu thập RSS" để lấy tin tức từ VnExpress, Cafef.vn</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
