import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "missing address" }, { status: 400 });
  }

  // Try Nominatim (OpenStreetMap) — no API key required
  try {
    const query = encodeURIComponent(address + ", Vietnam");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=vn`,
      {
        headers: {
          "User-Agent": "VietRealty/1.0 (condosmore66@gmail.com)",
          "Accept-Language": "vi,en",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "geocode failed" }, { status: 502 });
    }

    const data = await res.json();
    if (!data.length) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json({
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      display_name: data[0].display_name,
    });
  } catch {
    return NextResponse.json({ error: "geocode error" }, { status: 500 });
  }
}
