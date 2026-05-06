import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { properties, formatPrice } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import type { Property } from "@/lib/data";
import PropertyDetailClient from "./PropertyDetailClient";

export const runtime = "edge";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://binhorizon.com";

// UUID pattern check
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchProperty(id: string): Promise<Property | null> {
  // UUID → fetch from Supabase
  if (UUID_RE.test(id)) {
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("id", id)
      .eq("standard_status", "Active")
      .single();
    if (error || !data) return null;
    return dbToProperty(data as unknown as DbListing);
  }
  // numeric string → hardcoded fallback
  return properties.find((p) => p.id === id) ?? null;
}

async function fetchSimilar(property: Property): Promise<Property[]> {
  if (UUID_RE.test(property.id)) {
    // Map category slug → property_type
    const categoryToType: Record<string, string> = {
      "can-ho-chung-cu": "apartment",
      "nha-rieng": "house",
      "nha-biet-thu": "villa",
      "dat-nen": "land",
      "mat-bang": "commercial",
      "kho-xuong": "warehouse",
      "van-phong": "office",
    };
    const pt = categoryToType[property.category] ?? "apartment";
    const { data } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("standard_status", "Active")
      .eq("property_type", pt)
      .neq("id", property.id)
      .order("vip_level", { ascending: false })
      .limit(4);
    if (data && data.length > 0) return (data as unknown as DbListing[]).map(dbToProperty);
  }
  return properties
    .filter((p) => p.id !== property.id && p.category === property.category)
    .slice(0, 4);
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const p = await fetchProperty(id);
  if (!p) return { title: "Không tìm thấy - BinHorizon" };

  const price = formatPrice(p.price, p.priceUnit);
  const description = `${p.type === "ban" ? "Bán" : "Cho thuê"} ${p.area}m² tại ${p.district}, ${p.city}. Giá ${price}. ${p.description?.slice(0, 120)}`;

  return {
    title: `${p.title} | BinHorizon`,
    description,
    openGraph: {
      title: p.title,
      description,
      url: `${BASE_URL}/bat-dong-san/${p.id}`,
      siteName: "BinHorizon",
      images: p.images[0] ? [{ url: p.images[0], width: 1200, height: 630, alt: p.title }] : [],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description,
      images: p.images[0] ? [p.images[0]] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/bat-dong-san/${p.id}`,
    },
  };
}

export default async function PropertyDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = await fetchProperty(id);
  if (!property) notFound();

  const similar = await fetchSimilar(property);

  const priceVnd =
    property.priceUnit === "ty" ? property.price * 1_000_000_000
    : property.priceUnit === "trieu" ? property.price * 1_000_000
    : property.priceUnit === "trieu/thang" ? property.price * 1_000_000
    : property.price * 1_000;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${BASE_URL}/bat-dong-san/${property.id}`,
    name: property.title,
    description: property.description,
    url: `${BASE_URL}/bat-dong-san/${property.id}`,
    image: property.images,
    datePosted: property.postedAt,
    floorSize: { "@type": "QuantitativeValue", value: property.area, unitCode: "MTK" },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.district,
      addressRegion: property.city,
      addressCountry: "VN",
    },
    ...(property.lat && property.lng ? {
      geo: { "@type": "GeoCoordinates", latitude: property.lat, longitude: property.lng },
    } : {}),
    offers: {
      "@type": "Offer",
      price: priceVnd,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
    seller: {
      "@type": "Person",
      name: property.contactName,
      telephone: property.contactPhone,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailClient property={property} similar={similar} />
    </>
  );
}
