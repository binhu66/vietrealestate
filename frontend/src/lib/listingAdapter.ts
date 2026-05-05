import type { Property, Category, PropertyType } from "./data";

// Supabase DB row (columns we SELECT)
export interface DbListing {
  id: string;
  transaction_type: string;
  property_type: string;
  standard_status: string;
  vip_level: number;
  list_price: number;
  building_area_total: number | null;
  land_area: number | null;
  bedrooms_total: number | null;
  bathrooms_total: number | null;
  floor_number: number | null;
  floors_total: number | null;
  direction_faces: string | null;
  tinh_thanh: string;
  quan_huyen: string | null;
  phuong_xa: string | null;
  duong: string | null;
  so_nha: string | null;
  unparsed_address: string | null;
  project_name: string | null;
  lat: number | null;
  lng: number | null;
  phap_ly: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  public_remarks: string | null;
  public_remarks_en: string | null;
  public_remarks_zh: string | null;
  title: string | null;
  title_en: string | null;
  title_zh: string | null;
  cover_image: string | null;
  views: number;
  original_entry_timestamp: string;
  listing_media?: { url: string; sort_order: number }[];
}

const PROPERTY_TYPE_TO_CATEGORY: Record<string, Category> = {
  apartment: "can-ho-chung-cu",
  house: "nha-rieng",
  villa: "nha-biet-thu",
  land: "dat-nen",
  commercial: "mat-bang",
  warehouse: "kho-xuong",
  office: "van-phong",
  other: "can-ho-chung-cu",
};

const PHAP_LY_LABEL: Record<string, string> = {
  so_do: "Sổ đỏ",
  so_hong: "Sổ hồng",
  hop_dong: "Hợp đồng",
  other: "Khác",
};

function convertPrice(
  listPrice: number,
  transactionType: string
): { price: number; priceUnit: Property["priceUnit"] } {
  if (transactionType === "For Sale") {
    if (listPrice >= 1_000_000_000)
      return { price: +(listPrice / 1_000_000_000).toFixed(2), priceUnit: "ty" };
    return { price: +(listPrice / 1_000_000).toFixed(0), priceUnit: "trieu" };
  }
  // For Rent
  if (listPrice >= 1_000_000)
    return { price: +(listPrice / 1_000_000).toFixed(0), priceUnit: "trieu/thang" };
  return { price: +(listPrice / 1_000).toFixed(0), priceUnit: "nghin/thang" };
}

export function dbToProperty(row: DbListing): Property {
  const { price, priceUnit } = convertPrice(row.list_price, row.transaction_type);
  const area = row.building_area_total ?? row.land_area ?? 0;

  const images: string[] = [];
  if (row.listing_media && row.listing_media.length > 0) {
    images.push(
      ...row.listing_media
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((m) => m.url)
    );
  } else if (row.cover_image) {
    images.push(row.cover_image);
  }

  const district = row.quan_huyen ?? "";
  const address =
    row.unparsed_address ??
    [row.so_nha, row.duong, row.phuong_xa, district].filter(Boolean).join(", ");

  return {
    id: row.id,
    title: row.title ?? address,
    titleEn: row.title_en ?? undefined,
    titleZh: row.title_zh ?? undefined,
    price,
    priceUnit,
    area,
    bedrooms: row.bedrooms_total ?? undefined,
    bathrooms: row.bathrooms_total ?? undefined,
    address,
    district,
    city: row.tinh_thanh,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    category: PROPERTY_TYPE_TO_CATEGORY[row.property_type] ?? "can-ho-chung-cu",
    type: row.transaction_type === "For Sale" ? "ban" : "thue" as PropertyType,
    images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    description: row.public_remarks ?? "",
    postedAt: row.original_entry_timestamp.slice(0, 10),
    contactName: row.contact_name ?? "",
    contactPhone: row.contact_phone ?? "",
    isVip: row.vip_level > 0,
    floor: row.floor_number ?? undefined,
    direction: row.direction_faces ?? undefined,
    legalStatus: row.phap_ly ? (PHAP_LY_LABEL[row.phap_ly] ?? row.phap_ly) : undefined,
    views: row.views,
    status: "active",
  };
}

// Columns to SELECT in queries (avoids fetching heavy fields like tsvector)
export const LISTING_SELECT = `
  id, transaction_type, property_type, standard_status, vip_level,
  list_price, building_area_total, land_area, bedrooms_total, bathrooms_total,
  floor_number, floors_total, direction_faces,
  tinh_thanh, quan_huyen, phuong_xa, duong, so_nha, unparsed_address, project_name,
  lat, lng, phap_ly,
  contact_name, contact_phone,
  public_remarks, public_remarks_en, public_remarks_zh,
  title, title_en, title_zh,
  cover_image, views, original_entry_timestamp,
  listing_media(url, sort_order)
`.trim();
