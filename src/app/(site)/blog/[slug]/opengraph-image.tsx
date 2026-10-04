import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";

export const alt = "Guide from iPhone Duo Wallpapers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card for guides without a cover: the headline does the selling in a chat preview or a feed. */
export default async function GuideImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  const title = post?.title ?? "Guides & tips for iPhone wallpapers";
  const minutes = post ? Math.max(1, Math.round(post.content.trim().split(/\s+/).length / 220)) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 20%, #2a1f5c 0%, #0b0b14 55%, #000 100%)",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, fontWeight: 600, color: "#a1a1a6" }}>
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #0a84ff, #6e5bff 55%, #d85bb0)",
              color: "#fff",
              fontSize: 24,
            }}
          >
            Guide
          </div>
          {settings.site_name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 64 ? 62 : 76,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a1a1a6" }}>
          <span>iphoneduowallpaper.com/blog</span>
          {minutes ? <span>{minutes} min read</span> : <span />}
        </div>
      </div>
    ),
    size,
  );
}
