import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// Public JSON API for news articles — AI-friendly
// GET /api/news?category=Thị+trường&q=căn+hộ&limit=10&offset=0
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q        = searchParams.get("q");
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "10"), 50);
  const offset   = parseInt(searchParams.get("offset") ?? "0");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("news_articles")
    .select("id, slug, title, excerpt, category, author, published_at, read_min, source, source_url, image_url, views", { count: "exact" })
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq("category", category);
  if (q)        query = query.textSearch("search_vector", q, { type: "websearch", config: "simple" });

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { total: count, offset, limit, articles: data },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "noindex",
      },
    }
  );
}
