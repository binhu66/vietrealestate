"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MapPin, BedDouble, Bath, Maximize2, Eye, Calendar,
  Phone, Share2, Heart, ChevronLeft, ChevronRight,
  Shield, Home, Compass, FileText
} from "lucide-react";
import { formatPrice, categories } from "@/lib/data";
import type { Property } from "@/lib/data";
import PropertyCard from "@/components/property/PropertyCard";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { supabase } from "@/lib/supabase";
import { useSaved } from "@/lib/savedContext";

export default function PropertyDetailClient({
  property,
  similar,
}: {
  property: Property;
  similar: Property[];
}) {
  const { locale } = useLocale();
  const t = getT(locale);
  const { savedIds, toggle } = useSaved();
  const saved = savedIds.has(property.id);
  const [imgIdx, setImgIdx] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  // Increment view count (fire-and-forget)
  useEffect(() => {
    if (/^[0-9a-f-]{36}$/.test(property.id)) {
      supabase.rpc("increment_listing_views", { listing_id: property.id }).then(() => {});
    }
  }, [property.id]);

  async function toggleSave() {
    await toggle(property.id);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  }

  const title =
    locale === "en" && property.titleEn ? property.titleEn
    : locale === "zh" && property.titleZh ? property.titleZh
    : property.title;

  const categoryLabel = categories.find((c) => c.id === property.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-red-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/bat-dong-san" className="hover:text-red-600">Bất động sản</Link>
        <span>/</span>
        <span className="text-gray-800 truncate max-w-xs">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image gallery */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <div className="relative aspect-video bg-gray-100">
              {property.images[imgIdx] ? (
                <img src={property.images[imgIdx]} alt={title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">🏠</div>
              )}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                    disabled={imgIdx === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => Math.min(property.images.length - 1, i + 1))}
                    disabled={imgIdx === property.images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {imgIdx + 1}/{property.images.length}
                  </span>
                </>
              )}
              {property.isVip && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ VIP
                </span>
              )}
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 p-3 bg-gray-50">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-red-600" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & price */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${property.type === "ban" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                    {property.type === "ban" ? t.property.forSale : t.property.forRent}
                  </span>
                  {categoryLabel && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {categoryLabel.icon} {locale === "en" ? categoryLabel.labelEn : locale === "zh" ? categoryLabel.labelZh : categoryLabel.label}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={toggleSave}
                  disabled={false}
                  className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${saved ? "bg-red-50 border-red-300 text-red-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  title={saved ? "Bỏ lưu" : "Lưu tin"}
                >
                  <Heart className={`w-5 h-5 ${saved ? "fill-red-500" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                  title="Chia sẻ"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{property.address}, {property.district}, {property.city}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div>
                <span className="text-3xl font-black text-red-600">{formatPrice(property.price, property.priceUnit)}</span>
                {property.area > 0 && (
                  <span className="text-gray-500 text-sm ml-2">
                    · {(property.price / property.area).toFixed(0)} tr/m²
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-800 mb-4">Thông tin bất động sản</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: <Maximize2 className="w-4 h-4" />, label: "Diện tích", value: `${property.area} m²` },
                property.bedrooms ? { icon: <BedDouble className="w-4 h-4" />, label: "Phòng ngủ", value: `${property.bedrooms} phòng` } : null,
                property.bathrooms ? { icon: <Bath className="w-4 h-4" />, label: "Phòng tắm", value: `${property.bathrooms} phòng` } : null,
                property.floor ? { icon: <Home className="w-4 h-4" />, label: "Tầng", value: `Tầng ${property.floor}` } : null,
                property.direction ? { icon: <Compass className="w-4 h-4" />, label: "Hướng", value: property.direction } : null,
                property.legalStatus ? { icon: <FileText className="w-4 h-4" />, label: "Pháp lý", value: property.legalStatus } : null,
              ].filter(Boolean).map((item: any) => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-red-500">{item.icon}</div>
                  <div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                    <div className="font-semibold text-gray-800 text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-800 mb-3">Mô tả chi tiết</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{property.description}</p>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> Địa chỉ
            </h2>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-500">Địa chỉ:</span> <span className="font-medium">{property.address}</span></div>
                <div><span className="text-gray-500">Quận/Huyện:</span> <span className="font-medium">{property.district}</span></div>
                <div><span className="text-gray-500">Tỉnh/TP:</span> <span className="font-medium">{property.city}</span></div>
                {property.lat && property.lng && (
                  <div><span className="text-gray-500">GPS:</span> <span className="font-mono text-xs">{property.lat.toFixed(4)}, {property.lng.toFixed(4)}</span></div>
                )}
              </div>
              {property.lat && property.lng && (
                <Link
                  href={`/ban-do?lat=${property.lat}&lng=${property.lng}&id=${property.id}`}
                  className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  🗺️ Xem trên bản đồ
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right: Contact card — hidden on mobile (shown in sticky bottom bar instead) */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {property.contactName[0]}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{property.contactName}</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> Đang online
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPhone(true)}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Phone className="w-5 h-5" />
              {showPhone ? property.contactPhone : t.property.showPhone}
            </button>
            <a
              href={`https://zalo.me/${property.contactPhone?.replace(/^0/, "84")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0068FF] text-white font-bold py-3 rounded-xl hover:bg-[#0057d9] transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5 fill-white"><path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm9.6 27.2c-.4.8-1.6 1.6-2.8 1.6-.4 0-.8 0-1.2-.4-2-1.2-4-2.8-5.6-4.8-1.6-2-2.8-4-3.6-6-.4-.8-.4-1.6 0-2.4.4-.8 1.2-1.2 2-1.2.4 0 .8.4.8.4l1.6 2.4c.4.4.4 1.2 0 1.6l-.8.8c.4.8.8 1.6 1.6 2.4.8.8 1.6 1.2 2.4 1.6l.8-.8c.4-.4 1.2-.4 1.6 0l2.4 1.6c.4.4.4.4.4.8.4.4 0 1.2-.4 2z"/></svg>
              Chat Zalo
            </a>
            {/* Quick inquiry */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">📋 Yêu cầu xem nhà</p>
              <textarea
                placeholder="Nhắn tin cho chủ nhà: Tôi muốn xem nhà vào..."
                rows={3}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 resize-none"
              />
              <a
                href={`https://zalo.me/${property.contactPhone?.replace(/^0/, "84")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5"
              >
                Gửi qua Zalo
              </a>
            </div>

            <div className="text-xs text-gray-500 space-y-2 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>{property.views?.toLocaleString()} lượt xem</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Đăng ngày {property.postedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600">Đã xác minh thông tin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="mt-10 mb-24 lg:mb-0">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏡 {t.property.similar}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}

      {/* Mobile sticky contact bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 safe-bottom shadow-lg">
        <button onClick={() => setShowPhone(true)}
          className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Phone className="w-4 h-4" />
          {showPhone ? property.contactPhone : t.property.showPhone}
        </button>
        <a
          href={`https://zalo.me/${property.contactPhone?.replace(/^0/, "84")}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 bg-[#0068FF] text-white font-bold py-3 rounded-xl hover:bg-[#0057d9] transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <svg viewBox="0 0 48 48" className="w-4 h-4 fill-white"><path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm9.6 27.2c-.4.8-1.6 1.6-2.8 1.6-.4 0-.8 0-1.2-.4-2-1.2-4-2.8-5.6-4.8-1.6-2-2.8-4-3.6-6-.4-.8-.4-1.6 0-2.4.4-.8 1.2-1.2 2-1.2.4 0 .8.4.8.4l1.6 2.4c.4.4.4 1.2 0 1.6l-.8.8c.4.8.8 1.6 1.6 2.4.8.8 1.6 1.2 2.4 1.6l.8-.8c.4-.4 1.2-.4 1.6 0l2.4 1.6c.4.4.4.4.4.8.4.4 0 1.2-.4 2z"/></svg>
          Zalo
        </a>
      </div>
    </div>
  );
}
