import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyState, Pagination } from "@/components/ui/primitives";
import { WallpaperGrid, WallpaperGridSkeleton } from "@/components/wallpaper/wallpaper-card";
import { getCategories } from "@/lib/data/taxonomy";
import { searchWallpapers } from "@/lib/data/wallpapers";
import { buildMetadata } from "@/lib/seo";
import { clampPage, formatNumber } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Search Wallpapers",
    description: "Search thousands of free iPhone Duo wallpapers by name, color, mood or style.",
    path: "/search",
    noIndex: true,
  });
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function SearchForm({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const query = first((await searchParams).q)?.slice(0, 100) ?? "";
  return <SearchInput defaultValue={query} />;
}

function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" role="search" className="relative mt-8 max-w-2xl">
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-fg-3" />
      <input
        key={defaultValue}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Try “aurora”, “black” or “mountains”"
        aria-label="Search wallpapers"
        enterKeyHint="search"
        className="h-14 w-full rounded-full border border-line bg-elevated pl-13 pr-5 text-[17px] shadow-card outline-none transition focus:border-accent"
      />
    </form>
  );
}

async function SearchResults({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const params = await searchParams;
  const query = first(params.q)?.trim().slice(0, 100) ?? "";
  const page = clampPage(first(params.page));

  if (!query) {
    const categories = await getCategories();
    return (
      <div>
        <p className="text-[15px] text-fg-2">Popular categories</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-full bg-surface px-4 py-2 text-[15px] font-medium transition hover:bg-surface-hover"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const result = await searchWallpapers(query, page);

  return (
    <>
      <p className="mb-8 text-[15px] text-fg-2">
        {formatNumber(result.total)} {result.total === 1 ? "result" : "results"} for “{query}”
      </p>
      {result.items.length ? (
        <WallpaperGrid wallpapers={result.items} priorityCount={4} />
      ) : (
        <EmptyState
          title="No matches found"
          description="Try a different word, check the spelling, or browse by category instead."
          action={{ href: "/categories", label: "Browse categories" }}
        />
      )}
      <Pagination basePath="/search" page={page} totalPages={result.totalPages} params={{ q: query }} />
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <header className="container-apple pb-10 pt-10 md:pt-16">
        <h1 className="headline-page">Search</h1>
        <Suspense fallback={<SearchInput />}>
          <SearchForm searchParams={searchParams} />
        </Suspense>
      </header>
      <section className="container-apple">
        <Suspense fallback={<WallpaperGridSkeleton count={10} />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
