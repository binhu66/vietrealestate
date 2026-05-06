import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BinHorizon - Bất động sản Việt Nam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "white",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 900,
              color: "#dc2626",
            }}
          >
            VR
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 56, fontWeight: 900, color: "white", lineHeight: 1.1 }}>
              BinHorizon
            </span>
            <span style={{ fontSize: 22, color: "rgba(255,255,255,0.8)" }}>
              Bất động sản Việt Nam
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Sàn giao dịch bất động sản hàng đầu Việt Nam
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 40,
            padding: "16px 40px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 16,
            color: "white",
            fontSize: 20,
          }}
        >
          <span>🏠 125,000+ tin đăng</span>
          <span>·</span>
          <span>👥 2.5M+ người dùng</span>
          <span>·</span>
          <span>📍 63 tỉnh thành</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
