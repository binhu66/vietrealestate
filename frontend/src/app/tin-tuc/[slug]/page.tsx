import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/lib/articles";
import ArticleContent from "./ArticleContent";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://vietrealty.vn";

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);
  if (!article) return { title: "Không tìm thấy | VietRealty" };

  return {
    title: `${article.title} | VietRealty`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${BASE_URL}/tin-tuc/${article.slug}`,
      images: article.image ? [{ url: article.image, width: 1200, height: 630 }] : [],
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
    alternates: { canonical: `${BASE_URL}/tin-tuc/${article.slug}` },
  };
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  return <ArticleContent article={article} related={related} />;
}
