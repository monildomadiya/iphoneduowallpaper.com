import type { NextConfig } from "next";
import { siteUrl, supabaseUrl, supabasePublishableKey } from "./src/lib/env";

// Render also serves the site on its onrender.com address; send that copy to the custom domain.
const renderHost = process.env.RENDER_EXTERNAL_HOSTNAME || "iphoneduowallpaper-com.onrender.com";

/** Wallpapers whose slug changed: brand words dropped, copy-paste "-2" duplicates given their own names. */
const RENAMED_WALLPAPERS: Record<string, string> = {
  "blue-and-orange-glow-duo-wallpaper-for-iphone-iphoneduowallpaper": "blue-orange-glow-duo-wallpaper",
  "midnight-sage-gold-geometric-duo-wallpaper-for-iphone": "midnight-sage-gold-geometric-duo-wallpaper",
  "moonlit-halloween-window-iphone-duo-wallpaper-2": "ivy-halloween-balcony-string-lights-iphone-duo-wallpaper",
  "golden-cosmic-glass-orbs-iphone-duo-wallpaper-2": "violet-liquid-silk-waves-iphone-duo-wallpaper",
  "neon-purple-orb-abstract-duo-wallpa": "neon-purple-orb-abstract-duo-wallpaper",
  "minimal-white-sports-car-mountain-wallpape": "minimal-white-sports-car-mountain-wallpaper",
};

/** Categories whose slug changed. "Anime 4K" promised a resolution the files didn't have. */
const RENAMED_CATEGORIES: Record<string, string> = {
  "anime-4k": "anime",
};

const LOCALE_PREFIXES = ["", "/es", "/tr"];

/** A content rename must reach the database before its redirect can go live. */
async function existingRenameTargets(table: "wallpapers" | "categories", targets: string[]) {
  if (!supabaseUrl || !supabasePublishableKey) return new Set<string>();
  try {
    const url = new URL(`/rest/v1/${table}`, supabaseUrl);
    url.searchParams.set("select", "slug");
    url.searchParams.set("slug", `in.(${targets.join(",")})`);
    url.searchParams.set(table === "wallpapers" ? "status" : "is_active", table === "wallpapers" ? "eq.published" : "eq.true");
    const response = await fetch(url, {
      headers: { apikey: supabasePublishableKey },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = (await response.json()) as { slug: string }[];
    return new Set(rows.map((row) => row.slug));
  } catch {
    console.warn(`Skipping unverified ${table} rename redirects; existing URLs remain accessible.`);
    return new Set<string>();
  }
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Workers cannot reliably run Cache Components' timer-based rendering scheduler.
  // Public database reads use the Data Cache with mutation tags instead.
  cacheComponents: false,
  partialPrefetching: false,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // English, Spanish/Turkish and admin have separate root layouts; unmatched URLs need a 404 of their own.
    globalNotFound: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    const [wallpaperTargets, categoryTargets] = await Promise.all([
      existingRenameTargets("wallpapers", Object.values(RENAMED_WALLPAPERS)),
      existingRenameTargets("categories", Object.values(RENAMED_CATEGORIES)),
    ]);
    return [
      ...(siteUrl.includes(renderHost)
        ? []
        : [
            {
              // Everything except the health check, which Render still calls on its own address.
              source: "/:path((?!api/health$).*)",
              has: [{ type: "host" as const, value: renderHost }],
              destination: `${siteUrl}/:path`,
              permanent: true,
            },
          ]),
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/wallpaper/:slug", destination: "/wallpapers/:slug", permanent: true },
      ...LOCALE_PREFIXES.flatMap((prefix) => [
        ...Object.entries(RENAMED_WALLPAPERS).filter(([, to]) => wallpaperTargets.has(to)).map(([from, to]) => ({
          source: `${prefix}/wallpapers/${from}`,
          destination: `${prefix}/wallpapers/${to}`,
          permanent: true,
        })),
        ...Object.entries(RENAMED_CATEGORIES).filter(([, to]) => categoryTargets.has(to)).map(([from, to]) => ({
          source: `${prefix}/categories/${from}`,
          destination: `${prefix}/categories/${to}`,
          permanent: true,
        })),
      ]),
      ...(categoryTargets.has("anime") ? [{ source: "/category/anime-4k", destination: "/categories/anime", permanent: true }] : []),
      { source: "/category/:slug", destination: "/categories/:slug", permanent: true },
      // Collections were retired; send old links and search results to the full library.
      { source: "/collections/:path*", destination: "/wallpapers", permanent: true },
    ];
  },
};

export default nextConfig;
