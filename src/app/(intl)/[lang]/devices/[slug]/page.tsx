import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { FaqList } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { DeviceFrame, bestVariantFor } from "@/components/wallpaper/device-frame";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { getDeviceBySlug } from "@/lib/data/taxonomy";
import { FOREIGN_LOCALES, isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { deviceCopy, localizedDeviceFaq } from "@/lib/i18n/taxonomy";
import { localizedOrientation } from "@/lib/i18n/wallpaper-copy";
import { buildMetadata, faqJsonLd, localizedPageJsonLd } from "@/lib/seo";
import { mockupDate } from "@/lib/site";
import { aspectRatioLabel, imageUrl } from "@/lib/utils";

// Renders on the server before responding so untranslated devices return a real 404 status.
export const instant = false;

export function generateStaticParams() {
  return FOREIGN_LOCALES.flatMap((lang) =>
    Object.keys(localeContent(lang).taxonomy.devices).map((slug) => ({ lang, slug })),
  );
}

async function load(lang: string, slug: string) {
  if (!isForeignLocale(lang)) return null;
  const copy = deviceCopy(lang, slug);
  const device = copy ? await getDeviceBySlug(slug) : null;
  return copy && device ? { lang, copy, device } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/devices/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = await load(lang, slug);
  if (!found) return { title: "Not found", robots: { index: false, follow: true } };
  const { copy, device } = found;
  const { taxonomy, ogLocale } = localeContent(found.lang);
  return buildMetadata({
    title: copy.title,
    absoluteTitle: true,
    description: fill(taxonomy.deviceSeoDescription, { name: copy.name, faqName: copy.faqName, w: device.width, h: device.height }),
    path: `/${found.lang}/devices/${slug}`,
    languages: languageAlternates(`/devices/${slug}`),
    locale: ogLocale,
    noIndex: device.wallpaper_count === 0,
  });
}

export default async function LocalizedDevicePage({ params, searchParams }: PageProps<"/[lang]/devices/[slug]">) {
  const { lang, slug } = await params;
  const found = await load(lang, slug);
  if (!found) notFound();
  const { copy, device } = found;
  const locale = found.lang;
  const { taxonomy, chrome, wallpaper } = localeContent(locale);
  const path = `/${locale}/devices/${slug}`;

  const variant = device.width > device.height ? "duo-inner" : bestVariantFor(device.width, device.height);
  const specs = [
    {
      label: taxonomy.specs.display,
      value: device.diagonal_in ? fill(taxonomy.specs.inch, { n: device.diagonal_in.toLocaleString(locale) }) : "—",
    },
    { label: taxonomy.specs.resolution, value: `${device.width} × ${device.height} px` },
    { label: taxonomy.specs.ratio, value: aspectRatioLabel(device.width, device.height).replace(".", ",") },
    { label: taxonomy.specs.density, value: device.ppi ? `${device.ppi} ppi` : "—" },
    { label: taxonomy.specs.orientation, value: localizedOrientation(device.width, device.height, wallpaper) },
  ];
  const faqs = localizedDeviceFaq(device, locale);

  return (
    <>
      <JsonLd
        data={[
          localizedPageJsonLd({ name: copy.title, description: copy.description, path, inLanguage: locale }),
          faqJsonLd(faqs),
        ]}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: taxonomy.devicesHub.eyebrow, path: `/${locale}/devices` },
            { name: copy.name, path },
          ]}
          home={{ name: chrome.homeLabel, path: chrome.homeHref }}
        />
      </div>
      <div className="container-apple grid items-center gap-10 pb-12 pt-6 md:grid-cols-[1.2fr_1fr] md:pt-10">
        <PageHeader
          eyebrow={device.family}
          title={copy.h1}
          description={copy.description}
          className="px-0 pb-0 pt-0 md:pb-0 md:pt-0"
        >
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-2xl bg-surface p-4">
                <dt className="text-[12px] font-medium text-fg-3">{spec.label}</dt>
                <dd className="mt-1 text-[15px] font-semibold tracking-tight">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </PageHeader>
        <div className="flex justify-center">
          <DeviceFrame
            variant={variant}
            src={device.cover_thumb_key ? imageUrl(device.cover_thumb_key) : null}
            artwork={2}
            date={mockupDate(locale)}
            className={variant === "duo-inner" ? "w-full max-w-[460px]" : "w-[52%] max-w-[250px]"}
            priority
          />
        </div>
      </div>
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing basePath={path} searchParams={searchParams} deviceId={device.id} locale={locale} />
      </section>

      <section className="container-apple mt-20 mb-8">
        <SectionHeading title={fill(taxonomy.sizesTitle, { name: copy.name })} subtitle={taxonomy.sizesSubtitle} />
        <div className="mt-8">
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  );
}
