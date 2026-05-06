import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { articles } from "@/lib/articles";
import { createClient } from "@supabase/supabase-js";
import ArticleContent from "./ArticleContent";

export const runtime = "edge";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://binhorizon.com";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}


export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  // Check static articles first
  const staticArticle = articles.find(a => a.slug === slug);
  if (staticArticle) {
    return {
      title: `${staticArticle.title} | BinHorizon`,
      description: staticArticle.excerpt,
      openGraph: {
        title: staticArticle.title,
        description: staticArticle.excerpt,
        url: `${BASE_URL}/tin-tuc/${slug}`,
        images: staticArticle.image ? [{ url: staticArticle.image, width: 1200, height: 630 }] : [],
        type: "article",
        publishedTime: staticArticle.date,
        authors: [staticArticle.author],
      },
    };
  }

  // Try DB
  try {
    const { data } = await getSupabase()
      .from("news_articles")
      .select("title, excerpt, image_url, published_at, author, source_url, source")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data) {
      return {
        title: `${data.title} | BinHorizon Tin tức`,
        description: data.excerpt ?? undefined,
        openGraph: {
          title: data.title,
          description: data.excerpt ?? undefined,
          url: `${BASE_URL}/tin-tuc/${slug}`,
          images: data.image_url ? [{ url: data.image_url, width: 1200, height: 630 }] : [],
          type: "article",
          publishedTime: data.published_at,
          authors: data.author ? [data.author] : undefined,
        },
      };
    }
  } catch { /* fallthrough */ }

  return { title: "Tin tức | BinHorizon" };
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Static articles
  const staticArticle = articles.find(a => a.slug === slug);
  if (staticArticle) {
    const related = articles
      .filter(a => a.id !== staticArticle.id && a.category === staticArticle.category)
      .slice(0, 3);
    return <ArticleContent article={staticArticle} related={related} />;
  }

  // Try DB
  try {
    const { data } = await getSupabase()
      .from("news_articles")
      .select("id, slug, title, excerpt, image_url, category, author, published_at, read_min, source, source_url, views")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data) {
      // External scraped articles redirect to original source
      if (data.source !== "manual" && data.source_url) {
        redirect(data.source_url);
      }

      // Manual articles show full content (body stored separately)
      const article = {
        id: data.id,
        slug: data.slug ?? slug,
        title: data.title,
        titleEn: data.title,
        titleZh: data.title,
        excerpt: data.excerpt ?? "",
        excerptEn: data.excerpt ?? "",
        excerptZh: data.excerpt ?? "",
        body: data.excerpt ?? "",
        bodyEn: data.excerpt ?? "",
        bodyZh: data.excerpt ?? "",
        category: data.category,
        categoryEn: data.category,
        categoryZh: data.category,
        author: data.author ?? data.source,
        date: data.published_at,
        readMin: data.read_min,
        image: data.image_url ?? "",
        featured: false,
      };

      return <ArticleContent article={article} related={[]} />;
    }
  } catch { /* fallthrough */ }

  notFound();
}
