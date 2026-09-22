import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /search stays crawlable on purpose: the page carries its own noindex, and a crawler has to
        // fetch it to see that. Blocking it here only let bare search URLs linger in the index.
        disallow: ["/admin", "/api/", "/auth/"],
      },
      // Let the AdSense crawler see every public page so ads match content.
      { userAgent: "Mediapartners-Google", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
