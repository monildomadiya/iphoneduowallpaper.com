import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { Markdown } from "@/components/site/markdown";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { localeContent } from "@/lib/i18n";
import { categoryCopy, categoryHref } from "@/lib/i18n/taxonomy";
import type { CategoryCopy, ForeignLocale } from "@/lib/i18n/types";
import { localizedPageJsonLd } from "@/lib/seo";
import type { Category } from "@/lib/types";

/** A translated category page: the Dark page and every database category share it. */
export function LocalizedCategoryView({
  locale,
  slug,
  copy,
  others,
  searchParams,
  categoryId,
  ids,
  why,
}: {
  locale: ForeignLocale;
  slug: string;
  copy: CategoryCopy;
  others: Category[];
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  categoryId?: string;
  ids?: string[];
  why?: { title: string; body: string };
}) {
  const { taxonomy, chrome } = localeContent(locale);
  const path = `/${locale}/categories/${slug}`;

  return (
    <>
      <JsonLd data={localizedPageJsonLd({ name: copy.title, description: copy.description, path, inLanguage: locale })} />
      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: taxonomy.categoriesHub.eyebrow, path: `/${locale}/categories` },
            { name: copy.name, path },
          ]}
          home={{ name: chrome.homeLabel, path: chrome.homeHref }}
        />
      </div>
      <PageHeader eyebrow={taxonomy.categoryEyebrow} title={copy.h1} description={copy.description} className="pt-6 md:pt-10">
        {copy.guide ? (
          <p className="mt-4 text-[17px]">
            <Link href={copy.guide.href} className="link-apple">
              {copy.guide.label}
              <ChevronRight className="ml-0.5 inline size-4 align-[-3px]" />
            </Link>
          </p>
        ) : null}
        {others.length ? (
          <nav aria-label={taxonomy.categoriesHub.eyebrow} className="no-scrollbar -mx-1 mt-7 flex gap-2 overflow-x-auto px-1 pb-1">
            {others.map((item) => (
              <Link
                key={item.id}
                href={categoryHref(item.slug, locale)}
                className="shrink-0 rounded-full bg-surface px-4 py-2 text-[14px] font-medium text-fg-2 transition hover:bg-surface-hover hover:text-fg"
              >
                {categoryCopy(locale, item.slug)?.name ?? item.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </PageHeader>
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing basePath={path} searchParams={searchParams} categoryId={categoryId} ids={ids} locale={locale} />
      </section>
      {why ? (
        <section className="container-apple mt-24">
          <div className="max-w-3xl">
            <h2 className="headline-section">{why.title}</h2>
            <div className="mt-5">
              <Markdown content={why.body} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
