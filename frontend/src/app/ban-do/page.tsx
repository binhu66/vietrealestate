"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { properties, formatPrice } from "@/lib/data";
import Link from "next/link";

const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), { ssr: false });

function MapContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = getT(locale);

  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
  const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
  const focusId = searchParams.get("id") || undefined;

  const propsWithCoords = properties.filter((p) => p.lat && p.lng);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left sidebar */}
      <div className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden hidden md:flex">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">{t.map.title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{propsWithCoords.length} bất động sản trên bản đồ</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {propsWithCoords.map((p) => (
            <Link
              key={p.id}
              href={`/bat-dong-san/${p.id}`}
              className="flex gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
            >
              <img src={p.images[0]} alt={p.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />
              <div className="min-w-0">
                <div className="text-red-600 font-bold text-sm">{formatPrice(p.price, p.priceUnit)}</div>
                <div className="text-gray-800 text-xs font-medium truncate">{p.title}</div>
                <div className="text-gray-500 text-xs truncate">{p.district}, {p.city}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <PropertyMap focusLat={lat} focusLng={lng} focusId={focusId} />

        {/* Map legend */}
        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3 z-[1000] space-y-2 text-xs">
          <div className="font-semibold text-gray-700 mb-1">Chú giải</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow" />
            <span className="text-gray-600">Nhà đất bán</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" />
            <span className="text-gray-600">Cho thuê</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow ring-2 ring-yellow-400" />
            <span className="text-gray-600">Tin VIP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BanDoPage() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center">Đang tải bản đồ...</div>}>
      <MapContent />
    </Suspense>
  );
}
