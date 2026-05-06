"use client";
import { useState } from "react";
import Link from "next/link";
import { Phone, MapPin, Star, Building2, MessageCircle } from "lucide-react";
import { useLocale } from "@/lib/locale";

// Static agent directory — in production this would come from profiles table with role='agent'
const AGENTS = [
  {
    id: "1",
    name: "Minh Tuấn",
    phone: "0901234567",
    area: "TP.HCM - Quận 1, 3, Bình Thạnh",
    specialty: "Căn hộ cao cấp",
    listings: 24,
    rating: 4.9,
    reviews: 87,
    avatar: "MT",
    color: "bg-red-600",
    verified: true,
    years: 8,
  },
  {
    id: "2",
    name: "Thu Hương",
    phone: "0912345678",
    area: "Hà Nội - Cầu Giấy, Nam Từ Liêm",
    specialty: "Nhà riêng & biệt thự",
    listings: 18,
    rating: 4.8,
    reviews: 63,
    avatar: "TH",
    color: "bg-blue-600",
    verified: true,
    years: 5,
  },
  {
    id: "3",
    name: "Phú Hào",
    phone: "0987654321",
    area: "Đà Nẵng - Ngũ Hành Sơn, Sơn Trà",
    specialty: "Đất nền & nghỉ dưỡng",
    listings: 31,
    rating: 4.7,
    reviews: 42,
    avatar: "PH",
    color: "bg-green-600",
    verified: true,
    years: 12,
  },
  {
    id: "4",
    name: "Lan Anh",
    phone: "0923456789",
    area: "TP.HCM - Quận 7, Nhà Bè",
    specialty: "Cho thuê văn phòng",
    listings: 15,
    rating: 4.9,
    reviews: 55,
    avatar: "LA",
    color: "bg-purple-600",
    verified: true,
    years: 6,
  },
  {
    id: "5",
    name: "Quốc Bảo",
    phone: "0945678901",
    area: "TP.HCM - Thủ Đức, Dĩ An",
    specialty: "Căn hộ tầm trung",
    listings: 29,
    rating: 4.6,
    reviews: 38,
    avatar: "QB",
    color: "bg-amber-600",
    verified: false,
    years: 3,
  },
  {
    id: "6",
    name: "Văn Long",
    phone: "0934567890",
    area: "Hà Nội - Hoàn Kiếm, Ba Đình",
    specialty: "Bất động sản thương mại",
    listings: 20,
    rating: 4.8,
    reviews: 71,
    avatar: "VL",
    color: "bg-teal-600",
    verified: true,
    years: 9,
  },
];

const CITIES = ["Tất cả", "TP.HCM", "Hà Nội", "Đà Nẵng"];

const PAGE_T = {
  vi: {
    title: "Môi giới bất động sản", sub: "Kết nối với chuyên gia uy tín nhất tại địa phương",
    verified: "Đã xác minh", listings: "tin đăng", years: "năm KN", search: "Tìm môi giới...",
    all: "Tất cả",
    statActive: "Môi giới đang hoạt động", statVerified: "Đã xác minh", statListings: "Tổng tin đăng",
    notFound: "Không tìm thấy môi giới phù hợp",
    ctaTitle: "Bạn là môi giới?",
    ctaDesc: "Đăng ký làm môi giới xác minh trên VietRealty để tiếp cận nhiều khách hàng hơn",
    ctaBtn: "Đăng ký ngay",
  },
  en: {
    title: "Real Estate Agents", sub: "Connect with trusted local experts",
    verified: "Verified", listings: "listings", years: "yrs exp", search: "Search agents...",
    all: "All",
    statActive: "Active Agents", statVerified: "Verified", statListings: "Total Listings",
    notFound: "No matching agents found",
    ctaTitle: "Are you an agent?",
    ctaDesc: "Register as a VietRealty verified agent and reach more buyers",
    ctaBtn: "Register now",
  },
  zh: {
    title: "房产中介", sub: "与当地最受信赖的专家联系",
    verified: "已认证", listings: "房源", years: "年经验", search: "搜索中介...",
    all: "全部",
    statActive: "活跃中介", statVerified: "已认证", statListings: "总房源",
    notFound: "未找到匹配的中介",
    ctaTitle: "您是中介吗？",
    ctaDesc: "注册成为VietRealty认证中介，获得更多曝光",
    ctaBtn: "立即注册",
  },
};

export default function MoiGioiPage() {
  const { locale } = useLocale();
  const [city, setCity] = useState("Tất cả");
  const [search, setSearch] = useState("");

  const filtered = AGENTS.filter(a => {
    const matchCity = city === "Tất cả" || a.area.includes(city);
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  const L = PAGE_T[locale] ?? PAGE_T.vi;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{L.title}</h1>
        <p className="text-gray-500">{L.sub}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-8">
        {[
          { value: AGENTS.length, label: L.statActive },
          { value: AGENTS.filter(a => a.verified).length, label: L.statVerified },
          { value: AGENTS.reduce((s, a) => s + a.listings, 0), label: L.statListings },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-red-600">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={L.search}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
        />
        <div className="flex gap-2">
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${city === c ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-200 hover:border-red-400"}`}
            >
              {c === "Tất cả" ? L.all : c}
            </button>
          ))}
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(agent => (
          <div key={agent.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200">
            {/* Avatar + name */}
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-14 h-14 ${agent.color} rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0`}>
                {agent.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-900 text-base">{agent.name}</h3>
                  {agent.verified && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">✓ {L.verified}</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{agent.specialty}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{agent.area}</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mb-4">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                <strong className="text-gray-800">{agent.rating}</strong>
                <span className="text-gray-400">({agent.reviews})</span>
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {agent.listings} {L.listings}
              </span>
              <span>{agent.years} {L.years}</span>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2">
              <a
                href={`tel:${agent.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:border-red-400 hover:text-red-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {agent.phone}
              </a>
              <a
                href={`https://zalo.me/${agent.phone.replace(/^0/, "84")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#0068FF] text-white text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-[#0057d9] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Zalo
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{L.notFound}</p>
        </div>
      )}

      {/* CTA for agents */}
      <div className="mt-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-xl font-black mb-2">{L.ctaTitle}</h3>
        <p className="text-red-100 text-sm mb-5 max-w-md mx-auto">{L.ctaDesc}</p>
        <Link href="/dang-ky" className="inline-block bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors">
          {L.ctaBtn}
        </Link>
      </div>
    </div>
  );
}
