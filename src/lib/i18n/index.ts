import { siteUrl } from "@/lib/env";
import { DE } from "@/lib/i18n/de";
import { ES } from "@/lib/i18n/es";
import { KO } from "@/lib/i18n/ko";
import { TR } from "@/lib/i18n/tr";
import { wallpaperTranslation } from "@/lib/i18n/wallpapers";
import { ZH } from "@/lib/i18n/zh";
import type { ForeignLocale, LocalGuide, LocaleContent } from "@/lib/i18n/types";
import type { PostCardData } from "@/lib/types";

export const FOREIGN_LOCALES: ForeignLocale[] = ["es", "tr", "zh", "ko", "de"];

const CONTENT: Record<ForeignLocale, LocaleContent> = { es: ES, tr: TR, zh: ZH, ko: KO, de: DE };

export function isForeignLocale(value: string): value is ForeignLocale {
  return (FOREIGN_LOCALES as string[]).includes(value);
}

export function localeContent(locale: ForeignLocale): LocaleContent {
  return CONTENT[locale];
}

/** English paths every language translates; the translated path is the prefix + the same path. */
const HUBS = ["/", "/maker", "/wallpapers", "/categories", "/devices", "/about", "/contact"];

/** English paths with a translation in this language. Guides and taxonomy copy are per language. */
export function translatedEnglishPaths(locale: ForeignLocale): string[] {
  const { guides, taxonomy } = CONTENT[locale];
  return [
    ...HUBS,
    ...guides.map((guide) => `/blog/${guide.slug}`),
    ...Object.keys(taxonomy.categories).map((slug) => `/categories/${slug}`),
    ...Object.keys(taxonomy.devices).map((slug) => `/devices/${slug}`),
  ];
}

const TRANSLATED = Object.fromEntries(
  FOREIGN_LOCALES.map((locale) => [locale, new Set(translatedEnglishPaths(locale))]),
) as Record<ForeignLocale, Set<string>>;

function isTranslated(locale: ForeignLocale, englishPath: string): boolean {
  const wallpaper = /^\/wallpapers\/([a-z0-9-]+)$/.exec(englishPath)?.[1];
  return TRANSLATED[locale].has(englishPath) || Boolean(wallpaper && wallpaperTranslation(locale, wallpaper));
}

export function localizedPath(locale: ForeignLocale, englishPath: string): string {
  return englishPath === "/" ? `/${locale}` : `/${locale}${englishPath}`;
}

/**
 * hreflang links for a page that exists in another language. Every version lists the same set —
 * only the languages that really have the page, itself included — plus x-default pointing at
 * English: Google ignores one-sided annotations, and a link to a 404 breaks the whole set.
 */
export function languageAlternates(englishPath: string): Record<string, string> | undefined {
  const locales = FOREIGN_LOCALES.filter((locale) => isTranslated(locale, englishPath));
  if (!locales.length) return undefined;
  const url = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);
  return {
    en: url(englishPath),
    ...Object.fromEntries(locales.map((locale) => [locale, url(localizedPath(locale, englishPath))])),
    "x-default": url(englishPath),
  };
}

/** A translated guide in the shape the guide cards take. */
export function guideCard(guide: LocalGuide): PostCardData {
  return {
    id: guide.slug,
    title: guide.title,
    slug: guide.slug,
    excerpt: guide.excerpt,
    cover_key: null,
    tags: guide.tags,
    author_name: "",
    published_at: guide.published,
    updated_at: guide.published,
  };
}
