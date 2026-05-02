export type PropertyType = "ban" | "thue";
export type Category =
  | "can-ho-chung-cu"
  | "nha-rieng"
  | "nha-biet-thu"
  | "dat-nen"
  | "van-phong"
  | "mat-bang"
  | "kho-xuong"
  | "khach-san";

export interface Property {
  id: string;
  title: string;
  titleEn?: string;
  titleZh?: string;
  price: number;
  priceUnit: "ty" | "trieu" | "trieu/thang" | "nghin/thang";
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
  category: Category;
  type: PropertyType;
  images: string[];
  description: string;
  postedAt: string;
  contactName: string;
  contactPhone: string;
  isVip: boolean;
  floor?: number;
  direction?: string;
  legalStatus?: string;
  views?: number;
  status?: "active" | "deleted";
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Căn hộ 2PN full nội thất cao cấp Vinhomes Central Park",
    titleEn: "2BR Luxury Apartment at Vinhomes Central Park",
    titleZh: "Vinhomes中央公园豪华两居室公寓",
    price: 5.2,
    priceUnit: "ty",
    area: 72,
    bedrooms: 2,
    bathrooms: 2,
    address: "200 Nguyễn Hữu Cảnh, Phường 22",
    district: "Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    lat: 10.7958,
    lng: 106.7218,
    category: "can-ho-chung-cu",
    type: "ban",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    description: "Căn hộ 2 phòng ngủ view sông Sài Gòn, full nội thất cao cấp, tầng cao thoáng mát. Tiện ích đẳng cấp 5 sao: hồ bơi, gym, spa, công viên xanh rộng lớn.",
    postedAt: "2026-04-28",
    contactName: "Minh Tuấn",
    contactPhone: "0901234567",
    isVip: true,
    floor: 25,
    direction: "Đông Nam",
    legalStatus: "Sổ hồng",
    views: 1240,
  },
  {
    id: "2",
    title: "Nhà riêng 3 tầng mặt tiền đường Lê Văn Sỹ, quận 3",
    titleEn: "3-Story Townhouse on Le Van Sy Street, District 3",
    titleZh: "第3区黎文仕街三层独栋住宅",
    price: 12.5,
    priceUnit: "ty",
    area: 55,
    bedrooms: 4,
    bathrooms: 3,
    address: "125 Lê Văn Sỹ, Phường 13",
    district: "Quận 3",
    city: "TP. Hồ Chí Minh",
    lat: 10.7818,
    lng: 106.6830,
    category: "nha-rieng",
    type: "ban",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
    ],
    description: "Nhà mặt tiền kinh doanh sầm uất, 3 tầng, khu vực trung tâm quận 3. Phù hợp để ở kết hợp kinh doanh. Sổ hồng chính chủ.",
    postedAt: "2026-04-27",
    contactName: "Thu Hương",
    contactPhone: "0912345678",
    isVip: true,
    floor: 3,
    direction: "Tây",
    legalStatus: "Sổ hồng",
    views: 890,
  },
  {
    id: "3",
    title: "Biệt thự song lập khu đô thị Phú Mỹ Hưng, quận 7",
    titleEn: "Semi-detached Villa at Phu My Hung, District 7",
    titleZh: "第7区富美兴城区联排别墅",
    price: 28,
    priceUnit: "ty",
    area: 280,
    bedrooms: 5,
    bathrooms: 4,
    address: "Đường Bùi Bằng Đoàn, Phú Mỹ Hưng",
    district: "Quận 7",
    city: "TP. Hồ Chí Minh",
    lat: 10.7268,
    lng: 106.7021,
    category: "nha-biet-thu",
    type: "ban",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    description: "Biệt thự song lập đẳng cấp khu đô thị Phú Mỹ Hưng, không gian sống xanh, yên tĩnh. Thiết kế hiện đại, nội thất nhập khẩu cao cấp.",
    postedAt: "2026-04-25",
    contactName: "Phú Hào",
    contactPhone: "0987654321",
    isVip: true,
    floor: 3,
    direction: "Nam",
    legalStatus: "Sổ hồng",
    views: 2100,
  },
  {
    id: "4",
    title: "Đất nền dự án KDC Đức Hòa, Long An - Giá đầu tư",
    titleEn: "Residential Land Plot - Duc Hoa Township, Long An",
    titleZh: "龙安省德和住宅区地块",
    price: 850,
    priceUnit: "trieu",
    area: 100,
    address: "Đường DH9, KDC Đức Hòa",
    district: "Đức Hòa",
    city: "Long An",
    lat: 10.8045,
    lng: 106.5612,
    category: "dat-nen",
    type: "ban",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800",
    ],
    description: "Đất nền phân lô sổ đỏ từng nền, nằm trong KDC Đức Hòa đang phát triển mạnh. Hạ tầng hoàn thiện, điện nước đầy đủ.",
    postedAt: "2026-04-26",
    contactName: "Văn Long",
    contactPhone: "0934567890",
    isVip: false,
    legalStatus: "Sổ đỏ",
    views: 540,
  },
  {
    id: "5",
    title: "Cho thuê căn hộ 1PN Studio Masteri Thảo Điền",
    titleEn: "Studio Apartment for Rent - Masteri Thao Dien",
    titleZh: "Masteri草田单间公寓出租",
    price: 12,
    priceUnit: "trieu/thang",
    area: 45,
    bedrooms: 1,
    bathrooms: 1,
    address: "159 Xa Lộ Hà Nội, Thảo Điền",
    district: "Thủ Đức",
    city: "TP. Hồ Chí Minh",
    lat: 10.8016,
    lng: 106.7313,
    category: "can-ho-chung-cu",
    type: "thue",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    description: "Cho thuê căn studio tại Masteri Thảo Điền, view hồ bơi. Nội thất cơ bản đầy đủ: máy lạnh, tủ lạnh, máy giặt. Thoáng mát, yên tĩnh.",
    postedAt: "2026-04-29",
    contactName: "Lan Anh",
    contactPhone: "0923456789",
    isVip: false,
    floor: 18,
    direction: "Bắc",
    legalStatus: "Sổ hồng",
    views: 310,
  },
  {
    id: "6",
    title: "Cho thuê văn phòng đường Đinh Tiên Hoàng, quận 1",
    titleEn: "Office Space for Rent - Dinh Tien Hoang, District 1",
    titleZh: "第1区丁先皇街办公室出租",
    price: 35,
    priceUnit: "trieu/thang",
    area: 120,
    address: "45 Đinh Tiên Hoàng, Phường Đa Kao",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    lat: 10.7858,
    lng: 106.6979,
    category: "van-phong",
    type: "thue",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366754035-f200968a7eda?w=800",
    ],
    description: "Văn phòng cho thuê trung tâm quận 1, view đẹp, an ninh 24/7. Sàn mở rộng thoáng, phù hợp 15-20 nhân viên.",
    postedAt: "2026-04-24",
    contactName: "Quốc Bảo",
    contactPhone: "0945678901",
    isVip: false,
    floor: 7,
    direction: "Đông",
    legalStatus: "Hợp đồng",
    views: 720,
  },
  {
    id: "7",
    title: "Căn hộ 3PN Sunrise City View, quận 7 - full nội thất",
    titleEn: "3BR Sunrise City View Apartment - Fully Furnished",
    titleZh: "第7区日出城景观三居室全装修公寓",
    price: 7.8,
    priceUnit: "ty",
    area: 108,
    bedrooms: 3,
    bathrooms: 2,
    address: "25 Nguyễn Hữu Thọ, Phường Tân Hưng",
    district: "Quận 7",
    city: "TP. Hồ Chí Minh",
    lat: 10.7368,
    lng: 106.6989,
    category: "can-ho-chung-cu",
    type: "ban",
    images: [
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    ],
    description: "Căn hộ 3PN cao cấp Sunrise City View, tầng 30 view sông Sài Gòn. Full nội thất nhập khẩu, sổ hồng chính chủ.",
    postedAt: "2026-04-23",
    contactName: "Bảo Ngọc",
    contactPhone: "0956789012",
    isVip: true,
    floor: 30,
    direction: "Đông Nam",
    legalStatus: "Sổ hồng",
    views: 1580,
  },
  {
    id: "8",
    title: "Mặt bằng kinh doanh quận Bình Thạnh, 200m2",
    titleEn: "200sqm Commercial Space for Rent - Binh Thanh",
    titleZh: "平盛区200平方米商铺出租",
    price: 45,
    priceUnit: "trieu/thang",
    area: 200,
    address: "388 Xô Viết Nghệ Tĩnh, Phường 25",
    district: "Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    lat: 10.8101,
    lng: 106.7105,
    category: "mat-bang",
    type: "thue",
    images: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
    ],
    description: "Mặt bằng kinh doanh đường lớn sầm uất, vỉa hè rộng, phù hợp nhà hàng, showroom, siêu thị mini.",
    postedAt: "2026-04-22",
    contactName: "Trọng Tín",
    contactPhone: "0967890123",
    isVip: false,
    floor: 1,
    direction: "Nam",
    legalStatus: "Hợp đồng",
    views: 430,
  },
  {
    id: "9",
    title: "Kho xưởng cho thuê KCN Bình Dương, 1000m2",
    titleEn: "1000sqm Warehouse for Rent - Binh Duong Industrial Zone",
    titleZh: "平阳工业区1000平方米仓库出租",
    price: 80,
    priceUnit: "trieu/thang",
    area: 1000,
    address: "KCN Việt Nam - Singapore, Thuận An",
    district: "Thuận An",
    city: "Bình Dương",
    lat: 10.8892,
    lng: 106.6982,
    category: "kho-xuong",
    type: "thue",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    ],
    description: "Kho xưởng tiêu chuẩn trong KCN Việt Nam - Singapore, hệ thống PCCC hiện đại, xe container vào được.",
    postedAt: "2026-04-20",
    contactName: "Hùng Cường",
    contactPhone: "0978901234",
    isVip: false,
    legalStatus: "Hợp đồng",
    views: 680,
  },
  {
    id: "10",
    title: "Khách sạn 3 sao quận 1 - 40 phòng đang hoạt động",
    titleEn: "3-Star Hotel for Sale in District 1 - 40 Rooms",
    titleZh: "第1区三星级酒店出售 - 40间客房",
    price: 65,
    priceUnit: "ty",
    area: 350,
    bedrooms: 40,
    bathrooms: 42,
    address: "88 Bùi Thị Xuân, Phường Phạm Ngũ Lão",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    lat: 10.7695,
    lng: 106.6958,
    category: "khach-san",
    type: "ban",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    ],
    description: "Khách sạn 3 sao trung tâm quận 1, đang vận hành tốt, doanh thu ổn định. Gần phố Tây Bùi Viện. Pháp lý đầy đủ.",
    postedAt: "2026-04-18",
    contactName: "Thanh Phong",
    contactPhone: "0989012345",
    isVip: true,
    floor: 8,
    direction: "Đông",
    legalStatus: "Sổ hồng",
    views: 3200,
  },
];

