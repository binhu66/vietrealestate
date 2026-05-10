// Markdown rendering of a single listing — AI-optimized.
// LLMs parse Markdown faster than HTML with ~80% fewer tokens.
// Linked from llms.txt and OpenAPI spec.
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import { formatPrice } from "@/lib/data";

export const runtime = "edge";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://binhorizon.com";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return new NextResponse("Invalid listing ID", { status: 400 });
  }

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .eq("standard_status", "Active")
    .single();

  if (error || !data) {
    return new NextResponse("Listing not found", { status: 404 });
  }

  const p = dbToProperty(data as unknown as DbListing);
  const url = `${BASE_URL}/bat-dong-san/${p.id}`;
  const txType = p.type === "ban" ? "For Sale" : "For Rent";

  const md = `# ${p.title}

**Type:** ${txType} · ${p.category}
**Price:** ${formatPrice(p.price, p.priceUnit)} (${p.price.toLocaleString()} ${p.priceUnit} VND)
**Area:** ${p.area} m²${p.bedrooms ? ` · **Bedrooms:** ${p.bedrooms}` : ""}${p.bathrooms ? ` · **Bathrooms:** ${p.bathrooms}` : ""}

## Location

- **Address:** ${p.address || "—"}
- **District:** ${p.district || "—"}
- **City / Province:** ${p.city || "—"}
${p.lat && p.lng ? `- **Coordinates:** ${p.lat}, ${p.lng} ([map](https://maps.google.com/?q=${p.lat},${p.lng}))` : ""}

## Description

${p.description || "_No description_"}

## Contact

- **Name:** ${p.contactName || "—"}
- **Phone:** ${p.contactPhone || "—"}

## Metadata

- **Listing ID:** \`${p.id}\`
- **Posted:** ${p.postedAt}
- **Web URL:** ${url}
- **JSON API:** ${BASE_URL}/api/listings?q=${encodeURIComponent(p.title)}
- **Source:** BinHorizon Vietnam Real Estate Marketplace

---
_AI-optimized Markdown view of a real-estate listing on [BinHorizon.com](${BASE_URL}). For interactive viewing with photos, visit [the listing page](${url})._
`;

  return new NextResponse(md, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",  // prevent duplicate-content vs HTML detail page
      "Link": `<${url}>; rel="canonical"`,
    },
  });
}
