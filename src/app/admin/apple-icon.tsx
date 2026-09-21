import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon for the admin panel. Same Duo mark as the site, on the
 * accent blue, so the two icons are siblings but never confused.
 */
export default function AdminAppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "linear-gradient(135deg, #0a84ff, #6e5bff)",
        }}
      >
        <div style={{ width: 56, height: 124, borderRadius: 16, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ width: 56, height: 124, borderRadius: 16, background: "#ffffff" }} />
      </div>
    ),
    size,
  );
}
