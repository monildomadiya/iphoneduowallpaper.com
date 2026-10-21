import "server-only";
import { listWallpapers, type WallpaperQuery } from "@/lib/data/wallpapers";
import type { ForeignLocale } from "@/lib/i18n/types";
import { wallpaperHref, wallpaperTranslation } from "@/lib/i18n/wallpapers";
import { collectionPageJsonLd } from "@/lib/seo";
import { imageUrl } from "@/lib/utils";

/**
 * CollectionPage + ItemList for a category, device or hub page: the wallpapers its first page
 * lists, by name, address and thumbnail — in the page's language on translated pages.
 */
export async function listingJsonLd(input: {
  name: string;
  description: string;
  path: string;
  breadcrumb: { name: string; path: string }[];
  query: WallpaperQuery;
  locale?: ForeignLocale;
  home?: { name: string; path: string };
}) {
  const { items } = await listWallpapers({ ...input.query, perPage: 30 });
  return collectionPageJsonLd({
    name: input.name,
    description: input.description,
    path: input.path,
    breadcrumb: input.breadcrumb,
    inLanguage: input.locale,
    homeName: input.home?.name,
    homePath: input.home?.path,
    items: items.map((item) => ({
      name: (input.locale && wallpaperTranslation(input.locale, item.slug)?.title) || item.title,
      path: wallpaperHref(item.slug, input.locale),
      image: imageUrl(item.thumb_key),
    })),
  });
}
