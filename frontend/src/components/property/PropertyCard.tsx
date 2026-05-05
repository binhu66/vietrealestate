"use client";
import Link from "next/link";
import { Heart, Eye, MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { useSaved } from "@/lib/savedContext";

interface Props {
  property: Property;
  viewMode?: "grid" | "list";
}

export default function PropertyCard({ property, viewMode = "grid" }: Props) {
  const { locale } = useLocale();
  const t = getT(locale);
  const { savedIds, toggle } = useSaved();
  const saved = savedIds.has(property.id);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    await toggle(property.id);
  }

  const title =
    locale === "en" && property.titleEn ? property.titleEn
    : locale === "zh" && property.titleZh ? property.titleZh
    : property.title;

  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden flex">
        {/* Image */}
        <Link href={`/bat-dong-san/${property.id}`} className="block relative shrink-0 w-32 sm:w-44 overflow-hidden bg-gray-100">
          {property.images[0] ? (
            <img src={property.images[0]} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-gray-200">🏠</div>
          )}
          <div className="absolute top-1.5 left-1.5 flex gap-1">
            {property.isVip && (
              <span className="bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">VIP</span>
            )}
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${property.type === "ban" ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`}>
              {property.type === "ban" ? t.property.forSale : t.property.forRent}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          <div>
            <Link href={`/bat-dong-san/${property.id}`}>
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors mb-1">
                {title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{property.district}, {property.city}</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-red-600 font-bold text-base">{formatPrice(property.price, property.priceUnit)}</div>
              <div className="flex items-center gap-3 text-gray-400 text-xs mt-0.5">
                {property.bedrooms && <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3" />{property.bedrooms}</span>}
                {property.bathrooms && <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{property.bathrooms}</span>}
                <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" />{property.area}m²</span>
                {property.views && <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{property.views.toLocaleString()}</span>}
              </div>
            </div>
            <button
              onClick={toggleSave}
              disabled={false}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              <Heart className={`w-4 h-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image */}
      <Link href={`/bat-dong-san/${property.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
        {property.images[0] ? (
          <img src={property.images[0]} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">🏠</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {property.isVip && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              ⭐ VIP
            </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${property.type === "ban" ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`}>
            {property.type === "ban" ? t.property.forSale : t.property.forRent}
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={toggleSave}
          disabled={false}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow disabled:opacity-60"
        >
          <Heart className={`w-4 h-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>

        {/* Image count */}
        {property.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
            📷 {property.images.length}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-red-600 font-bold text-lg leading-tight">
            {formatPrice(property.price, property.priceUnit)}
          </span>
          <div className="text-right">
            <div className="text-gray-500 text-xs">{property.area} m²</div>
            {property.area > 0 && (property.priceUnit === "ty" || property.priceUnit === "trieu") && (
              <div className="text-gray-400 text-[10px]">
                {property.priceUnit === "ty"
                  ? `${((property.price * 1000) / property.area).toFixed(0)}tr/m²`
                  : `${(property.price / property.area).toFixed(0)}tr/m²`}
              </div>
            )}
          </div>
        </div>

        <Link href={`/bat-dong-san/${property.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-red-600 transition-colors mb-2 min-h-[2.5rem]">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{property.district}, {property.city}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-500 text-xs border-t border-gray-100 pt-2">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3 h-3" />
              {property.bedrooms} PN
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              {property.bathrooms} WC
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3 h-3" />
            {property.area} m²
          </span>
          {property.views && (
            <span className="ml-auto flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {property.views.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
