"use client";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/data";
import type { Property } from "@/lib/data";
import Link from "next/link";
import { MapPin, X, Plus, Minus, Locate, Layers } from "lucide-react";

const STREET_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const SATELLITE_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

interface Props {
  properties: Property[];
  focusLat?: number;
  focusLng?: number;
  focusId?: string;
}

export default function PropertyMap({ properties, focusLat, focusLng, focusId }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef  = useRef<any[]>([]);
  const tileRef     = useRef<any>(null);
  const LeafletRef  = useRef<any>(null);

  const [selected, setSelected]     = useState<Property | null>(null);
  const [satellite, setSatellite]   = useState(false);
  const [locating, setLocating]     = useState(false);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import("leaflet").then((L) => {
      LeafletRef.current = L;
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(mapRef.current!, {
        center: [focusLat ?? 10.7769, focusLng ?? 106.7009],
        zoom: focusLat ? 15 : 11,
        zoomControl: false,
      });

      tileRef.current = L.tileLayer(STREET_TILES, {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        tileRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Sync markers whenever `properties` changes
  useEffect(() => {
    const L = LeafletRef.current;
    const map = mapInstance.current;
    if (!L || !map) {
      // Map not ready yet — retry after a short delay
      const timer = setTimeout(() => {
        const L2 = LeafletRef.current;
        const map2 = mapInstance.current;
        if (!L2 || !map2) return;
        syncMarkers(L2, map2);
      }, 500);
      return () => clearTimeout(timer);
    }
    syncMarkers(L, map);
  }, [properties]);

  function syncMarkers(L: any, map: any) {
    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    properties.forEach((prop) => {
      if (!prop.lat || !prop.lng) return;
      const color = prop.type === "ban" ? "#dc2626" : prop.type === "thue" ? "#2563eb" : "#d97706";
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          background:${color};color:white;
          padding:3px 8px;border-radius:20px;
          font-size:11px;font-weight:700;
          white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);
          border:2px solid white;
          ${prop.isVip ? "outline:2px solid #f59e0b;outline-offset:1px;" : ""}
        ">${formatPrice(prop.price, prop.priceUnit)}</div>`,
        iconAnchor: [0, 0],
      });
      const marker = L.marker([prop.lat, prop.lng], { icon }).addTo(map);
      marker.on("click", () => setSelected(prop));
      markersRef.current.push(marker);
    });

    // Highlight focused property
    if (focusId) {
      const fp = properties.find(p => p.id === focusId);
      if (fp) setSelected(fp);
    }
  }

  // Satellite toggle
  useEffect(() => {
    const L = LeafletRef.current;
    const map = mapInstance.current;
    if (!L || !map || !tileRef.current) return;
    tileRef.current.remove();
    tileRef.current = L.tileLayer(satellite ? SATELLITE_TILES : STREET_TILES, {
      attribution: satellite
        ? '© <a href="https://www.esri.com">Esri</a>'
        : '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
  }, [satellite]);

  function handleZoomIn()  { mapInstance.current?.zoomIn(); }
  function handleZoomOut() { mapInstance.current?.zoomOut(); }
  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstance.current?.setView([pos.coords.latitude, pos.coords.longitude], 15);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  return (
    <div className="relative w-full h-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} className="w-full h-full" />

      {/* ── Right-side controls (yhouse style) ── */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-[1000]">
        {[
          { icon: <Plus className="w-4 h-4" />,   onClick: handleZoomIn,  title: "Phóng to" },
          { icon: <Minus className="w-4 h-4" />,  onClick: handleZoomOut, title: "Thu nhỏ" },
        ].map(({ icon, onClick, title }) => (
          <button
            key={title}
            onClick={onClick}
            title={title}
            className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all border border-gray-100"
          >
            {icon}
          </button>
        ))}

        <div className="h-px bg-gray-200 mx-1 my-0.5" />

        <button
          onClick={handleLocate}
          title="Vị trí của tôi"
          className={`w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center transition-all border border-gray-100 ${locating ? "text-red-500 animate-pulse" : "text-gray-700 hover:bg-gray-50 hover:shadow-lg"}`}
        >
          <Locate className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSatellite(s => !s)}
          title={satellite ? "Chế độ bản đồ" : "Chế độ vệ tinh"}
          className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-all border ${satellite ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-100 hover:shadow-lg"}`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* ── Selected property card ── */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1000]">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 z-10 shadow"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <img src={selected.images[0]} alt={selected.title} className="w-full h-36 object-cover" />
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selected.type === "ban" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                {selected.type === "ban" ? "Bán" : "Thuê"}
              </span>
              {selected.isVip && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">VIP</span>}
            </div>
            <div className="text-red-600 font-black text-lg leading-tight">
              {formatPrice(selected.price, selected.priceUnit)}
            </div>
            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mt-0.5 mb-1">{selected.title}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{selected.district}, {selected.city}</span>
            </div>
            {(selected.area || selected.bedrooms) && (
              <div className="flex gap-3 text-xs text-gray-500 mb-3">
                {selected.area && <span>📐 {selected.area} m²</span>}
                {selected.bedrooms && <span>🛏 {selected.bedrooms} PN</span>}
                {selected.bathrooms && <span>🚿 {selected.bathrooms} WC</span>}
              </div>
            )}
            <Link
              href={`/bat-dong-san/${selected.id}`}
              className="block w-full text-center bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-red-700 transition-colors"
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
