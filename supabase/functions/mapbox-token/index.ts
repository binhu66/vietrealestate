import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const secretToken = Deno.env.get("MAPBOX_SECRET_TOKEN");
  const username    = Deno.env.get("MAPBOX_USERNAME");

  if (!secretToken || !username) {
    return new Response(JSON.stringify({ error: "Mapbox env vars not set" }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Expires 1 hour from now
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const res = await fetch(
    `https://api.mapbox.com/tokens/v2/${username}?access_token=${secretToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expires,
        scopes: ["styles:tiles", "styles:read", "fonts:read", "datasets:read"],
        note: "vietrealestate-temp",
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), {
      status: 502, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const data = await res.json();
  return new Response(
    JSON.stringify({ token: data.token, expires }),
    { headers: { ...CORS, "Content-Type": "application/json" } }
  );
});
