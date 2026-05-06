import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://vietrealty.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Welcome all bots including AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/geocode", "/api/mapbox-token", "/_next/"],
      },
      // Explicitly allow major AI crawlers for AI-friendly indexing
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "omgili", allow: "/" },
      { userAgent: "FacebookExternalHit", allow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
