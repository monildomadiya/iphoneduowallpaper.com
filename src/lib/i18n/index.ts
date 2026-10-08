import { siteUrl } from "@/lib/env";
import { ES } from "@/lib/i18n/es";
import { TR } from "@/lib/i18n/tr";
import { isTranslatedEverywhere } from "@/lib/i18n/wallpapers";
import type { ForeignLocale, LocalGuide, LocaleContent } from "@/lib/i18n/types";
import type { PostCardData } from "@/lib/types";

export const FOREIGN_LOCALES: ForeignLocale[] = ["es", "tr"];

const CONTENT: Record<ForeignLocale, LocaleContent> = { es: ES, tr: TR };

export function isForeignLocale(value: string): value is ForeignLocale {
  return (FOREIGN_LOCALES as string[]).includes(value);
}

export function localeContent(locale: ForeignLocale): LocaleContent {
  return CONTENT[locale];
}

/** English paths that have a translation, mapped to the translated path (prefix + same path). */
const TRANSLATED = new Set(["/", "/maker", ...ES.guides.map((guide) => `/blog/${guide.slug}`)]);

export function localizedPath(locale: ForeignLocale, englishPath: string): string {
  return englishPath === "/" ? `/${locale}` : `/${locale}${englishPath}`;
}

/**
 * hreflang links for a page that exists in every language. Every version lists all of them,
 * itself included, plus x-default pointing at English — Google ignores one-sided annotations.
 */
export function languageAlternates(englishPath: string): Record<string, string> | undefined {
  const wallpaper = /^\/wallpapers\/([a-z0-9-]+)$/.exec(englishPath)?.[1];
  if (!TRANSLATED.has(englishPath) && !(wallpaper && isTranslatedEverywhere(wallpaper))) return undefined;
  const url = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);
  return {
    en: url(englishPath),
    ...Object.fromEntries(FOREIGN_LOCALES.map((locale) => [locale, url(localizedPath(locale, englishPath))])),
    "x-default": url(englishPath),
  };
}

export function translatedEnglishPaths(): string[] {
  return [...TRANSLATED];
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
