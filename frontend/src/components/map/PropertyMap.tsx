"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { formatPrice } from "@/lib/data";
import type { Property } from "@/lib/data";
import Link from "next/link";
import { MapPin, X, Plus, Minus, Locate, Layers, Check } from "lucide-react";
import { HandTap } from "@phosphor-icons/react";

// ── Marker HTML helpers ───────────────────────────────────────────────────────
function pricePillHtml(price: string, color: string, isVip: boolean) {
  const ring = isVip ? `outline:2px solid #f59e0b;outline-offset:2px;` : "";
  return `
    <div style="position:relative;display:inline-block;">
      <div style="
        background:${color};color:#fff;
        padding:5px 10px 5px;
        border-radius:8px;
        font-size:12px;font-weight:700;
        white-space:nowrap;
        box-shadow:0 2px 10px rgba(0,0,0,.22);
        border:2.5px solid #fff;
        ${ring}
        cursor:pointer;
        transition:transform .12s;
      ">${price}</div>
      <div style="
        position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:6px solid ${color};
      "></div>
    </div>`;
}

function clusterHtml(count: number) {
  const s = count < 10 ? 34 : count < 50 ? 42 : count < 200 ? 50 : 58;
  const fs = count < 10 ? 13 : count < 100 ? 12 : 11;
  return `
    <div style="
      width:${s}px;height:${s}px;
      border-radius:50%;
      background:rgba(220,38,38,0.15);
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="
        width:${s - 10}px;height:${s - 10}px;
        border-radius:50%;
        background:#dc2626;
        color:#fff;
        font-size:${fs}px;font-weight:700;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(220,38,38,.45);
        border:2.5px solid #fff;
      ">${count > 999 ? "999+" : count}</div>
    </div>`;
}

// ── Tile layer definitions ────────────────────────────────────────────────────
type MapStyle = "street" | "satellite" | "light" | "dark" | "terrain";

type StyleDef = {
  id: MapStyle; label: string; emoji: string;
  url: (token: string) => string;
  attrib: string; tileSize?: number; zoomOffset?: number;
  preview: string; bgClass: string;
};

const MAP_STYLES: StyleDef[] = [
  {
    id: "street", label: "Đường phố", emoji: "🗺️",
    url: t => t
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${t}`
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attrib: '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/">OSM</a>',
    preview: "https://a.basemaps.cartocdn.com/light_all/6/50/30.png",
    bgClass: "bg-orange-50",
  },
  {
    id: "satellite", label: "Vệ tinh", emoji: "🛰️",
    url: t => t
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${t}`
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attrib: '© <a href="https://www.mapbox.com/">Mapbox</a>',
    preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/6/30/50",
    bgClass: "bg-gray-800",
  },
  {
    id: "light", label: "Sáng", emoji: "☀️",
    url: t => t
      ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${t}`
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    attrib: '© <a href="https://www.mapbox.com/">Mapbox</a>',
    preview: "https://a.basemaps.cartocdn.com/light_all/6/50/30.png",
    bgClass: "bg-gray-50",
  },
  {
    id: "dark", label: "Tối", emoji: "🌙",
    url: t => t
      ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${t}`
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    attrib: '© <a href="https://www.mapbox.com/">Mapbox</a>',
    preview: "https://a.basemaps.cartocdn.com/dark_all/6/50/30.png",
    bgClass: "bg-gray-900",
  },
  {
    id: "terrain", label: "Địa hình", emoji: "⛰️",
    url: t => t
      ? `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token=${t}`
      : "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attrib: '© <a href="https://www.mapbox.com/">Mapbox</a>',
    preview: "https://a.tile.opentopomap.org/6/50/30.png",
    bgClass: "bg-green-100",
  },
];

