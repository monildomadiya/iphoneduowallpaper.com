import Script from "next/script";

/**
 * A plain async script, which React hoists into <head> in the server HTML, where AdSense expects
 * its snippet. One tag serves both the manual units on the page and Auto ads, which are switched
 * on inside AdSense itself.
 *
 * `data-ad-frequency-hint` is how many Auto ads Google may insert, expressed as the reading time
 * between them (e.g. "30s"). It only affects Auto ads; manual units ignore it.
 */
export function AdsenseScript({ clientId, frequencyHint }: { clientId: string; frequencyHint?: string | null }) {
  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
      {...(frequencyHint ? { "data-ad-frequency-hint": frequencyHint } : {})}
    />
  );
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const id = encodeURIComponent(measurementId);
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId.replace(/[^A-Z0-9-]/gi, "")}');`}
      </Script>
    </>
  );
}
