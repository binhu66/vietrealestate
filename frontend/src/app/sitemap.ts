import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://binhorizon.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                            lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${BASE_URL}/bat-dong-san`,          lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/cho-thue`,              lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/thuong-mai`,            lastModified: new Date(), changeFrequency: "daily",  priority: 0.7 },
    { url: `${BASE_URL}/ban-do`,                lastModified: new Date(), changeFrequency: "daily",  priority: 0.7 },
    { url: `${BASE_URL}/tin-tuc`,               lastModified: new Date(), changeFrequency: "daily",  priority: 0.6 },
    { url: `${BASE_URL}/moi-gioi`,              lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  // Fetch real listing IDs from Supabase
  let listingPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("listings")
      .select("id, original_entry_timestamp, vip_level")
      .eq("standard_status", "Active")
      .order("original_entry_timestamp", { ascending: false })
      .limit(10000);

    if (data) {
      listingPages = data.map((row) => ({
        url: `${BASE_URL}/bat-dong-san/${row.id}`,
        lastModified: new Date(row.original_entry_timestamp),
        changeFrequency: "weekly" as const,
        priority: row.vip_level > 0 ? 0.9 : 0.8,
      }));
    }
  } catch {
    // Sitemap still works without listings
  }

  return [...staticPages, ...listingPages];
}
