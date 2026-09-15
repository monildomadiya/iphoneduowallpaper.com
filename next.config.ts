import type { NextConfig } from "next";
import { siteUrl } from "./src/lib/env";

// Render also serves the site on its onrender.com address; send that copy to the custom domain.
const renderHost = process.env.RENDER_EXTERNAL_HOSTNAME || "iphoneduowallpaper-com.onrender.com";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
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
      { source: "/category/:slug", destination: "/categories/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
