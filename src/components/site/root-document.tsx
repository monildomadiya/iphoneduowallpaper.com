import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/data/settings";
import { r2PublicUrl, siteUrl } from "@/lib/env";
import { HOME_DESCRIPTION, homeTitle } from "@/lib/site";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

/** Site-wide defaults every page builds on: the title template, the base URL, the AdSense account. */
export async function rootMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description = HOME_DESCRIPTION;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: homeTitle(settings.site_name),
      template: `%s | ${settings.site_name}`,
    },
    description,
    applicationName: settings.site_name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: settings.site_name,
      locale: "en_US",
      url: "/",
      title: homeTitle(settings.site_name),
      description,
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false, email: false, address: false },
    appleWebApp: { capable: true, title: "Duo Wallpapers", statusBarStyle: "default" },
    ...(settings.adsense_client_id
      ? { other: { "google-adsense-account": settings.adsense_client_id } }
      : {}),
  };
}

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfbfd",
  colorScheme: "light",
};

/**
 * The <html> element. English, Spanish, Turkish and the admin panel each have a root layout of
 * their own so every page states its real language: a single shared root said lang="en" on /es
 * and /tr too, and it can't read the language without making every page render per request.
 */
export function RootDocument({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh">
        {/* Every public page shows wallpapers from the R2 domain; React hoists this into <head> so the
            connection opens while the HTML is still parsing. */}
        {r2PublicUrl ? <link rel="preconnect" href={r2PublicUrl} /> : null}
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
