import { AdsProvider } from "@/components/ads/ads-provider";
import { AdsenseScript, GoogleAnalytics } from "@/components/ads/third-party-scripts";
import { CookieBanner } from "@/components/site/cookie-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { adsConfigFromSettings } from "@/lib/ads";
import { getSiteSettings } from "@/lib/data/settings";
import { isProduction } from "@/lib/env";
import type { Chrome, CookieStrings } from "@/lib/i18n/types";

/** Header, footer, ads and analytics around every public page, in English or a translation. */
export async function SiteChrome({
  chrome,
  cookies,
  children,
}: {
  chrome?: Chrome;
  cookies?: CookieStrings;
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const ads = adsConfigFromSettings(settings, !isProduction);

  return (
    <AdsProvider config={ads}>
      <SiteHeader siteName={settings.site_name} announcement={settings.announcement} chrome={chrome} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter settings={settings} chrome={chrome} />
      {settings.cookie_banner_enabled ? <CookieBanner strings={cookies} /> : null}
      {/* The master switch really is a master switch: with ads off the script never loads, so Auto
          ads stop too. Site verification does not need it — the google-adsense-account meta tag in
          rootMetadata stays in place whether ads are serving or not. */}
      {ads.enabled && settings.adsense_client_id ? (
        <AdsenseScript
          clientId={settings.adsense_client_id}
          frequencyHint={settings.adsense_auto_ads ? settings.adsense_frequency_hint : null}
        />
      ) : null}
      {isProduction && settings.ga_measurement_id ? <GoogleAnalytics measurementId={settings.ga_measurement_id} /> : null}
    </AdsProvider>
  );
}