export const categories = [
  { id: "can-ho-chung-cu", label: "Căn hộ chung cư", icon: "🏢", labelEn: "Apartment", labelZh: "公寓" },
  { id: "nha-rieng", label: "Nhà riêng", icon: "🏠", labelEn: "House", labelZh: "住宅" },
  { id: "nha-biet-thu", label: "Nhà biệt thự", icon: "🏰", labelEn: "Villa", labelZh: "别墅" },
  { id: "dat-nen", label: "Đất nền", icon: "🌿", labelEn: "Land Plot", labelZh: "土地" },
  { id: "van-phong", label: "Văn phòng", icon: "🏗️", labelEn: "Office", labelZh: "办公室" },
  { id: "mat-bang", label: "Mặt bằng", icon: "🏪", labelEn: "Retail Space", labelZh: "商铺" },
  { id: "kho-xuong", label: "Kho, xưởng", icon: "🏭", labelEn: "Warehouse", labelZh: "仓库" },
  { id: "khach-san", label: "Khách sạn", icon: "🏨", labelEn: "Hotel", labelZh: "酒店" },
];

export const cities = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Bình Dương",
  "Đồng Nai",
  "Long An",
];

export function formatPrice(price: number, unit: string): string {
  if (unit === "ty") return `${price} tỷ`;
  if (unit === "trieu") return `${price} triệu`;
  if (unit === "trieu/thang") return `${price} triệu/tháng`;
  if (unit === "nghin/thang") return `${price}k/tháng`;
  return `${price}`;
}
