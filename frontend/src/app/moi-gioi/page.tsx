"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MapPin, Star, Building2, MessageCircle, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { supabase } from "@/lib/supabase";

interface Agent {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  bio: string | null;
  tinh_thanh: string | null;
  specialties: string[] | null;
  listings_count: number;
  rating: number | null;
  reviews_count: number;
  verified: boolean;
  company_name: string | null;
}

// Static fallback shown while DB loads
const STATIC_AGENTS: Agent[] = [
  { id: "s1", full_name: "Minh Tuấn", phone: "0901234567", avatar_url: null, bio: null, tinh_thanh: "TP. Hồ Chí Minh", specialties: ["Căn hộ cao cấp"], listings_count: 24, rating: 4.9, reviews_count: 87, verified: true, company_name: null },
  { id: "s2", full_name: "Thu Hương", phone: "0912345678", avatar_url: null, bio: null, tinh_thanh: "Hà Nội", specialties: ["Nhà riêng", "Biệt thự"], listings_count: 18, rating: 4.8, reviews_count: 63, verified: true, company_name: null },
  { id: "s3", full_name: "Phú Hào", phone: "0987654321", avatar_url: null, bio: null, tinh_thanh: "Đà Nẵng", specialties: ["Đất nền"], listings_count: 31, rating: 4.7, reviews_count: 42, verified: true, company_name: null },
];

const AVATAR_COLORS = ["bg-red-600", "bg-blue-600", "bg-green-600", "bg-purple-600", "bg-amber-600", "bg-teal-600", "bg-pink-600"];

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase();
}

const CITIES = ["Tất cả", "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Bình Dương", "Đồng Nai"];

export default function MoiGioiPage() {
  const { locale } = useLocale();
  const [agents, setAgents] = useState<Agent[]>(STATIC_AGENTS);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Tất cả");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true);
      const { data } = await supabase
        .from("agents")
        .select("id, full_name, phone, avatar_url, bio, tinh_thanh, specialties, listings_count, rating, reviews_count, verified, company_name")
        .eq("status", "active")
        .order("verified", { ascending: false })
        .order("listings_count", { ascending: false })
        .limit(50);

      if (data && data.length > 0) setAgents(data);
      setLoading(false);
    }
    fetchAgents();
  }, []);

  const filtered = agents.filter(a => {
    const matchCity = city === "Tất cả" || a.tinh_thanh?.includes(city.replace("TP. ", ""));
    const matchSearch = !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.specialties ?? []).some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      (a.tinh_thanh ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  const L = {
    vi: { title: "Môi giới bất động sản", sub: "Kết nối với chuyên gia uy tín nhất tại địa phương", verified: "Đã xác minh", listings: "tin đăng", contact: "Liên hệ", zalo: "Nhắn Zalo", search: "Tìm môi giới..." },
    en: { title: "Real Estate Agents", sub: "Connect with trusted local experts", verified: "Verified", listings: "listings", contact: "Contact", zalo: "Chat Zalo", search: "Search agents..." },
    zh: { title: "房产中介", sub: "与当地最受信赖的专家联系", verified: "已认证", listings: "房源", contact: "联系", zalo: "Zalo联系", search: "搜索中介..." },
  }[locale] ?? { title: "Môi giới bất động sản", sub: "Kết nối với chuyên gia uy tín nhất tại địa phương", verified: "Đã xác minh", listings: "tin đăng", contact: "Liên hệ", zalo: "Nhắn Zalo", search: "Tìm môi giới..." };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{L.title}</h1>
        <p className="text-gray-500">{L.sub}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { value: loading ? "…" : agents.length, label: locale === "zh" ? "活跃中介" : locale === "en" ? "Active Agents" : "Môi giới đang hoạt động" },
          { value: loading ? "…" : agents.filter(a => a.verified).length, label: locale === "zh" ? "已认证" : locale === "en" ? "Verified" : "Đã xác minh" },
          { value: loading ? "…" : agents.reduce((s, a) => s + a.listings_count, 0), label: locale === "zh" ? "总房源" : locale === "en" ? "Total Listings" : "Tổng tin đăng" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <div className={`text-2xl font-black text-red-600 ${loading ? "animate-pulse" : ""}`}>{s.value}</div>
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
        <div className="flex flex-wrap gap-2">
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${city === c ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-200 hover:border-red-400"}`}
            >
              {c === "Tất cả" ? (locale === "en" ? "All" : locale === "zh" ? "全部" : c) : c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Đang tải danh sách môi giới...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((agent, idx) => (
            <div key={agent.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start gap-3 mb-4">
                {agent.avatar_url ? (
                  <img src={agent.avatar_url} alt={agent.full_name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className={`w-14 h-14 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0`}>
                    {getInitials(agent.full_name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-gray-900 text-base">{agent.full_name}</h3>
                    {agent.verified && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">✓ {L.verified}</span>
                    )}
                  </div>
                  {(agent.specialties ?? []).length > 0 && (
                    <div className="text-xs text-gray-500 mt-0.5">{(agent.specialties ?? []).slice(0, 2).join(", ")}</div>
                  )}
                  {agent.tinh_thanh && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{agent.tinh_thanh}</span>
                    </div>
                  )}
                  {agent.company_name && (
                    <div className="text-xs text-gray-400 mt-0.5 truncate">{agent.company_name}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                  <strong className="text-gray-800">{agent.rating?.toFixed(1) ?? "–"}</strong>
                  <span className="text-gray-400">({agent.reviews_count})</span>
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {agent.listings_count} {L.listings}
                </span>
              </div>

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
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy môi giới phù hợp</p>
        </div>
      )}

      <div className="mt-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-xl font-black mb-2">
          {locale === "zh" ? "您是中介吗？" : locale === "en" ? "Are you an agent?" : "Bạn là môi giới?"}
        </h3>
        <p className="text-red-100 text-sm mb-5 max-w-md mx-auto">
          {locale === "zh" ? "注册成为BinHorizon认证中介，获得更多曝光" : locale === "en" ? "Register as a BinHorizon verified agent and reach more buyers" : "Đăng ký làm môi giới xác minh trên BinHorizon để tiếp cận nhiều khách hàng hơn"}
        </p>
        <Link href="/dang-ky" className="inline-block bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors">
          {locale === "zh" ? "立即注册" : locale === "en" ? "Register now" : "Đăng ký ngay"}
        </Link>
      </div>
    </div>
  );
}
