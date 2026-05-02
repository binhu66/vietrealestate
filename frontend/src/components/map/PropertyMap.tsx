"use client";
import { useEffect, useRef, useState } from "react";
import { properties, formatPrice } from "@/lib/data";
import type { Property } from "@/lib/data";
import Link from "next/link";
import { MapPin, X } from "lucide-react";

interface Props {
  focusLat?: number;
  focusLng?: number;
  focusId?: string;
}

export default function PropertyMap({ focusLat, focusLng, focusId }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const centerLat = focusLat ?? 10.7769;
      const centerLng = focusLng ?? 106.7009;

      const map = L.map(mapRef.current!, {
        center: [centerLat, centerLng],
        zoom: focusLat ? 15 : 11,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const propsWithCoords = properties.filter((p) => p.lat && p.lng);

      propsWithCoords.forEach((prop) => {
        const isVip = prop.isVip;
        const color = prop.type === "ban" ? "#dc2626" : "#2563eb";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:${color};
            color:white;
            padding:3px 7px;
            border-radius:20px;
            font-size:11px;
            font-weight:700;
            white-space:nowrap;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            border:2px solid white;
            ${isVip ? "outline:2px solid #f59e0b;" : ""}
          ">${formatPrice(prop.price, prop.priceUnit)}</div>`,
          iconAnchor: [0, 0],
        });

        const marker = L.marker([prop.lat!, prop.lng!], { icon }).addTo(map);
        marker.on("click", () => setSelected(prop));
      });

      // Highlight focused property
      if (focusId) {
        const focusProp = propsWithCoords.find((p) => p.id === focusId);
        if (focusProp) setSelected(focusProp);
      }

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />

      {/* Selected property popup */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[1000]">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-2 right-2 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={selected.images[0]}
            alt={selected.title}
            className="w-full h-32 object-cover"
          />
          <div className="p-3">
            <div className="text-red-600 font-bold text-lg mb-1">
              {formatPrice(selected.price, selected.priceUnit)}
            </div>
            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{selected.title}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{selected.district}, {selected.city}</span>
            </div>
            <Link
              href={`/bat-dong-san/${selected.id}`}
              className="block w-full text-center bg-red-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
