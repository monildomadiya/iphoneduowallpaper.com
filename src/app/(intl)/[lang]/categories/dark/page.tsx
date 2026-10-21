import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getDarkCategory } from "@/lib/data/taxonomy";
import { getDarkWallpapers } from "@/lib/data/wallpapers";
import { isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { categoryCopy } from "@/lib/i18n/taxonomy";
import { buildMetadata, listingPage } from "@/lib/seo";
import { DARK_CATEGORY } from "@/lib/site";
import { imageUrl, stockedFirst } from "@/lib/utils";
import { LocalizedCategoryView } from "../category-view";


export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/categories/dark">): Promise<Metadata> {
  const { lang } = await params;
  const copy = isForeignLocale(lang) ? categoryCopy(lang, DARK_CATEGORY.slug) : null;
  if (!isForeignLocale(lang) || !copy) return { title: "404", robots: { index: false, follow: true } };
  const dark = await getDarkCategory();
  return buildMetadata({
    page: await listingPage(searchParams),
    pageLabel: localeContent(lang).listing.pageTitle,
    title: copy.title,
    absoluteTitle: true,
    description: copy.description,
    path: `/${lang}/categories/${DARK_CATEGORY.slug}`,
    languages: languageAlternates(`/categories/${DARK_CATEGORY.slug}`),
    locale: localeContent(lang).ogLocale,
    image: dark.cover_thumb_key ? { url: imageUrl(dark.cover_thumb_key), alt: copy.name } : null,
    noIndex: dark.wallpaper_count === 0,
  });
}

export default async function LocalizedDarkPage({ params, searchParams }: PageProps<"/[lang]/categories/dark">) {
  const { lang } = await params;
  const copy = isForeignLocale(lang) ? categoryCopy(lang, DARK_CATEGORY.slug) : null;
  if (!isForeignLocale(lang) || !copy) notFound();
  const { taxonomy } = localeContent(lang);
  const [{ ids }, categories] = await Promise.all([getDarkWallpapers(), getCategories()]);

  return (
    <LocalizedCategoryView
      locale={lang}
      slug={DARK_CATEGORY.slug}
      copy={copy}
      others={stockedFirst(categories).slice(0, 8)}
      searchParams={searchParams}
      ids={ids}
      why={{ title: taxonomy.darkWhyTitle, body: taxonomy.darkWhy }}
    />
  );
}