// ── Point-in-polygon (ray casting) ──────────────────────────────────────────
function pointInPolygon(pt: [number, number], poly: [number, number][]): boolean {
  const [px, py] = pt;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (((yi > py) !== (yj > py)) && px < (xj - xi) * (py - yi) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

interface Props {
  properties: Property[];
  focusLat?: number;
  focusLng?: number;
  focusId?: string;
  onPolygonFilter?: (ids: string[] | null) => void;
}

export default function PropertyMap({ properties, focusLat, focusLng, focusId, onPolygonFilter }: Props) {
  const mapRef        = useRef<HTMLDivElement>(null);
  const mapInstance   = useRef<any>(null);
  const clusterRef    = useRef<any>(null);   // markerClusterGroup
  const tileRef       = useRef<any>(null);
  const LeafletRef    = useRef<any>(null);

  // Draw refs (imperative — avoid stale closures)
  const drawLayerRef     = useRef<any>(null);
  const drawPolyRef      = useRef<any>(null);   // live polyline while drawing
  const drawPolygonRef   = useRef<any>(null);   // finished polygon
  const drawDotsRef      = useRef<any[]>([]);
  const verticesRef      = useRef<[number, number][]>([]);
  const isDrawingRef     = useRef(false);
  const drawHandlerRef   = useRef<((e: MouseEvent) => void) | null>(null);
  const dblClickHRef     = useRef<((e: MouseEvent) => void) | null>(null);
  const mouseMoveHRef    = useRef<((e: MouseEvent) => void) | null>(null);
  const previewLineRef   = useRef<any>(null);

  const mapboxTokenRef  = useRef("");   // mirrors mapboxToken for init-effect closure

  const [selected,      setSelected]      = useState<Property | null>(null);
  const [mapStyle,      setMapStyle]      = useState<MapStyle>("street");
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [drawing,       setDrawing]       = useState(false);
  const [polygonActive, setPolygonActive] = useState(false);
  const [locating,      setLocating]      = useState(false);
  const [mapboxToken,   setMapboxToken]   = useState("");
  const [mapReady,      setMapReady]      = useState(false);

  // ── Fetch Mapbox temporary token ─────────────────────────────────────────
  useEffect(() => {
    // Try local Next.js API route first (works without Supabase JWT auth),
    // then fall back to Supabase Edge Function, then fall back to OSM tiles.
    fetch("/api/mapbox-token")
      .then(r => r.json())
      .then(d => {
        if (d.token) { mapboxTokenRef.current = d.token; setMapboxToken(d.token); return; }
        // Local route failed (env vars not set) — try Edge Function
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        return supabase.functions.invoke("mapbox-token").then(({ data }) => {
          if (data?.token) { mapboxTokenRef.current = data.token; setMapboxToken(data.token); }
        });
      })
      .catch(() => {/* fall back to OSM tiles */});
  }, []);

  // ── Init map (CDN-based to avoid frozen ESM issues with plugins) ──────────
  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement("script");
        s.src = src; s.async = false;
        s.onload = () => resolve(); s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js")
      .then(() => loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js"))
      .then(() => {
        const L = (window as any).L;
        if (cancelled || !L || !mapRef.current || (mapRef.current as any)._leaflet_id) return;
        LeafletRef.current = L;
        delete L.Icon.Default.prototype._getIconUrl;

        const map = L.map(mapRef.current, {
          center: [focusLat ?? 10.7769, focusLng ?? 106.7009],
          zoom: focusLat ? 15 : 11,
          zoomControl: false,
          doubleClickZoom: false,
        });

        const style = MAP_STYLES.find(s => s.id === "street")!;
        // Use ref (not state closure) so we get the latest token even if it arrived during CDN loading
        tileRef.current = L.tileLayer(style.url(mapboxTokenRef.current), { attribution: style.attrib, maxZoom: 19 }).addTo(map);
        drawLayerRef.current = L.layerGroup().addTo(map);

        setMapReady(true);
        clusterRef.current = L.markerClusterGroup({
          maxClusterRadius: 60,
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          animate: true,
          iconCreateFunction: (cluster: any) => L.divIcon({
            html: clusterHtml(cluster.getChildCount()),
            className: "",
            iconSize: undefined,
            iconAnchor: [0, 0],
          }),
        });
        map.addLayer(clusterRef.current);
        mapInstance.current = map;
        (window as any).__leafletMap = map;
      });

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
      tileRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  // ── Sync markers ─────────────────────────────────────────────────────────
  useEffect(() => {
    const L = LeafletRef.current, map = mapInstance.current;
    if (!L || !map || !clusterRef.current) {
      const t = setTimeout(() => syncMarkers(LeafletRef.current, mapInstance.current), 600);
      return () => clearTimeout(t);
    }
    syncMarkers(L, map);
  }, [properties]);

  function syncMarkers(L: any, map: any) {
    if (!L || !map || !clusterRef.current) return;
    clusterRef.current.clearLayers();
    properties.forEach(prop => {
      if (!prop.lat || !prop.lng) return;
      const color = prop.type === "ban" ? "#dc2626" : "#2563eb";
      const price = formatPrice(prop.price, prop.priceUnit);
      const icon = L.divIcon({
        className: "",
        html: pricePillHtml(price, color, prop.isVip),
        iconSize: undefined as any,
        iconAnchor: [0, 0],
      });
      const m = L.marker([prop.lat, prop.lng], { icon });
      m.on("click", () => setSelected(prop));
      clusterRef.current.addLayer(m);
    });
    if (focusId) {
      const fp = properties.find(p => p.id === focusId);
      if (fp) setSelected(fp);
    }
  }

  // ── Change tile style (re-runs when token arrives or style changes) ────────
  useEffect(() => {
    const L = LeafletRef.current, map = mapInstance.current;
    if (!L || !map || !tileRef.current) return;
    const s = MAP_STYLES.find(x => x.id === mapStyle)!;
    tileRef.current.remove();
    tileRef.current = L.tileLayer(s.url(mapboxToken), {
      attribution: s.attrib,
      maxZoom: 19,
    }).addTo(map);
  }, [mapStyle, mapboxToken, mapReady]);

  // ── Zoom / Locate ─────────────────────────────────────────────────────────
  function handleZoomIn()  { mapInstance.current?.zoomIn(); }
  function handleZoomOut() { mapInstance.current?.zoomOut(); }
  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { mapInstance.current?.setView([pos.coords.latitude, pos.coords.longitude], 15); setLocating(false); },
      () => setLocating(false)
    );
  }

  // ── Draw tool ─────────────────────────────────────────────────────────────
  function startDrawing() {
    const L = LeafletRef.current, map = mapInstance.current;
    if (!L || !map) return;

    // Clear previous
    clearDrawingLayers(L);
    verticesRef.current = [];
    isDrawingRef.current = true;
    setDrawing(true);
    setPolygonActive(false);

    const container = map.getContainer();
    container.style.cursor = "crosshair";
    // Disable Leaflet drag so map doesn't pan while drawing
    map.dragging.disable();

    const addVertex = (latlng: { lat: number; lng: number }) => {
      const pt: [number, number] = [latlng.lat, latlng.lng];
      verticesRef.current = [...verticesRef.current, pt];
      const verts = verticesRef.current;

      const dot = L.circleMarker(pt, { radius: 5, color: "#ef4444", fillColor: "#fff", fillOpacity: 1, weight: 2 });
      drawLayerRef.current.addLayer(dot);
      drawDotsRef.current.push(dot);

      drawPolyRef.current?.remove();
      if (verts.length >= 2) {
        drawPolyRef.current = L.polyline(verts, { color: "#ef4444", weight: 2, dashArray: "6 4" });
        drawLayerRef.current.addLayer(drawPolyRef.current);
      }
    };

    // Use direct DOM events — bypasses Leaflet's drag-vs-click delay for physical clicks.
    // Handle double-click within the click handler via timestamp to avoid extra vertices.
    let lastClickMs = 0;

    const domClickHandler = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      e.stopPropagation();
      e.preventDefault();
      const now = Date.now();
      if (now - lastClickMs < 350) {
        // Double-click: finish without adding another vertex
        finishDrawing();
        return;
      }
      lastClickMs = now;
      addVertex(map.mouseEventToLatLng(e));
    };

    const domDblClickHandler = (e: MouseEvent) => {
      // Swallow the native dblclick so Leaflet doesn't zoom
      e.stopPropagation();
      e.preventDefault();
    };

    const domMoveHandler = (e: MouseEvent) => {
      if (!isDrawingRef.current || verticesRef.current.length === 0) return;
      const last = verticesRef.current[verticesRef.current.length - 1];
      const latlng = map.mouseEventToLatLng(e);
      previewLineRef.current?.remove();
      previewLineRef.current = L.polyline([last, [latlng.lat, latlng.lng]], {
        color: "#ef4444", weight: 1.5, dashArray: "4 4", opacity: 0.6,
      });
      drawLayerRef.current.addLayer(previewLineRef.current);
    };

    drawHandlerRef.current = domClickHandler;
    dblClickHRef.current   = domDblClickHandler;
    mouseMoveHRef.current  = domMoveHandler;

    container.addEventListener("click",     domClickHandler,    { capture: true });
    container.addEventListener("dblclick",  domDblClickHandler, { capture: true });
    container.addEventListener("mousemove", domMoveHandler);
  }

  function finishDrawing() {
    const L = LeafletRef.current, map = mapInstance.current;
    if (!L || !map) return;

    isDrawingRef.current = false;
    setDrawing(false);

    const container = map.getContainer();
    container.style.cursor = "";
    map.dragging.enable();

    if (drawHandlerRef.current) {
      container.removeEventListener("click", drawHandlerRef.current, { capture: true });
      drawHandlerRef.current = null;
    }
    if (dblClickHRef.current) {
      container.removeEventListener("dblclick", dblClickHRef.current, { capture: true });
      dblClickHRef.current = null;
    }
    if (mouseMoveHRef.current) {
      container.removeEventListener("mousemove", mouseMoveHRef.current);
      mouseMoveHRef.current = null;
    }

    const verts = verticesRef.current;
    if (verts.length < 3) { clearDrawingLayers(L); onPolygonFilter?.(null); return; }

    clearDrawingLayers(L);
    drawPolygonRef.current = L.polygon(verts, {
      color: "#ef4444", weight: 2, fillColor: "#ef4444", fillOpacity: 0.08,
    });
    drawLayerRef.current.addLayer(drawPolygonRef.current);
    setPolygonActive(true);

    const ids = properties
      .filter(p => p.lat && p.lng && pointInPolygon([p.lat!, p.lng!], verts))
      .map(p => p.id);
    onPolygonFilter?.(ids);
  }

  function clearDrawing() {
    const L = LeafletRef.current, map = mapInstance.current;
    if (L && map) {
      const container = map.getContainer();
      if (drawHandlerRef.current) {
        container.removeEventListener("click", drawHandlerRef.current, { capture: true });
        drawHandlerRef.current = null;
      }
      if (dblClickHRef.current) {
        container.removeEventListener("dblclick", dblClickHRef.current, { capture: true });
        dblClickHRef.current = null;
      }
      if (mouseMoveHRef.current) {
        container.removeEventListener("mousemove", mouseMoveHRef.current);
        mouseMoveHRef.current = null;
      }
      map.dragging.enable();
      clearDrawingLayers(L);
    }
    isDrawingRef.current = false;
    verticesRef.current  = [];
    setDrawing(false);
    setPolygonActive(false);
    onPolygonFilter?.(null);
    if (map) map.getContainer().style.cursor = "";
  }

  function clearDrawingLayers(L: any) {
    previewLineRef.current?.remove();
    drawPolyRef.current?.remove();
    drawPolygonRef.current?.remove();
    drawDotsRef.current.forEach(d => d.remove());
    drawLayerRef.current?.clearLayers();
    drawDotsRef.current = [];
    previewLineRef.current = null;
    drawPolyRef.current = null;
    drawPolygonRef.current = null;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const currentStyle = MAP_STYLES.find(s => s.id === mapStyle)!;

  return (
    <div className="relative w-full h-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css" />
      <div ref={mapRef} className="w-full h-full" />

      {/* ── Drawing instruction banner ───────────────────────────────────── */}
      {drawing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] flex items-center gap-3 bg-white/95 backdrop-blur shadow-lg rounded-2xl px-5 py-2.5 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-gray-800">Nhấn để vẽ vùng tìm kiếm</span>
          <button onClick={finishDrawing} className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
            <Check className="w-3.5 h-3.5" /> Xong
          </button>
          <button onClick={clearDrawing} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Style selector panel ─────────────────────────────────────────── */}
      {styleMenuOpen && (
        <>
          <div className="fixed inset-0 z-[1050]" onClick={() => setStyleMenuOpen(false)} />
          <div className="absolute top-4 right-14 z-[1100] bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 w-52">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 mb-2">Kiểu bản đồ</p>
            <div className="space-y-1">
              {MAP_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setMapStyle(s.id); setStyleMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-colors ${mapStyle === s.id ? "bg-red-50" : "hover:bg-gray-50"}`}
                >
                  {/* Thumbnail */}
                  <div className={`w-11 h-9 rounded-lg overflow-hidden shrink-0 border-2 ${mapStyle === s.id ? "border-red-500" : "border-gray-200"}`}>
                    <img
                      src={s.preview}
                      alt={s.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).parentElement!.className += ` ${s.bgClass} flex items-center justify-center text-base`;
                        (e.target as HTMLImageElement).parentElement!.textContent = s.emoji;
                      }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${mapStyle === s.id ? "text-red-700" : "text-gray-700"}`}>
                    {s.label}
                  </span>
                  {mapStyle === s.id && <Check className="w-3.5 h-3.5 text-red-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Right controls (yhouse style) ───────────────────────────────── */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-[1000]">
        <button onClick={handleZoomIn}  title="Phóng to"   className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all border border-gray-100">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={handleZoomOut} title="Thu nhỏ"    className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all border border-gray-100">
          <Minus className="w-4 h-4" />
        </button>

        <div className="h-px bg-gray-200 mx-1 my-0.5" />

        <button
          onClick={handleLocate}
          title="Vị trí của tôi"
          className={`w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center transition-all border border-gray-100 ${locating ? "text-red-500 animate-pulse" : "text-gray-700 hover:bg-gray-50 hover:shadow-lg"}`}
        >
          <Locate className="w-4 h-4" />
        </button>

        {/* Draw button */}
        <button
          onClick={drawing ? finishDrawing : polygonActive ? clearDrawing : startDrawing}
          title={drawing ? "Kết thúc vẽ" : polygonActive ? "Xóa vùng vẽ" : "Vẽ vùng tìm kiếm"}
          className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-all border ${
            drawing      ? "bg-red-600 text-white border-red-600 shadow-lg" :
            polygonActive? "bg-red-50  text-red-600 border-red-300" :
                           "bg-white   text-gray-700 border-gray-100 hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          <HandTap className="w-4 h-4" />
        </button>

        <div className="h-px bg-gray-200 mx-1 my-0.5" />

        {/* Layers / style toggle */}
        <button
          onClick={() => setStyleMenuOpen(o => !o)}
          title="Kiểu bản đồ"
          className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-all border text-sm ${
            styleMenuOpen ? "bg-red-600 text-white border-red-600 shadow-lg" : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50 hover:shadow-lg"
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* ── Selected property card ───────────────────────────────────────── */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1000]">
          <button onClick={() => setSelected(null)} className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 z-10 shadow">
            <X className="w-3.5 h-3.5" />
          </button>
          <img src={selected.images[0]} alt={selected.title} className="w-full h-36 object-cover" />
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${selected.type === "ban" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                {selected.type === "ban" ? "Bán" : "Thuê"}
              </span>
              {selected.isVip && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">VIP</span>}
            </div>
            <div className="text-red-600 font-black text-lg">{formatPrice(selected.price, selected.priceUnit)}</div>
            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mt-0.5 mb-1">{selected.title}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{selected.district}, {selected.city}</span>
            </div>
            {(selected.area || selected.bedrooms) && (
              <div className="flex gap-3 text-xs text-gray-500 mb-3">
                {selected.area    && <span>📐 {selected.area} m²</span>}
                {selected.bedrooms && <span>🛏 {selected.bedrooms} PN</span>}
                {selected.bathrooms && <span>🚿 {selected.bathrooms} WC</span>}
              </div>
            )}
            <Link href={`/bat-dong-san/${selected.id}`} className="block w-full text-center bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-red-700 transition-colors">
              Xem chi tiết →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
