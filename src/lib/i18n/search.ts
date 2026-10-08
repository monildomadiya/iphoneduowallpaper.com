import "server-only";
import { getDarkWallpapers, getSearchRows, searchWallpapers } from "@/lib/data/wallpapers";
import { localeContent } from "@/lib/i18n";
import { categoryCopy } from "@/lib/i18n/taxonomy";
import type { ForeignLocale } from "@/lib/i18n/types";
import { wallpaperTranslation } from "@/lib/i18n/wallpapers";
import { DARK_CATEGORY } from "@/lib/site";

/** Lower-cased and stripped of accents, so "montana" finds "montaña" and "kagit" finds "kağıt". */
function fold(text: string, locale: ForeignLocale): string {
  return text
    .toLocaleLowerCase(locale)
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Spanish plural and gender endings, so "oscuro", "oscura" and "oscuros" are one word. */
function stem(word: string, locale: ForeignLocale): string {
  if (locale !== "es" || word.length <= 4) return word;
  return word.replace(/(es|s)$/, "").replace(/[aeo]$/, "");
}

function words(text: string, locale: ForeignLocale): string[] {
  return (fold(text, locale).match(/[\p{L}\p{N}]+/gu) ?? []).map((word) => stem(word, locale));
}

/**
 * A word matches when either is the start of the other — "kumul" finds "kumulları", and "dağlar"
 * finds "dağ" — but only one way for short words, so "de" can't match everything.
 */
function wordMatches(query: string, word: string): boolean {
  return word.startsWith(query) || (word.length >= 4 && query.startsWith(word));
}

/**
 * Search for a translated page. The database only knows English titles and tags, so this matches
 * the query against each wallpaper's translated title and description and its category name in
 * that language, adds whatever the English search finds (people type "neon" or "anime" in any
 * language), and returns the ids of both, every query word required.
 */
export async function searchTranslatedIds(query: string, locale: ForeignLocale): Promise<string[] | null> {
  const stop = new Set(localeContent(locale).search.stopWords.map((word) => stem(fold(word, locale), locale)));
  const tokens = [...new Set(words(query.slice(0, 100), locale))].filter((token) => !stop.has(token)).slice(0, 8);
  if (!tokens.length) return null;

  const [rows, dark, english] = await Promise.all([getSearchRows(), getDarkWallpapers(), searchWallpapers(query, 1, 200)]);
  const darkIds = new Set(dark.ids);
  const darkName = categoryCopy(locale, DARK_CATEGORY.slug)?.name ?? "";

  const matched = rows.filter((row) => {
    const translation = wallpaperTranslation(locale, row.slug);
    if (!translation) return false;
    const haystack = words(
      [
        translation.title,
        translation.description,
        row.category ? (categoryCopy(locale, row.category)?.name ?? "") : "",
        darkIds.has(row.id) ? darkName : "",
      ].join(" "),
      locale,
    );
    return tokens.every((token) => haystack.some((word) => wordMatches(token, word)));
  });

  return [...new Set([...matched.map((row) => row.id), ...english.items.map((item) => item.id)])];
}
