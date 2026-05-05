"use client";
import Link from "next/link";
import { TrendingUp, Shield, Clock, Users, ChevronRight } from "lucide-react";
import SearchBar from "@/components/property/SearchBar";
import PropertyCard from "@/components/property/PropertyCard";
import { properties, categories } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import type { Property } from "@/lib/data";

export default function HomePage() {
  const { locale } = useLocale();
  const t = getT(locale);

  const [vipProps, setVipProps]       = useState<Property[]>(properties.filter(p => p.isVip).slice(0, 4));
  const [forSaleProps, setForSaleProps] = useState<Property[]>(properties.filter(p => p.type === "ban").slice(0, 4));
  const [forRentProps, setForRentProps] = useState<Property[]>(properties.filter(p => p.type === "thue").slice(0, 4));
  const [totalCount, setTotalCount]   = useState<number | null>(null);

  useEffect(() => {
    async function fetchHome() {
      // Fetch VIP listings
      const { data: vipData } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("standard_status", "Active")
        .gt("vip_level", 0)
        .order("vip_level", { ascending: false })
        .order("original_entry_timestamp", { ascending: false })
        .limit(4);

      if (vipData && vipData.length > 0)
        setVipProps((vipData as unknown as DbListing[]).map(dbToProperty));

      // Fetch latest for-sale
      const { data: saleData } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("standard_status", "Active")
        .eq("transaction_type", "For Sale")
        .order("original_entry_timestamp", { ascending: false })
        .limit(4);

      if (saleData && saleData.length > 0)
        setForSaleProps((saleData as unknown as DbListing[]).map(dbToProperty));

      // Fetch latest for-rent
      const { data: rentData } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("standard_status", "Active")
        .eq("transaction_type", "For Rent")
        .order("original_entry_timestamp", { ascending: false })
        .limit(4);

      if (rentData && rentData.length > 0)
        setForRentProps((rentData as unknown as DbListing[]).map(dbToProperty));

      // Get total count
      const { count } = await supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("standard_status", "Active");

      if (count !== null) setTotalCount(count);
    }
    fetchHome();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-rose-600 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            🏆 Sàn BĐS #1 Việt Nam
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            {t.hero.title}
          </h1>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <SearchBar />
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-red-100">
            <span>🏠 <strong className="text-white">{totalCount !== null ? `${totalCount.toLocaleString()}+` : "125,000+"}</strong> tin đăng</span>
            <span>👥 <strong className="text-white">2.5M+</strong> người dùng</span>
            <span>📍 <strong className="text-white">63</strong> tỉnh thành</span>
          </div>
        </div>
      </section>

      {/* Category icons — residential + commercial split */}
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        {/* Residential */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {locale === "zh" ? "🏠 民用住宅" : locale === "en" ? "🏠 Residential" : "🏠 Nhà ở dân dụng"}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {categories.filter(c => ["can-ho-chung-cu","nha-rieng","nha-biet-thu","dat-nen"].includes(c.id)).map(cat => (
              <Link
                key={cat.id}
                href={`/bat-dong-san?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-red-400 hover:shadow-md transition-all text-center group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 leading-tight">
                  {locale === "en" ? cat.labelEn : locale === "zh" ? cat.labelZh : cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Commercial */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {locale === "zh" ? "🏢 商业地产" : locale === "en" ? "🏢 Commercial" : "🏢 Bất động sản thương mại"}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {categories.filter(c => ["van-phong","mat-bang","kho-xuong","khach-san"].includes(c.id)).map(cat => (
              <Link
                key={cat.id}
                href={`/thuong-mai?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-amber-400 hover:shadow-md transition-all text-center group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-amber-600 leading-tight">
                  {locale === "en" ? cat.labelEn : locale === "zh" ? cat.labelZh : cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Listings */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">⭐ Tin VIP nổi bật</h2>
            <p className="text-sm text-gray-500 mt-0.5">Bất động sản cao cấp được xác thực</p>
          </div>
          <Link href="/bat-dong-san" className="flex items-center gap-1 text-red-600 text-sm font-semibold hover:underline">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vipProps.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* For sale */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🏠 Mua bán bất động sản</h2>
            <p className="text-sm text-gray-500 mt-0.5">Tin đăng mới nhất hôm nay</p>
          </div>
          <Link href="/bat-dong-san?type=ban" className="flex items-center gap-1 text-red-600 text-sm font-semibold hover:underline">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forSaleProps.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* For rent */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🔑 Cho thuê bất động sản</h2>
            <p className="text-sm text-gray-500 mt-0.5">Căn hộ, nhà phố, văn phòng cho thuê</p>
          </div>
          <Link href="/cho-thue" className="flex items-center gap-1 text-red-600 text-sm font-semibold hover:underline">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forRentProps.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* Map CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <Link href="/ban-do" className="block bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white hover:shadow-xl transition-shadow overflow-hidden relative">
          <div className="absolute right-8 top-4 text-6xl opacity-20">🗺️</div>
          <h3 className="text-2xl font-black mb-2">{t.map.title}</h3>
          <p className="text-blue-100 mb-4">{t.map.subtitle}</p>
          <span className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Mở bản đồ <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </section>

      {/* News CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">📰 Tin tức thị trường BĐS</h3>
            <p className="text-sm text-gray-500">Cập nhật xu hướng, pháp lý và phân tích thị trường mới nhất</p>
          </div>
          <Link
            href="/tin-tuc"
            className="shrink-0 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Đọc ngay <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Shield className="w-7 h-7" />, title: "Pháp lý rõ ràng", desc: "100% tin đăng xác minh" },
              { icon: <Clock className="w-7 h-7" />, title: "Cập nhật 24/7", desc: "Tin đăng mới mỗi phút" },
              { icon: <Users className="w-7 h-7" />, title: "2.5M người dùng", desc: "Cộng đồng tin tưởng" },
              { icon: <TrendingUp className="w-7 h-7" />, title: "Giá tốt nhất", desc: "So sánh hàng ngàn tin" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                  {icon}
                </div>
                <div className="font-bold text-gray-800">{title}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
