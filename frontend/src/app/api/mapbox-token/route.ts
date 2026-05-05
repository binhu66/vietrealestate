import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const secretToken = process.env.MAPBOX_SECRET_TOKEN;
  const username    = process.env.MAPBOX_USERNAME;

  if (!secretToken || !username) {
    return NextResponse.json({ error: "Mapbox env vars not set" }, { status: 500 });
  }

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
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({ token: data.token, expires });
}
