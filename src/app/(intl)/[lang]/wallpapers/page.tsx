import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { buildMetadata, localizedPageJsonLd } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/wallpapers">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { taxonomy, ogLocale } = localeContent(lang);
  return buildMetadata({
    title: taxonomy.wallpapersHub.title,
    absoluteTitle: true,
    description: taxonomy.wallpapersHub.description,
    path: `/${lang}/wallpapers`,
    languages: languageAlternates("/wallpapers"),
    locale: ogLocale,
  });
}

export default async function LocalizedWallpapersPage({ params, searchParams }: PageProps<"/[lang]/wallpapers">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { taxonomy, chrome, wallpaper } = localeContent(lang);
  const hub = taxonomy.wallpapersHub;
  const path = `/${lang}/wallpapers`;

  return (
    <>
      <JsonLd data={localizedPageJsonLd({ name: hub.title, description: hub.description, path, inLanguage: lang })} />
      <div className="container-apple pt-6">
        <Breadcrumbs items={[{ name: wallpaper.breadcrumb, path }]} home={{ name: chrome.homeLabel, path: chrome.homeHref }} />
      </div>
      <PageHeader eyebrow={hub.eyebrow} title={hub.h1} description={hub.lead} className="pt-6 md:pt-10" />
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing basePath={path} searchParams={searchParams} locale={lang} />
      </section>
    </>
  );
}
