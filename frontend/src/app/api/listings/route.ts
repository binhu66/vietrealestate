import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// Public JSON API for AI crawlers and third-party integrations
// GET /api/listings?type=ban|thue&category=...&city=...&q=...&limit=20&offset=0
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type     = searchParams.get("type");     // ban | thue
  const category = searchParams.get("category"); // can-ho-chung-cu | nha-rieng | ...
  const city     = searchParams.get("city");
  const q        = searchParams.get("q");        // full-text search query
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
  const offset   = parseInt(searchParams.get("offset") ?? "0");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("listings")
    .select(`
      id, transaction_type, property_type, category,
      list_price, building_area_total, land_area,
      bedrooms_total, bathrooms_total, floor_number, direction_faces,
      tinh_thanh, quan_huyen, unparsed_address,
      lat, lng, phap_ly,
      title, cover_image, views,
      original_entry_timestamp, vip_level,
      contact_name, contact_phone
    `, { count: "exact" })
    .eq("standard_status", "Active")
    .order("vip_level", { ascending: false })
    .order("original_entry_timestamp", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type === "ban")  query = query.eq("transaction_type", "For Sale");
  if (type === "thue") query = query.eq("transaction_type", "For Rent");
  if (category)        query = query.eq("category", category);
  if (city)            query = query.eq("tinh_thanh", city);
  if (q)               query = query.textSearch("search_vector", q, { type: "websearch", config: "simple" });

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      total: count,
      offset,
      limit,
      listings: data,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "noindex",
      },
    }
  );
}
