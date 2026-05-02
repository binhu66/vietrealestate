// Vietnam Digital Address System
// Hierarchy: Tỉnh/TP → Quận/Huyện → Phường/Xã → Đường → Số nhà
// Supports: GPS Coordinates, Plus Codes, Postal Codes

export interface VietnamAddress {
  soNha?: string;          // House/building number
  duong?: string;          // Street name
  phuong?: string;         // Ward (Phường/Xã/Thị trấn)
  quan?: string;           // District (Quận/Huyện/TP trực thuộc)
  tinh: string;            // Province/City
  maBuuChinh?: string;     // Postal code (5 digits)
  toaDo?: { lat: number; lng: number };
  plusCode?: string;       // Google Open Location Code e.g. "7P28+QJ"
}

// Vietnam Postal Codes by major cities
export const postalCodes: Record<string, string> = {
  "Quận 1": "70000",
  "Quận 2": "70100",
  "Quận 3": "70000",
  "Quận 4": "70400",
  "Quận 5": "70500",
  "Quận 6": "70600",
  "Quận 7": "70700",
  "Quận 8": "70800",
  "Quận 9": "70900",
  "Quận 10": "71000",
  "Quận 11": "71100",
  "Quận 12": "71200",
  "Bình Thạnh": "71500",
  "Gò Vấp": "71600",
  "Phú Nhuận": "72000",
  "Tân Bình": "72000",
  "Tân Phú": "72000",
  "Bình Tân": "76000",
  "Thủ Đức": "71300",
  "Hà Đông": "10000",
  "Hoàn Kiếm": "10000",
  "Ba Đình": "11000",
  "Đống Đa": "11500",
  "Cầu Giấy": "11307",
  "Thuận An": "75000",
  "Đức Hòa": "82000",
};

// Format full address Vietnamese style
export function formatAddress(addr: VietnamAddress): string {
  const parts = [
    addr.soNha,
    addr.duong,
    addr.phuong ? `${addr.phuong}` : undefined,
    addr.quan,
    addr.tinh,
  ].filter(Boolean);
  return parts.join(", ");
}

// Administrative divisions for major provinces
export const vietNamAdmin: Record<string, Record<string, string[]>> = {
  "TP. Hồ Chí Minh": {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Đa Kao", "Phường Nguyễn Cư Trinh"],
    "Quận 3": ["Phường 1", "Phường 2", "Phường 3", "Phường Võ Thị Sáu", "Phường 13"],
    "Quận 7": ["Phường Tân Hưng", "Phường Phú Mỹ", "Phường Tân Phú", "Phường Bình Thuận"],
    "Bình Thạnh": ["Phường 1", "Phường 11", "Phường 12", "Phường 22", "Phường 25", "Phường 26"],
    "Thủ Đức": ["Phường Linh Chiểu", "Phường Thảo Điền", "Phường Long Bình", "Phường Trường Thọ"],
    "Gò Vấp": ["Phường 1", "Phường 3", "Phường 12", "Phường 16"],
    "Tân Bình": ["Phường 1", "Phường 4", "Phường 9", "Phường 15"],
  },
  "Hà Nội": {
    "Hoàn Kiếm": ["Phường Hàng Bài", "Phường Hàng Gai", "Phường Tràng Tiền"],
    "Ba Đình": ["Phường Cống Vị", "Phường Điện Biên", "Phường Ngọc Hà"],
    "Đống Đa": ["Phường Văn Miếu", "Phường Phương Liên", "Phường Nam Đồng"],
    "Cầu Giấy": ["Phường Dịch Vọng", "Phường Trung Hòa", "Phường Yên Hòa"],
    "Hà Đông": ["Phường Mộ Lao", "Phường Phúc La", "Phường Văn Quán"],
  },
  "Đà Nẵng": {
    "Hải Châu": ["Phường Hải Châu 1", "Phường Hải Châu 2", "Phường Thanh Bình"],
    "Ngũ Hành Sơn": ["Phường Mỹ An", "Phường Khuê Mỹ", "Phường Hòa Hải"],
    "Sơn Trà": ["Phường An Hải Bắc", "Phường An Hải Đông", "Phường Mân Thái"],
  },
  "Bình Dương": {
    "Thuận An": ["Phường An Phú", "Phường Bình Hòa", "Phường Vĩnh Phú"],
    "Dĩ An": ["Phường Dĩ An", "Phường Đông Hòa", "Phường An Bình"],
    "Thủ Dầu Một": ["Phường Phú Cường", "Phường Chánh Mỹ", "Phường Hiệp Thành"],
  },
};
