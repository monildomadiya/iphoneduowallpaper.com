import { ImageResponse } from "next/og";

export const alt = "iPhone Duo Wallpapers — free full-resolution wallpapers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          background: "radial-gradient(circle at 75% 40%, #1c1c3a 0%, #000 65%)",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1a6", fontWeight: 600 }}>iPhone Duo Wallpapers</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, lineHeight: 1.02, marginTop: 18 }}>
            <span>Wallpapers,</span>
            <span style={{ color: "#8f7bff" }}>unfolded.</span>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1a6", marginTop: 26 }}>
            Free 4K wallpapers for the inner and outer displays.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
          <div
            style={{
              width: 150,
              height: 218,
              borderRadius: 26,
              border: "6px solid #3a3a3c",
              background: "linear-gradient(160deg, #0a84ff, #6e5bff 55%, #d85bb0)",
            }}
          />
          <div
            style={{
              width: 300,
              height: 211,
              borderRadius: 18,
              border: "6px solid #3a3a3c",
              background: "linear-gradient(135deg, #ff8a3d, #d85bb0 45%, #6e5bff)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
