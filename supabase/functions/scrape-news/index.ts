// Supabase Edge Function: scrape-news
// Fetches real estate news from free RSS feeds daily
// Sources: VnExpress BĐS, Cafef BĐS, BatDongSan.com.vn
// Deploy: supabase functions deploy scrape-news
// Cron: pg_cron or Supabase Dashboard cron → every day at 7:00 AM Vietnam time (00:00 UTC)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RSS_SOURCES = [
  {
    name: "vnexpress",
    url: "https://vnexpress.net/rss/bat-dong-san.rss",
    category: "Thị trường",
  },
  {
    name: "cafef",
    url: "https://cafef.vn/bat-dong-san.rss",
    category: "Đầu tư",
  },
  {
    name: "batdongsan",
    url: "https://batdongsan.com.vn/tin-tuc/rss",
    category: "Thị trường",
  },
];

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  enclosureUrl?: string;
  author?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 120);
}

function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = (block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) ?? [])[1]?.trim() ?? "";
    const link = (block.match(/<link>([\s\S]*?)<\/link>/) ?? [])[1]?.trim() ?? "";
    const description = (block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) ?? [])[1]?.trim() ?? "";
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) ?? [])[1]?.trim() ?? "";
    const enclosureUrl = (block.match(/<enclosure[^>]+url="([^"]+)"/) ?? [])[1];
    // Try og:image or media:content as fallback
    const mediaUrl = (block.match(/<media:content[^>]+url="([^"]+)"/) ?? [])[1];
    const author = (block.match(/<author>([\s\S]*?)<\/author>/) ?? [])[1]?.trim() ??
                   (block.match(/<dc:creator>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:creator>/) ?? [])[1]?.trim();

    if (title && link) {
      items.push({ title, link, description, pubDate, enclosureUrl: enclosureUrl ?? mediaUrl, author });
    }
  }

  return items;
}

function extractImageFromDescription(html: string): string | null {
  const m = html.match(/<img[^>]+src="([^"]+)"/);
  return m ? m[1] : null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 500);
}

function estimateReadMin(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

Deno.serve(async (req) => {
  // Allow manual trigger via POST, or cron invocation
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const results = { inserted: 0, skipped: 0, errors: [] as string[] };

  for (const source of RSS_SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: { "User-Agent": "VietRealty-NewsBot/1.0 (+https://vietrealty.vn/tin-tuc)" },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        results.errors.push(`${source.name}: HTTP ${res.status}`);
        continue;
      }

      const xml = await res.text();
      const items = parseRss(xml);

      for (const item of items.slice(0, 20)) { // max 20 per source per run
        const imageUrl = item.enclosureUrl ?? extractImageFromDescription(item.description) ?? null;
        const cleanExcerpt = stripHtml(item.description);
        const baseSlug = slugify(item.title);
        // Append timestamp hash to guarantee uniqueness
        const uniqueSuffix = Date.now().toString(36).slice(-4);
        const slug = `${baseSlug}-${uniqueSuffix}`;

        const { error } = await supabase.from("news_articles").upsert(
          {
            source: source.name,
            source_url: item.link,
            slug,
            title: item.title,
            excerpt: cleanExcerpt,
            image_url: imageUrl,
            category: source.category,
            author: item.author ?? source.name,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            read_min: estimateReadMin(cleanExcerpt),
            status: "published",
          },
          { onConflict: "source_url", ignoreDuplicates: true }
        );

        if (error) {
          if (error.code === "23505") {
            results.skipped++;
          } else {
            results.errors.push(`${source.name}: ${error.message}`);
          }
        } else {
          results.inserted++;
        }
      }
    } catch (e) {
      results.errors.push(`${source.name}: ${(e as Error).message}`);
    }
  }

  return Response.json(results);
});
