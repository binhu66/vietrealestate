"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import { useState } from "react";
import type { Property } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const { locale } = useLocale();
  const t = getT(locale);
  const [saved, setSaved] = useState(false);

  const title =
    locale === "en" && property.titleEn
      ? property.titleEn
      : locale === "zh" && property.titleZh
      ? property.titleZh
      : property.title;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image */}
      <Link href={`/bat-dong-san/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

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
          onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow"
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
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
        {/* Price */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-red-600 font-bold text-lg leading-tight">
            {formatPrice(property.price, property.priceUnit)}
          </span>
          <span className="text-gray-500 text-xs">{property.area} m²</span>
        </div>

        {/* Title */}
        <Link href={`/bat-dong-san/${property.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-red-600 transition-colors mb-2 min-h-[2.5rem]">
            {title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{property.district}, {property.city}</span>
        </div>

        {/* Details row */}
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
