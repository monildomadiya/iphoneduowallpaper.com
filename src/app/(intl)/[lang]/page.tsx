import { ChevronRight, Download, Layers, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Markdown } from "@/components/site/markdown";
import { CategoryTiles, FaqList, PostCard } from "@/components/site/tiles";
import { JsonLd, SectionHeading } from "@/components/ui/primitives";
import { DeviceFrame } from "@/components/wallpaper/device-frame";
import { WallpaperCard, WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { getCategories, getDarkCategory } from "@/lib/data/taxonomy";
import { listWallpapers } from "@/lib/data/wallpapers";
import { guideCard, isForeignLocale, languageAlternates, localeContent, localizedPath } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { buildMetadata, faqJsonLd, localizedPageJsonLd } from "@/lib/seo";
import { formatNumber, imageUrl, stockedFirst } from "@/lib/utils";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { home, ogLocale } = localeContent(lang);
  return buildMetadata({
    title: home.title,
    absoluteTitle: true,
    description: home.description,
    path: localizedPath(lang, "/"),
    languages: languageAlternates("/"),
    locale: ogLocale,
  });
}

export default async function LocalizedHomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const content = localeContent(lang);
  const { home } = content;

  const [featured, latest, categories, dark] = await Promise.all([
    listWallpapers({ featured: true, perPage: 12 }),
    listWallpapers({ perPage: 15 }),
    getCategories(),
    getDarkCategory(),
  ]);
  const showcase = featured.items.length ? featured.items : latest.items;
  const outer = showcase.find((item) => item.height > item.width) ?? showcase[0] ?? null;
  const inner = showcase.find((item) => item.width >= item.height && item.id !== outer?.id) ?? outer;

  return (
    <>
      <JsonLd
        data={[
          localizedPageJsonLd({
            name: home.title,
            description: home.description,
            path: localizedPath(lang, "/"),
            inLanguage: lang,
          }),
          faqJsonLd(home.faq),
        ]}
      />

      <section className="relative -mt-[4.25rem] overflow-hidden pt-[4.25rem] md:-mt-20 md:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-18%] h-[720px] w-[1200px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(10,132,255,0.28), rgba(110,91,255,0.18) 45%, rgba(216,91,176,0.1) 70%, transparent)",
            }}
          />
        </div>

        <div className="container-apple pt-14 text-center md:pt-24">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-line bg-elevated/70 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-fg-2 backdrop-blur">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">{home.badgeNew}</span>
            {home.badge}
          </p>
          <h1 className="headline-hero mx-auto mt-6 max-w-4xl text-balance">
            {home.h1} <span className="text-gradient-duo">{home.h1Accent}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[19px] leading-7 text-fg-2 md:text-[23px] md:leading-8">
            {home.intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href="/wallpapers" className="btn-primary">
              {home.browse}
            </Link>
            <Link href="/categories" className="link-apple inline-flex items-center gap-0.5 text-[17px]">
              {home.explore}
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="container-apple relative mt-14 md:mt-20">
          <div className="mx-auto flex max-w-5xl items-end justify-center gap-4 sm:gap-8">
            <Link
              href={outer ? `/wallpapers/${outer.slug}` : "/wallpapers"}
              aria-label={outer?.title ?? home.browse}
              className="block w-[31%] max-w-[250px] animate-float"
            >
              <DeviceFrame
                variant="duo-outer"
                src={outer ? imageUrl(outer.preview_key) : null}
                color={outer?.dominant_color}
                priority
                artwork={0}
              />
            </Link>
            <Link
              href={inner ? `/wallpapers/${inner.slug}` : "/wallpapers"}
              aria-label={inner?.title ?? home.browse}
              className="block w-[64%] max-w-[640px] animate-float-delayed"
            >
              <DeviceFrame
                variant="duo-inner"
                src={inner ? imageUrl(inner.preview_key) : null}
                color={inner?.dominant_color}
                priority
                artwork={2}
              />
            </Link>
          </div>
        </div>

        <div className="container-apple mt-14">
          <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { icon: Layers, label: fill(home.stats.wallpapers, { n: formatNumber(latest.total) }) },
              { icon: Sparkles, label: home.stats.fullResolution },
              { icon: Download, label: home.stats.free },
              { icon: ShieldCheck, label: home.stats.original },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 text-[15px] font-medium text-fg-2">
                <Icon className="size-6 text-fg" strokeWidth={1.6} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-apple">
        <AdSlot placement="home_top" className="mt-16" />
      </div>

      {featured.items.length ? (
        <section className="mt-24">
          <div className="container-apple">
            <SectionHeading title={home.featured[0]} subtitle={home.featured[1]} href="/wallpapers" linkLabel={home.viewAll} />
          </div>
          <ul className="no-scrollbar container-apple flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {featured.items.map((wallpaper, index) => (
              <li key={wallpaper.id} className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[19%]">
                <WallpaperCard wallpaper={wallpaper} sizes="large" priority={index < 2} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {latest.items.length ? (
        <section className="container-apple mt-24">
          <SectionHeading title={home.latest[0]} subtitle={home.latest[1]} href="/wallpapers" linkLabel={home.viewAll} />
          <WallpaperGrid wallpapers={latest.items} />
        </section>
      ) : null}

      <div className="container-apple">
        <AdSlot placement="home_middle" className="mt-20" />
      </div>

      <section className="container-apple mt-24">
        <SectionHeading title={home.categories[0]} subtitle={home.categories[1]} href="/categories" linkLabel={home.viewAll} />
        <CategoryTiles categories={stockedFirst([dark, ...categories]).slice(0, 10)} />
      </section>

      <section className="container-apple mt-24">
        <SectionHeading title={home.guides[0]} subtitle={home.guides[1]} href={`/${lang}/blog`} linkLabel={home.viewAll} />
        <ul className="grid gap-5 md:grid-cols-3">
          {content.guides.map((guide) => (
            <li key={guide.slug}>
              <PostCard post={guideCard(guide)} href={`/${lang}/blog/${guide.slug}`} locale={lang} />
            </li>
          ))}
        </ul>
      </section>

      <section className="container-apple mt-24">
        <div className="max-w-3xl">
          <h2 className="headline-section">{home.aboutTitle}</h2>
          <div className="mt-5">
            <Markdown content={home.about} />
          </div>
        </div>
      </section>

      <section className="container-apple mt-24">
        <div className="flex flex-col items-start gap-6 rounded-[32px] bg-surface px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <div className="max-w-2xl">
            <h2 className="headline-section">{home.makerTitle}</h2>
            <p className="mt-3 text-[17px] leading-7 text-fg-2">{home.makerBody}</p>
          </div>
          <Link href={`/${lang}/maker`} className="btn-primary shrink-0">
            {home.makerCta}
          </Link>
        </div>
      </section>

      <section className="container-apple mt-24">
        <SectionHeading title={home.faqTitle[0]} subtitle={home.faqTitle[1]} />
        <FaqList faqs={home.faq} />
      </section>
    </>
  );
}
