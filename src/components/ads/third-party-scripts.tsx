import Script from "next/script";

export function AdsenseScript({ clientId }: { clientId: string }) {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
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
