import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

function normalizeAddress(addr: string): string {
  return addr.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "missing address" }, { status: 400 });
  }

  const addressKey = normalizeAddress(address);

  // Use service_role key to allow both read and write to geocode_cache
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Check cache first
  const { data: cached } = await supabase
    .from("geocode_cache")
    .select("lat, lng, provider")
    .eq("address_key", addressKey)
    .single();

  if (cached) {
    return NextResponse.json(
      { lat: cached.lat, lng: cached.lng, cached: true },
      { headers: { "Cache-Control": "public, s-maxage=86400" } }
    );
  }

  // 2. Cache miss — call Nominatim (free, no API key)
  try {
    const query = encodeURIComponent(address + ", Vietnam");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=vn`,
      {
        headers: {
          "User-Agent": "BinHorizon/1.0 (condosmore66@gmail.com)",
          "Accept-Language": "vi,en",
        },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "geocode failed" }, { status: 502 });
    }

    const data = await res.json();
    if (!data.length) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    // 3. Store in cache (fire-and-forget, don't block response)
    supabase.from("geocode_cache").upsert({
      address_key: addressKey,
      lat,
      lng,
      provider: "nominatim",
    }, { onConflict: "address_key" }).then(() => {});

    return NextResponse.json(
      { lat, lng, display_name: data[0].display_name, cached: false },
      { headers: { "Cache-Control": "public, s-maxage=86400" } }
    );
  } catch {
    return NextResponse.json({ error: "geocode error" }, { status: 500 });
  }
}
