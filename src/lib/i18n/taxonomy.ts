import { localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import type { CategoryCopy, DeviceCopy, Faq, ForeignLocale } from "@/lib/i18n/types";
import { aspectRatioLabel } from "@/lib/utils";

export function categoryCopy(locale: ForeignLocale, slug: string): CategoryCopy | null {
  return localeContent(locale).taxonomy.categories[slug] ?? null;
}

export function deviceCopy(locale: ForeignLocale, slug: string): DeviceCopy | null {
  return localeContent(locale).taxonomy.devices[slug] ?? null;
}

/** A category added later has no translated page until its copy is written, so it links to English. */
export function categoryHref(slug: string, locale?: ForeignLocale): string {
  return locale && categoryCopy(locale, slug) ? `/${locale}/categories/${slug}` : `/categories/${slug}`;
}

export function deviceHref(slug: string, locale?: ForeignLocale): string {
  return locale && deviceCopy(locale, slug) ? `/${locale}/devices/${slug}` : `/devices/${slug}`;
}

/** Decimal comma, as both Spanish and Turkish write it. */
function localizedRatio(width: number, height: number): string {
  return aspectRatioLabel(width, height).replace(".", ",");
}

/** The same three answers as the English device FAQ, from the device's own numbers. */
export function localizedDeviceFaq(
  device: { slug: string; name: string; family: string; width: number; height: number },
  locale: ForeignLocale,
): Faq[] {
  const { taxonomy, wallpaper } = localeContent(locale);
  const copy = taxonomy.devices[device.slug];
  const name = copy?.name ?? device.name;
  const faqName = copy?.faqName ?? device.name;
  const { width: w, height: h } = device;
  const portrait = h >= w;
  const isDuo = /duo/i.test(device.family) || /duo/i.test(device.name);
  const values = {
    name,
    faqName,
    w,
    h,
    ratio: localizedRatio(w, h),
    mp: ((w * h) / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }),
    orientation: portrait ? wallpaper.orientation.portrait : wallpaper.orientation.landscape,
  };
  const fit = isDuo && !portrait ? taxonomy.faq.fitInner : isDuo ? taxonomy.faq.fitDuoOuter : taxonomy.faq.fitNormal;
  return [
    // Questions are written to start with a capital or with the device name ("iPhone"), so nothing
    // is upper-cased here — Turkish casing would turn "iPhone" into "İPhone".
    { question: fill(taxonomy.faq.sizeQ, values), answer: fill(taxonomy.faq.sizeA, values) },
    { question: fill(taxonomy.faq.fitQ, values), answer: fill(fit, values) },
    { question: fill(taxonomy.faq.setQ, values), answer: fill(taxonomy.faq.setA, values) },
  ];
}
