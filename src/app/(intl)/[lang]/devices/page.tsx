import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/site/markdown";
import { DeviceTiles } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { getDevices } from "@/lib/data/taxonomy";
import { isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { deviceCopy, deviceHref } from "@/lib/i18n/taxonomy";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/devices">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { taxonomy, ogLocale } = localeContent(lang);
  return buildMetadata({
    title: taxonomy.devicesHub.title,
    absoluteTitle: true,
    description: taxonomy.devicesHub.description,
    path: `/${lang}/devices`,
    languages: languageAlternates("/devices"),
    locale: ogLocale,
  });
}

export default async function LocalizedDevicesPage({ params }: PageProps<"/[lang]/devices">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { taxonomy, chrome } = localeContent(lang);
  const hub = taxonomy.devicesHub;
  const path = `/${lang}/devices`;
  const devices = await getDevices();
  const size = (inches: number | null) =>
    inches ? fill(taxonomy.specs.inch, { n: inches.toLocaleString(lang) }) : "—";

  return (
    <>
      <JsonLd
        data={{
          ...collectionPageJsonLd({
            name: hub.title,
            description: hub.description,
            path,
            breadcrumb: [{ name: hub.eyebrow, path }],
            items: devices
              .filter((item) => item.wallpaper_count > 0)
              .map((item) => ({ name: deviceCopy(lang, item.slug)?.h1 ?? item.name, path: deviceHref(item.slug, lang) })),
          }),
          inLanguage: lang,
        }}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs items={[{ name: hub.eyebrow, path }]} home={{ name: chrome.homeLabel, path: chrome.homeHref }} />
      </div>
      <PageHeader eyebrow={hub.eyebrow} title={hub.h1} description={hub.lead} className="pt-6 md:pt-10" />
      <section className="container-apple">
        <DeviceTiles devices={devices} locale={lang} />
        <div className="mt-16 overflow-x-auto rounded-[28px] bg-surface p-2">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <caption className="px-5 pb-2 pt-4 text-left text-[19px] font-semibold tracking-tight text-fg">{hub.caption}</caption>
            <thead className="text-[13px] text-fg-3">
              <tr>
                {hub.columns.map((column) => (
                  <th key={column} scope="col" className="px-5 py-3 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {devices.map((device) => (
                <tr key={device.id}>
                  <td className="px-5 py-3.5 font-medium">
                    <Link href={deviceHref(device.slug, lang)} className="hover:text-link">
                      {deviceCopy(lang, device.slug)?.name ?? device.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-fg-2">{size(device.diagonal_in)}</td>
                  <td className="px-5 py-3.5 text-fg-2">
                    {device.width} × {device.height} px
                  </td>
                  <td className="px-5 py-3.5 text-fg-2">{device.ppi ? `${device.ppi} ppi` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-[14px] text-fg-3">
          <Markdown content={hub.more} />
        </div>
      </section>
    </>
  );
}
