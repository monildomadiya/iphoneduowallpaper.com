import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DuoMaker } from "@/components/maker/duo-maker";
import { Markdown } from "@/components/site/markdown";
import { FaqList } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { getWallpaperBySlug } from "@/lib/data/wallpapers";
import { isForeignLocale, languageAlternates, localeContent, localizedPath } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import type { ForeignLocale } from "@/lib/i18n/types";
import { wallpaperTranslation } from "@/lib/i18n/wallpapers";
import { buildMetadata, faqJsonLd, webApplicationJsonLd } from "@/lib/seo";
import { imageUrl } from "@/lib/utils";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/maker">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { maker, ogLocale } = localeContent(lang);
  return buildMetadata({
    title: maker.title,
    description: maker.description,
    path: localizedPath(lang, "/maker"),
    languages: languageAlternates("/maker"),
    locale: ogLocale,
  });
}

async function MakerWithWallpaper({
  locale,
  searchParams,
}: {
  locale: ForeignLocale;
  searchParams: PageProps<"/[lang]/maker">["searchParams"];
}) {
  const { wallpaper: slug } = await searchParams;
  const wallpaper = typeof slug === "string" ? await getWallpaperBySlug(slug) : null;
  const strings = localeContent(locale).maker.ui;
  return (
    <DuoMaker
      key={wallpaper?.id ?? "blank"}
      strings={strings}
      wallpaper={
        wallpaper
          ? {
              url: imageUrl(wallpaper.original_key),
              slug: wallpaper.slug,
              title: wallpaperTranslation(locale, wallpaper.slug)?.title ?? wallpaper.title,
            }
          : null
      }
    />
  );
}

export default async function LocalizedMakerPage({ params, searchParams }: PageProps<"/[lang]/maker">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { maker, chrome } = localeContent(lang);
  const path = localizedPath(lang, "/maker");

  return (
    <>
      <JsonLd
        data={[
          { ...webApplicationJsonLd({ name: maker.title, description: maker.description, path }), inLanguage: lang },
          faqJsonLd(maker.faq),
        ]}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs items={[{ name: maker.breadcrumb, path }]} home={{ name: chrome.homeLabel, path: chrome.homeHref }} />
      </div>
      <PageHeader eyebrow={maker.eyebrow} title={maker.h1} description={maker.lead} />

      <section className="container-apple" aria-label={maker.h1}>
        <Suspense fallback={<DuoMaker wallpaper={null} strings={maker.ui} />}>
          <MakerWithWallpaper locale={lang} searchParams={searchParams} />
        </Suspense>
      </section>

      <section className="container-apple mt-24">
        <SectionHeading title={maker.stepsTitle[0]} subtitle={maker.stepsTitle[1]} />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {maker.steps.map((step, index) => (
            <li key={step.title} className="rounded-[24px] bg-surface p-6">
              <p className="text-[13px] font-semibold text-fg-3">{fill(maker.step, { n: index + 1 })}</p>
              <h3 className="mt-2 text-[19px] font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-fg-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-apple mt-24">
        <div className="max-w-3xl">
          <h2 className="headline-section">{maker.whyTitle}</h2>
          <div className="mt-5">
            <Markdown content={maker.why} />
          </div>
        </div>
      </section>

      <section className="container-apple mt-24">
        <SectionHeading title={maker.faqTitle[0]} subtitle={maker.faqTitle[1]} />
        <FaqList faqs={maker.faq} />
      </section>
    </>
  );
}
