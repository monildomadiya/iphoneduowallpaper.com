import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";
import { HOME_DESCRIPTION, homeTitle } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfbfd",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
