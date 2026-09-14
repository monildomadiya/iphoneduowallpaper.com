import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { InlineScript } from "@/components/site/inline-script";
import { getSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Runs before first paint so the saved theme never flashes.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})();`;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description =
    "Free 4K wallpapers made for iPhone Duo's inner and outer displays, iPhone 18 Pro and iPhone 18 Pro Max. Hand-picked, full resolution, no sign-up.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.site_name} — Free 4K Wallpapers for iPhone Duo`,
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
      title: `${settings.site_name} — Free 4K Wallpapers for iPhone Duo`,
      description,
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false, email: false, address: false },
    appleWebApp: { capable: true, title: "Duo Wallpapers", statusBarStyle: "black-translucent" },
    ...(settings.adsense_client_id
      ? { other: { "google-adsense-account": settings.adsense_client_id } }
      : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <InlineScript html={THEME_SCRIPT} />
      </head>
      <body className="min-h-dvh">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
