import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// Market statistics API — powers price heatmaps and ROI analysis
// GET /api/stats?type=city_avg|district_avg|category_avg|trend
// Returns aggregated listing data for quantitative analysis

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type     = searchParams.get("type") ?? "city_avg";
  const city     = searchParams.get("city");
  const category = searchParams.get("category");
  const txType   = searchParams.get("tx");  // "For Sale" | "For Rent"

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let data: unknown;

  if (type === "city_avg") {
    // Average price per m² by city
    const { data: rows } = await supabase.rpc("stats_price_by_city", {
      p_tx_type: txType ?? null,
      p_category: category ?? null,
    });
    data = rows;
  } else if (type === "district_avg") {
    // Average price per m² by district within a city
    const { data: rows } = await supabase.rpc("stats_price_by_district", {
      p_city: city ?? "TP. Hồ Chí Minh",
      p_tx_type: txType ?? "For Sale",
      p_category: category ?? null,
    });
    data = rows;
  } else if (type === "category_avg") {
    // Average price by property category
    const { data: rows } = await supabase.rpc("stats_price_by_category", {
      p_city: city ?? null,
    });
    data = rows;
  } else if (type === "summary") {
    // Overall market summary counts + avg price
    const { data: rows } = await supabase.rpc("stats_market_summary");
    data = rows;
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json(
    { type, data },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
