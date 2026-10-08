import { Check, CircleAlert, Download, Expand, Flag, Info, WandSparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { ShareButton, ViewTracker } from "@/components/wallpaper/client-actions";
import { WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { WallpaperPreview } from "@/components/wallpaper/wallpaper-preview";
import { getSiteSettings } from "@/lib/data/settings";
import { getDevices } from "@/lib/data/taxonomy";
import { getRelatedWallpapers, getWallpaperBySlug } from "@/lib/data/wallpapers";
import { FOREIGN_LOCALES, isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { localizedFitNote, localizedOrientation, localizedOverview } from "@/lib/i18n/wallpaper-copy";
import { categoryCopy, categoryHref, deviceCopy, deviceHref } from "@/lib/i18n/taxonomy";
import { translatedWallpaperSlugs, wallpaperTranslation } from "@/lib/i18n/wallpapers";
import { buildMetadata, wallpaperJsonLd } from "@/lib/seo";
import { absoluteUrl, cn, formatBytes, formatDate, imageUrl, qualityLabel, screenFit, truncate } from "@/lib/utils";
import { screenFitDetail } from "@/lib/wallpaper-copy";

// Renders on the server before responding so untranslated slugs return a real 404 status.
export const instant = false;

export function generateStaticParams() {
  return FOREIGN_LOCALES.flatMap((lang) => translatedWallpaperSlugs(lang).slice(0, 12).map((slug) => ({ lang, slug })));
}

const MAX_TITLE = 60;

function pageTitle(title: string, suffix: string, shortSuffix: string) {
  if (title.length + suffix.length <= MAX_TITLE) return `${title}${suffix}`;
  if (title.length + shortSuffix.length <= MAX_TITLE) return `${title}${shortSuffix}`;
  return title;
}

async function load(lang: string, slug: string) {
  if (!isForeignLocale(lang)) return null;
  const translation = wallpaperTranslation(lang, slug);
  if (!translation) return null;
  const wallpaper = await getWallpaperBySlug(slug);
  return wallpaper ? { lang, translation, wallpaper, content: localeContent(lang) } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/wallpapers/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = await load(lang, slug);
  if (!found) return { title: "Not found", robots: { index: false, follow: true } };
  const { translation, wallpaper, content } = found;
  const t = content.wallpaper;
  return buildMetadata({
    title: pageTitle(translation.title, t.suffix, t.shortSuffix),
    absoluteTitle: true,
    description: truncate(translation.description, 155),
    path: `/${found.lang}/wallpapers/${wallpaper.slug}`,
    languages: languageAlternates(`/wallpapers/${wallpaper.slug}`),
    locale: content.ogLocale,
    image: {
      url: imageUrl(wallpaper.preview_key),
      width: 1080,
      height: Math.round((1080 * wallpaper.height) / wallpaper.width),
      alt: `${translation.title} — ${t.kicker}`,
    },
  });
}

const FIT_STYLES = {
  sharp: { icon: Check, className: "text-success" },
  good: { icon: Check, className: "text-success" },
  low: { icon: CircleAlert, className: "text-warning" },
  crop: { icon: CircleAlert, className: "text-warning" },
} as const;

function formatLabel(mime: string) {
  return mime.replace("image/", "").replace("jpeg", "jpg").toUpperCase();
}

export default async function LocalizedWallpaperPage({ params }: PageProps<"/[lang]/wallpapers/[slug]">) {
  const { lang, slug } = await params;
  const found = await load(lang, slug);
  if (!found) notFound();
  const { translation, wallpaper, content } = found;
  const locale = found.lang;
  const t = content.wallpaper;
  const { chrome } = content;

  const [settings, devices, related] = await Promise.all([
    getSiteSettings(),
    getDevices(),
    getRelatedWallpapers(wallpaper.id, wallpaper.category_id, 10),
  ]);

  const path = `/${locale}/wallpapers/${wallpaper.slug}`;
  const categoryName = wallpaper.category
    ? (categoryCopy(locale, wallpaper.category.slug)?.name ?? t.categories[wallpaper.category.slug] ?? wallpaper.category.name)
    : null;
  const details = [
    {
      label: t.labels.resolution,
      value: `${wallpaper.width} × ${wallpaper.height} px (${qualityLabel(wallpaper.width, wallpaper.height)})`,
    },
    { label: t.labels.orientation, value: localizedOrientation(wallpaper.width, wallpaper.height, t) },
    { label: t.labels.file, value: `${formatLabel(wallpaper.mime_type)} · ${formatBytes(wallpaper.file_size)}` },
    { label: t.labels.published, value: formatDate(wallpaper.published_at ?? wallpaper.created_at, undefined, locale) },
    { label: t.labels.downloads, value: wallpaper.downloads.toLocaleString(locale) },
    { label: t.labels.source, value: t.source[wallpaper.source_type] },
  ];
  const downloads = fill(wallpaper.downloads === 1 ? t.downloadsOne : t.downloadsMany, {
    n: wallpaper.downloads.toLocaleString(locale),
  });

  return (
    <>
      <JsonLd
        data={{
          ...wallpaperJsonLd(wallpaper, settings),
          name: translation.title,
          description: translation.description,
          url: absoluteUrl(path),
          inLanguage: locale,
        }}
      />
      <ViewTracker id={wallpaper.id} />

      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: t.breadcrumb, path: `/${locale}/wallpapers` },
            ...(wallpaper.category && categoryName
              ? [{ name: categoryName, path: categoryHref(wallpaper.category.slug, locale) }]
              : []),
            { name: translation.title, path },
          ]}
          home={{ name: chrome.homeLabel, path: chrome.homeHref }}
        />

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <WallpaperPreview
              src={imageUrl(wallpaper.preview_key)}
              alt={`${translation.title} — ${t.kicker}, ${wallpaper.width}×${wallpaper.height}`}
              color={wallpaper.dominant_color}
              width={wallpaper.width}
              height={wallpaper.height}
              labels={t.preview}
            />
          </div>

          <article>
            <p className="text-[15px] font-semibold text-fg-2">
              {wallpaper.category && categoryName ? (
                <Link href={categoryHref(wallpaper.category.slug, locale)} className="hover:text-link">
                  {categoryName}
                </Link>
              ) : null}
              {wallpaper.category && categoryName ? " · " : null}
              {t.kicker}
            </p>
            <h1 className="headline-page mt-2 text-balance">{translation.title}</h1>
            <p className="mt-3 text-[17px] text-fg-2">
              {wallpaper.width} × {wallpaper.height} · {formatBytes(wallpaper.file_size)} · {downloads}
            </p>
            <p className="mt-5 text-[17px] leading-7 text-fg-2">{translation.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`/api/download/${wallpaper.id}`} rel="nofollow" className="btn-primary h-12 min-w-[220px] flex-1">
                <Download className="size-[18px]" />
                {t.download}
                <span className="font-normal opacity-80">· {formatBytes(wallpaper.file_size)}</span>
              </a>
              <a
                href={`/api/download/${wallpaper.id}?mode=view`}
                rel="nofollow noopener"
                target="_blank"
                className="btn-secondary h-12"
              >
                <Expand className="size-[18px]" />
                {t.viewFull}
              </a>
              <ShareButton
                title={translation.title}
                path={path}
                labels={{ share: t.share, copied: t.copied, copyFailed: t.copyFailed, aria: t.share }}
              />
            </div>
            <Link
              href={`/${locale}/maker?wallpaper=${wallpaper.slug}`}
              rel="nofollow"
              className="link-apple mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium"
            >
              <WandSparkles className="size-4" />
              {t.maker}
            </Link>
            <p className="mt-3 flex items-start gap-1.5 text-[13px] leading-5 text-fg-3">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                {t.saveTip}{" "}
                <Link href="/blog/how-to-save-wallpapers-to-iphone-photos" hrefLang="en" className="link-apple">
                  {t.saveTipLink}
                </Link>
                .
              </span>
            </p>

            <section className="mt-10">
              <h2 className="text-[19px] font-semibold tracking-tight">{t.about}</h2>
              <p className="mt-3 text-[15px] leading-6 text-fg-2">{localizedOverview(wallpaper, translation.title, t)}</p>
            </section>

            {devices.length ? (
              <section className="mt-8 rounded-[24px] bg-surface p-5 md:p-6">
                <h2 className="text-[19px] font-semibold tracking-tight">{t.fit}</h2>
                <ul className="mt-3 divide-y divide-line">
                  {devices.map((device) => {
                    const fit = screenFit(wallpaper.width, wallpaper.height, device.width, device.height);
                    const style = FIT_STYLES[fit.level];
                    const Icon = style.icon;
                    return (
                      <li key={device.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <Link href={deviceHref(device.slug, locale)} className="block truncate text-[15px] font-medium hover:text-link">
                            {deviceCopy(locale, device.slug)?.name ?? t.devices[device.slug] ?? device.name}
                          </Link>
                          <p className="text-[13px] text-fg-3">
                            {device.width} × {device.height} px ·{" "}
                            {localizedFitNote(screenFitDetail(wallpaper.width, wallpaper.height, device), t, locale)}
                          </p>
                        </div>
                        <span className={cn("inline-flex shrink-0 items-center gap-1 text-[13px] font-medium", style.className)}>
                          <Icon className="size-4" />
                          {t.levels[fit.level]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            <section className="mt-6 rounded-[24px] bg-surface p-5 md:p-6">
              <h2 className="text-[19px] font-semibold tracking-tight">{t.details}</h2>
              <dl className="mt-3 divide-y divide-line">
                {details.map((item) => (
                  <div key={item.label} className="flex justify-between gap-6 py-3 text-[15px]">
                    <dt className="text-fg-2">{item.label}</dt>
                    <dd className="text-right font-medium">{item.value}</dd>
                  </div>
                ))}
                {wallpaper.credit_name ? (
                  <div className="flex justify-between gap-6 py-3 text-[15px]">
                    <dt className="text-fg-2">{t.labels.credit}</dt>
                    <dd className="text-right font-medium">
                      {wallpaper.credit_url ? (
                        <a href={wallpaper.credit_url} target="_blank" rel="noopener noreferrer nofollow" className="link-apple">
                          {wallpaper.credit_name}
                        </a>
                      ) : (
                        wallpaper.credit_name
                      )}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <AdSlot placement="wallpaper_sidebar" className="mt-10" />

            <details className="group mt-10 border-y border-line py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {t.howTo}
                <span className="text-fg-3 transition group-open:rotate-45">+</span>
              </summary>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-6 text-fg-2">
                {t.steps.map((step, index) => (
                  <li key={step}>
                    {step}
                    {index === t.steps.length - 1 ? (
                      <>
                        {" "}
                        <Link href="/blog/how-to-set-wallpaper-on-iphone" hrefLang="en" className="link-apple">
                          {t.guide}
                        </Link>
                        .
                      </>
                    ) : null}
                  </li>
                ))}
              </ol>
            </details>

            <p className="mt-6 text-[13px] text-fg-3">
              {t.free}{" "}
              <Link href="/terms" className="link-apple">
                {t.terms}
              </Link>
              .{" "}
              <Link
                href={`/dmca?wallpaper=${wallpaper.slug}`}
                rel="nofollow"
                className="inline-flex items-center gap-1 hover:text-fg hover:underline"
              >
                <Flag className="size-3" />
                {t.report}
              </Link>
            </p>
          </article>
        </div>

        <AdSlot placement="wallpaper_bottom" className="mt-20" />

        {related.length ? (
          <section className="mt-20">
            <SectionHeading
              title={t.more}
              subtitle={categoryName ? fill(t.moreCategory, { name: categoryName }) : t.moreOther}
              href={wallpaper.category ? categoryHref(wallpaper.category.slug, locale) : `/${locale}/wallpapers`}
            />
            <WallpaperGrid wallpapers={related} locale={locale} />
          </section>
        ) : null}
      </div>
    </>
  );
}
