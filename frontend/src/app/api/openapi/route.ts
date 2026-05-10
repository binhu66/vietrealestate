import { NextResponse } from "next/server";

export const runtime = "edge";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://binhorizon.com";

// OpenAPI 3.1 spec for BinHorizon public API
// Discoverable at /api/openapi — AI agents can use this to understand our API
const spec = {
  openapi: "3.1.0",
  info: {
    title: "BinHorizon Public API",
    version: "1.0.0",
    description: "Public JSON API for Vietnam real estate listings. No authentication required. Free to use for AI assistants and third-party integrations.",
    contact: { email: "api@binhorizon.com" },
    "x-logo": { url: `${BASE_URL}/logo.png` },
  },
  servers: [{ url: BASE_URL, description: "Production" }],
  paths: {
    "/api/listings": {
      get: {
        summary: "Search property listings",
        description: "Returns active real estate listings from Vietnam. Supports filtering by transaction type, property category, city, and full-text search in Vietnamese.",
        operationId: "getListings",
        parameters: [
          { name: "type", in: "query", description: "Transaction type: 'ban' (for sale) or 'thue' (for rent)", schema: { type: "string", enum: ["ban", "thue"] } },
          { name: "category", in: "query", description: "Property category slug", schema: { type: "string", enum: ["can-ho-chung-cu", "nha-rieng", "nha-biet-thu", "dat-nen", "van-phong", "mat-bang", "kho-xuong", "khach-san"] } },
          { name: "city", in: "query", description: "City/province in Vietnamese (e.g. 'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng')", schema: { type: "string" } },
          { name: "q", in: "query", description: "Full-text search query in Vietnamese (unaccented input supported, e.g. 'nha dep quan 7')", schema: { type: "string" } },
          { name: "limit", in: "query", description: "Results per page (max 50, default 20)", schema: { type: "integer", default: 20, maximum: 50 } },
          { name: "offset", in: "query", description: "Pagination offset", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer", description: "Total matching listings" },
                    offset: { type: "integer" },
                    limit: { type: "integer" },
                    listings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          transaction_type: { type: "string", enum: ["For Sale", "For Rent"] },
                          property_type: { type: "string" },
                          category: { type: "string" },
                          list_price: { type: "number", description: "Price in VND (Vietnamese Đồng). 1 tỷ = 1,000,000,000 VND ≈ $40,000 USD" },
                          building_area_total: { type: "number", description: "Floor area in m²" },
                          land_area: { type: "number", description: "Land area in m²" },
                          bedrooms_total: { type: "integer" },
                          bathrooms_total: { type: "integer" },
                          floor_number: { type: "integer" },
                          direction_faces: { type: "string", description: "Compass direction (Đông/Tây/Nam/Bắc/etc.)" },
                          tinh_thanh: { type: "string", description: "Province/City" },
                          quan_huyen: { type: "string", description: "District" },
                          unparsed_address: { type: "string" },
                          lat: { type: "number" },
                          lng: { type: "number" },
                          phap_ly: { type: "string", description: "Legal status: sổ đỏ (land cert) or sổ hồng (apartment cert)" },
                          title: { type: "string" },
                          cover_image: { type: "string", format: "uri" },
                          views: { type: "integer" },
                          original_entry_timestamp: { type: "string", format: "date-time" },
                          vip_level: { type: "integer", description: "0=normal, 1-3=VIP (paid promotion)" },
                          contact_name: { type: "string" },
                          contact_phone: { type: "string" },
                        },
                      },
                    },
                  },
                },
                example: {
                  total: 1234,
                  offset: 0,
                  limit: 20,
                  listings: [
                    {
                      id: "uuid-example",
                      transaction_type: "For Sale",
                      category: "can-ho-chung-cu",
                      list_price: 3500000000,
                      building_area_total: 72,
                      bedrooms_total: 2,
                      bathrooms_total: 2,
                      tinh_thanh: "TP. Hồ Chí Minh",
                      quan_huyen: "Quận 7",
                      title: "Căn hộ 2PN view sông Sài Gòn, tầng cao",
                      vip_level: 1,
                    },
                  ],
                },
              },
            },
          },
        },
        "x-ai-hints": {
          priceUnit: "VND. 1 tỷ = 1,000,000,000 VND. Display as 'X tỷ' for billions, 'X triệu' for millions.",
          searchTip: "Vietnamese search supports unaccented input. 'nha quan 7' finds 'Nhà Quận 7'.",
          detailPage: `${BASE_URL}/bat-dong-san/{id}`,
          markdownVersion: `${BASE_URL}/api/listings/md/{id} — same listing as plain Markdown for AI consumption`,
        },
      },
    },
    "/api/listings/md/{id}": {
      get: {
        summary: "Get a single listing as Markdown",
        description: "Returns one property listing as a clean Markdown document — optimized for LLM consumption. Includes title, price, location, full description, contact info.",
        operationId: "getListingMarkdown",
        parameters: [
          { name: "id", in: "path", required: true, description: "Listing UUID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Markdown document",
            content: { "text/markdown": { schema: { type: "string" } } },
          },
          "404": { description: "Listing not found" },
        },
      },
    },
    "/api/news": {
      get: {
        summary: "Get real estate news articles",
        description: "Vietnamese real estate news — market analysis, legal updates, investment guides, and commercial property reports. Categories: Thị trường (Market), Pháp lý (Legal), Đầu tư (Investment), Thương mại (Commercial), Kiến thức (Knowledge).",
        operationId: "getNews",
        parameters: [
          { name: "category", in: "query", description: "News category (Vietnamese, URL-encode)", schema: { type: "string", enum: ["Thị trường", "Pháp lý", "Đầu tư", "Thương mại", "Kiến thức"] } },
          { name: "q", in: "query", description: "Full-text search in article title/excerpt", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 50 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          "200": {
            description: "List of articles",
            content: { "application/json": { schema: {
              type: "object",
              properties: {
                total: { type: "integer" },
                offset: { type: "integer" },
                limit: { type: "integer" },
                articles: { type: "array", items: {
                  type: "object",
                  properties: {
                    id:           { type: "string", format: "uuid" },
                    slug:         { type: "string" },
                    title:        { type: "string" },
                    excerpt:      { type: "string" },
                    category:     { type: "string" },
                    author:       { type: "string" },
                    published_at: { type: "string", format: "date-time" },
                    read_min:     { type: "integer" },
                    image_url:    { type: "string", format: "uri" },
                    source_url:   { type: "string", format: "uri" },
                    views:        { type: "integer" },
                  },
                } },
              },
            } } },
          },
        },
      },
    },
    "/api/stats": {
      get: {
        summary: "Vietnam real estate market statistics",
        description: "Aggregated price/area statistics across the Vietnamese real estate market. Useful for market analysis, valuation comparisons, trend reporting.",
        operationId: "getStats",
        parameters: [
          { name: "type", in: "query", required: true, description: "Stats type", schema: { type: "string", enum: ["summary", "city_avg", "district_avg", "category_avg"] } },
          { name: "city", in: "query", description: "City filter (e.g. 'TP. Hồ Chí Minh') — required when type=district_avg", schema: { type: "string" } },
          { name: "category", in: "query", description: "Category filter for category_avg", schema: { type: "string" } },
          { name: "tx", in: "query", description: "Transaction type filter", schema: { type: "string", enum: ["ban", "thue"] } },
        ],
        responses: {
          "200": {
            description: "Stats object",
            content: { "application/json": { schema: {
              type: "object",
              properties: {
                type: { type: "string" },
                data: { type: "array", items: { type: "object", additionalProperties: true } },
              },
            } } },
          },
        },
        "x-ai-hints": {
          summaryFields: "total_active, total_for_sale, total_for_rent, avg_sale_price (VND), avg_rent_monthly (VND), cities_count, vip_count",
          cityAvg: "Returns avg_price_per_m2 grouped by city — best for nationwide market overview",
        },
      },
    },
    "/api/geocode": {
      get: {
        summary: "Geocode a Vietnamese address",
        description: "Converts a Vietnamese address into latitude/longitude using OpenStreetMap Nominatim. Returns the canonical display name for verification.",
        operationId: "geocodeAddress",
        parameters: [
          { name: "address", in: "query", required: true, description: "Address string in Vietnamese", schema: { type: "string", example: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" } },
        ],
        responses: {
          "200": {
            description: "Coordinates",
            content: { "application/json": { schema: {
              type: "object",
              properties: {
                lat:          { type: "number" },
                lng:          { type: "number" },
                display_name: { type: "string" },
              },
            } } },
          },
          "404": { description: "Address not found" },
        },
      },
    },
  },
  "x-ai-discovery": {
    llmsTxt:    `${BASE_URL}/llms.txt`,
    sitemap:    `${BASE_URL}/sitemap.xml`,
    aiPlugin:   `${BASE_URL}/.well-known/ai-plugin.json`,
    rateLimit:  "60 req/min per IP, no auth required",
    license:    "Public read access. Listing photos copyrighted by their respective sellers.",
  },
};

export function GET() {
  return NextResponse.json(spec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
