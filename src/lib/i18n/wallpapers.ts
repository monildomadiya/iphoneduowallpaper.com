import es from "@/lib/i18n/wallpapers/es.json";
import tr from "@/lib/i18n/wallpapers/tr.json";
import type { ForeignLocale } from "@/lib/i18n/types";

export interface WallpaperTranslation {
  title: string;
  description: string;
}

/**
 * Title and description of each wallpaper, written in each language (not machine-translated).
 * A wallpaper uploaded later has no entry until one is added here; until then its translated
 * address is a 404 and cards on translated pages link to the English page instead.
 */
const TRANSLATIONS: Record<ForeignLocale, Record<string, WallpaperTranslation>> = { es, tr };

export function wallpaperTranslation(locale: ForeignLocale, slug: string): WallpaperTranslation | null {
  return TRANSLATIONS[locale][slug] ?? null;
}

/** hreflang only pairs pages that exist in every language. */
export function isTranslatedEverywhere(slug: string): boolean {
  return Boolean(TRANSLATIONS.es[slug] && TRANSLATIONS.tr[slug]);
}

export function translatedWallpaperSlugs(locale: ForeignLocale): string[] {
  return Object.keys(TRANSLATIONS[locale]);
}

/** Where a card on a translated page should go: the translation when there is one, else English. */
export function wallpaperHref(slug: string, locale?: ForeignLocale): string {
  return locale && TRANSLATIONS[locale][slug] ? `/${locale}/wallpapers/${slug}` : `/wallpapers/${slug}`;
}
