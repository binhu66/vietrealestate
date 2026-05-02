import type { MetadataRoute } from "next";
import { properties } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://vietrealty.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/bat-dong-san`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/cho-thue`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/thuong-mai`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/ban-do`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/tin-tuc`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
  ];

  const listingPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE_URL}/bat-dong-san/${p.id}`,
    lastModified: new Date(p.postedAt),
    changeFrequency: "weekly" as const,
    priority: p.isVip ? 0.9 : 0.8,
  }));

  return [...staticPages, ...listingPages];
}
