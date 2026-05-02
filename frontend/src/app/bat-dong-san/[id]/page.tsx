import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { properties, formatPrice } from "@/lib/data";
import PropertyDetailClient from "./PropertyDetailClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://vietrealty.vn";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const p = properties.find((x) => x.id === id);
  if (!p) return { title: "Không tìm thấy - VietRealty" };

  const price = formatPrice(p.price, p.priceUnit);
  const description = `${p.type === "ban" ? "Bán" : "Cho thuê"} ${p.area}m² tại ${p.district}, ${p.city}. Giá ${price}. ${p.description?.slice(0, 120)}`;

  return {
    title: `${p.title} | VietRealty`,
    description,
    openGraph: {
      title: p.title,
      description,
      url: `${BASE_URL}/bat-dong-san/${p.id}`,
      siteName: "VietRealty",
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
    other: {
      "og:price:amount": String(p.price),
      "og:price:currency": "VND",
    },
  };
}

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default async function PropertyDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  if (!property) notFound();

  const similar = properties
    .filter((p) => p.id !== property.id && p.category === property.category)
    .slice(0, 4);

  // JSON-LD structured data for Google + AI crawlers
  const priceVnd = property.price * (
    property.priceUnit === "ty" ? 1_000_000_000
    : property.priceUnit === "trieu" ? 1_000_000
    : property.priceUnit === "trieu/thang" ? 1_000_000
    : 1_000
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${BASE_URL}/bat-dong-san/${property.id}`,
    "name": property.title,
    "description": property.description,
    "url": `${BASE_URL}/bat-dong-san/${property.id}`,
    "image": property.images,
    "datePosted": property.postedAt,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK",
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.district,
      "addressRegion": property.city,
      "addressCountry": "VN",
    },
    ...(property.lat && property.lng ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": property.lat,
        "longitude": property.lng,
      }
    } : {}),
    "offers": {
      "@type": "Offer",
      "price": priceVnd,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
    },
    "seller": {
      "@type": "Person",
      "name": property.contactName,
      "telephone": property.contactPhone,
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
