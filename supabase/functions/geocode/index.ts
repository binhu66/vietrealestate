import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizeAddress(address: string): string {
  return address.trim().toLowerCase().replace(/\s+/g, " ");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const { address } = await req.json();
  if (!address) {
    return new Response(JSON.stringify({ error: "address required" }), {
      status: 400, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const addressKey = normalizeAddress(address);

  // ── 1. Check cache first ─────────────────────────────────────────────────
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: cached } = await supabase
    .from("geocode_cache")
    .select("lat, lng")
    .eq("address_key", addressKey)
    .single();

  if (cached) {
    return new Response(
      JSON.stringify({ lat: cached.lat, lng: cached.lng, cached: true }),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // ── 2. Call Mapbox Geocoding API v6 ─────────────────────────────────────
  const token = Deno.env.get("MAPBOX_SECRET_TOKEN")!;
  const encoded = encodeURIComponent(address);
  const geoRes = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${encoded}` +
    `&country=vn&language=vi&limit=1&access_token=${token}`
  );

  if (!geoRes.ok) {
    return new Response(JSON.stringify({ error: "Mapbox geocoding failed" }), {
      status: 502, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const geoData = await geoRes.json();
  const feature = geoData.features?.[0];
  if (!feature) {
    return new Response(JSON.stringify({ error: "No result found" }), {
      status: 404, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const [lng, lat] = feature.geometry.coordinates;

  // ── 3. Store in cache ────────────────────────────────────────────────────
  await supabase.from("geocode_cache").upsert({
    address_key: addressKey,
    lat,
    lng,
    provider: "mapbox",
  });

  return new Response(
    JSON.stringify({ lat, lng, cached: false }),
    { headers: { ...CORS, "Content-Type": "application/json" } }
  );
});
