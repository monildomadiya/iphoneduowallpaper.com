import { AdsProvider } from "@/components/ads/ads-provider";
import { AdsenseScript, GoogleAnalytics } from "@/components/ads/third-party-scripts";
import { CookieBanner } from "@/components/site/cookie-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteSettings } from "@/lib/data/settings";
import { isProduction } from "@/lib/env";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const adsEnabled = settings.adsense_enabled && Boolean(settings.adsense_client_id);

  return (
    <AdsProvider
      config={{
        enabled: adsEnabled,
        clientId: settings.adsense_client_id,
        slots: settings.ad_slots,
        testMode: !isProduction,
      }}
    >
      <SiteHeader siteName={settings.site_name} announcement={settings.announcement} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter settings={settings} />
      {settings.cookie_banner_enabled ? <CookieBanner /> : null}
      {adsEnabled && settings.adsense_client_id ? <AdsenseScript clientId={settings.adsense_client_id} /> : null}
      {isProduction && settings.ga_measurement_id ? <GoogleAnalytics measurementId={settings.ga_measurement_id} /> : null}
    </AdsProvider>
  );
}
