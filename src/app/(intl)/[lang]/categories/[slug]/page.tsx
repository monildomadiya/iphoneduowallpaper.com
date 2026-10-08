import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getDarkCategory } from "@/lib/data/taxonomy";
import { FOREIGN_LOCALES, isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { categoryCopy } from "@/lib/i18n/taxonomy";
import { buildMetadata } from "@/lib/seo";
import { imageUrl, stockedFirst } from "@/lib/utils";
import { LocalizedCategoryView } from "../category-view";

// Renders on the server before responding so untranslated categories return a real 404 status.
export const instant = false;

export function generateStaticParams() {
  return FOREIGN_LOCALES.flatMap((lang) =>
    Object.keys(localeContent(lang).taxonomy.categories)
      .filter((slug) => slug !== "dark")
      .map((slug) => ({ lang, slug })),
  );
}

async function load(lang: string, slug: string) {
  if (!isForeignLocale(lang)) return null;
  const copy = categoryCopy(lang, slug);
  const category = copy ? await getCategoryBySlug(slug) : null;
  return copy && category ? { lang, copy, category } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/categories/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = await load(lang, slug);
  if (!found) return { title: "Not found", robots: { index: false, follow: true } };
  return buildMetadata({
    title: found.copy.title,
    absoluteTitle: true,
    description: found.copy.description,
    path: `/${found.lang}/categories/${slug}`,
    languages: languageAlternates(`/categories/${slug}`),
    locale: localeContent(found.lang).ogLocale,
    image: found.category.cover_thumb_key ? { url: imageUrl(found.category.cover_thumb_key), alt: found.copy.name } : null,
    noIndex: found.category.wallpaper_count === 0,
  });
}

export default async function LocalizedCategoryPage({ params, searchParams }: PageProps<"/[lang]/categories/[slug]">) {
  const { lang, slug } = await params;
  const found = await load(lang, slug);
  if (!found) notFound();
  const [categories, dark] = await Promise.all([getCategories(), getDarkCategory()]);
  const others = stockedFirst([dark, ...categories.filter((item) => item.id !== found.category.id)]).slice(0, 8);

  return (
    <LocalizedCategoryView
      locale={found.lang}
      slug={slug}
      copy={found.copy}
      others={others}
      searchParams={searchParams}
      categoryId={found.category.id}
    />
  );
}
