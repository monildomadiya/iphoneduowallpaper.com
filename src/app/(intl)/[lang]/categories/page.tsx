import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTiles } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { getCategories, getDarkCategory } from "@/lib/data/taxonomy";
import { isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { categoryCopy, categoryHref } from "@/lib/i18n/taxonomy";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { stockedFirst } from "@/lib/utils";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/categories">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { taxonomy, ogLocale } = localeContent(lang);
  return buildMetadata({
    title: taxonomy.categoriesHub.title,
    description: taxonomy.categoriesHub.description,
    path: `/${lang}/categories`,
    languages: languageAlternates("/categories"),
    locale: ogLocale,
  });
}

export default async function LocalizedCategoriesPage({ params }: PageProps<"/[lang]/categories">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { taxonomy, chrome } = localeContent(lang);
  const hub = taxonomy.categoriesHub;
  const path = `/${lang}/categories`;
  const [stored, dark] = await Promise.all([getCategories(), getDarkCategory()]);
  const categories = stockedFirst([dark, ...stored]);

  return (
    <>
      <JsonLd
        data={{
          ...collectionPageJsonLd({
            name: hub.title,
            description: hub.description,
            path,
            breadcrumb: [{ name: hub.eyebrow, path }],
            items: categories
              .filter((item) => item.wallpaper_count > 0)
              .map((item) => ({
                name: categoryCopy(lang, item.slug)?.h1 ?? item.name,
                path: categoryHref(item.slug, lang),
              })),
          }),
          inLanguage: lang,
        }}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs items={[{ name: hub.eyebrow, path }]} home={{ name: chrome.homeLabel, path: chrome.homeHref }} />
      </div>
      <PageHeader eyebrow={hub.eyebrow} title={hub.h1} description={hub.lead} className="pt-6 md:pt-10" />
      <section className="container-apple">
        <CategoryTiles categories={categories} locale={lang} />
      </section>
    </>
  );
}
