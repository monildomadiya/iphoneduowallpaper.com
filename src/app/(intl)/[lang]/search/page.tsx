import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmptyState, Pagination } from "@/components/ui/primitives";
import { WallpaperGrid, WallpaperGridSkeleton } from "@/components/wallpaper/wallpaper-card";
import { getCategories, getDarkCategory } from "@/lib/data/taxonomy";
import { listWallpapers } from "@/lib/data/wallpapers";
import { isForeignLocale, localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { searchTranslatedIds } from "@/lib/i18n/search";
import { categoryCopy, categoryHref } from "@/lib/i18n/taxonomy";
import type { ForeignLocale } from "@/lib/i18n/types";
import { buildMetadata } from "@/lib/seo";
import { clampPage, stockedFirst } from "@/lib/utils";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/search">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { search, ogLocale } = localeContent(lang);
  // Result pages are endless variations of one page, so search stays out of the index in every language.
  return buildMetadata({
    title: search.title,
    absoluteTitle: true,
    description: search.description,
    path: `/${lang}/search`,
    locale: ogLocale,
    noIndex: true,
  });
}

type SearchParams = PageProps<"/[lang]/search">["searchParams"];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function SearchInput({ locale, defaultValue = "" }: { locale: ForeignLocale; defaultValue?: string }) {
  const { search } = localeContent(locale);
  return (
    <form action={`/${locale}/search`} role="search" className="relative mt-8 max-w-2xl">
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-fg-3" />
      <input
        key={defaultValue}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={search.placeholder}
        aria-label={search.label}
        enterKeyHint="search"
        className="h-14 w-full rounded-full border border-line bg-elevated pl-13 pr-5 text-[17px] shadow-card outline-none transition focus:border-accent"
      />
    </form>
  );
}

async function SearchForm({ locale, searchParams }: { locale: ForeignLocale; searchParams: SearchParams }) {
  const query = first((await searchParams).q)?.slice(0, 100) ?? "";
  return <SearchInput locale={locale} defaultValue={query} />;
}

async function SearchResults({ locale, searchParams }: { locale: ForeignLocale; searchParams: SearchParams }) {
  const { search, listing } = localeContent(locale);
  const params = await searchParams;
  const query = first(params.q)?.trim().slice(0, 100) ?? "";
  const page = clampPage(first(params.page));
  const ids = query ? await searchTranslatedIds(query, locale) : null;

  if (!query || !ids) {
    // No query, or only words like "fondo" that every wallpaper is: offer a way in instead.
    const [categories, dark] = await Promise.all([getCategories(), getDarkCategory()]);
    return (
      <div>
        <p className="text-[15px] text-fg-2">{search.popular}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stockedFirst([dark, ...categories]).map((category) => (
            <Link
              key={category.id}
              href={categoryHref(category.slug, locale)}
              className="rounded-full bg-surface px-4 py-2 text-[15px] font-medium transition hover:bg-surface-hover"
            >
              {categoryCopy(locale, category.slug)?.name ?? category.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const result = await listWallpapers({ ids, sort: "popular", page, perPage: 24 });

  return (
    <>
      <p className="mb-8 text-[15px] text-fg-2">
        {fill(result.total === 1 ? search.resultsOne : search.resultsMany, {
          n: result.total.toLocaleString(locale),
          q: query,
        })}
      </p>
      {result.items.length ? (
        <WallpaperGrid wallpapers={result.items} priorityCount={4} locale={locale} />
      ) : (
        <EmptyState
          title={search.emptyTitle}
          description={search.emptyDescription}
          action={{ href: `/${locale}/categories`, label: search.browse }}
        />
      )}
      <Pagination
        basePath={`/${locale}/search`}
        page={page}
        totalPages={result.totalPages}
        params={{ q: query }}
        labels={{ pagination: listing.pagination, previous: listing.previous, next: listing.next }}
      />
    </>
  );
}

export default async function LocalizedSearchPage({ params, searchParams }: PageProps<"/[lang]/search">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { search } = localeContent(lang);

  return (
    <>
      <header className="container-apple pb-10 pt-10 md:pt-16">
        <h1 className="headline-page">{search.h1}</h1>
        <Suspense fallback={<SearchInput locale={lang} />}>
          <SearchForm locale={lang} searchParams={searchParams} />
        </Suspense>
      </header>
      <section className="container-apple">
        <Suspense fallback={<WallpaperGridSkeleton count={10} />}>
          <SearchResults locale={lang} searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
