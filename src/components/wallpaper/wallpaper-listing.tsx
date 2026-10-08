import { Suspense } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import { EmptyState, Pagination, SortTabs } from "@/components/ui/primitives";
import { listWallpapers } from "@/lib/data/wallpapers";
import { localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import type { ForeignLocale } from "@/lib/i18n/types";
import { clampPage, formatNumber } from "@/lib/utils";
import { WallpaperGrid, WallpaperGridSkeleton } from "./wallpaper-card";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface ListingProps {
  basePath: string;
  searchParams: SearchParams;
  categoryId?: string;
  deviceId?: string;
  ids?: string[];
  /** A translated listing: labels in that language and cards linking to translations. */
  locale?: ForeignLocale;
  emptyTitle?: string;
  emptyDescription?: string;
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function ListingContent({
  basePath,
  searchParams,
  categoryId,
  deviceId,
  ids,
  locale,
  emptyTitle,
  emptyDescription,
}: ListingProps) {
  const t = locale ? localeContent(locale).listing : null;
  const title = emptyTitle ?? t?.emptyTitle ?? "No wallpapers yet";
  const description =
    emptyDescription ?? t?.emptyDescription ?? "New wallpapers are added regularly. Check back soon or explore other categories.";
  const params = await searchParams;
  const sort = first(params.sort) === "popular" ? "popular" : "latest";
  const page = clampPage(first(params.page));
  const result = await listWallpapers({ categoryId, deviceId, ids, sort, page, perPage: 30 });

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] text-fg-2">
          {t
            ? fill(result.total === 1 ? t.countOne : t.countMany, { n: result.total.toLocaleString(locale) })
            : `${formatNumber(result.total)} ${result.total === 1 ? "wallpaper" : "wallpapers"}`}
          {page > 1
            ? t
              ? fill(t.page, { p: page, t: result.totalPages })
              : ` · Page ${page} of ${result.totalPages}`
            : ""}
        </p>
        <SortTabs
          basePath={basePath}
          current={sort}
          labels={t ? { latest: t.latest, popular: t.popular, sort: t.sortLabel } : undefined}
        />
      </div>

      {result.items.length ? (
        <WallpaperGrid wallpapers={result.items} priorityCount={page === 1 ? 4 : 0} locale={locale} />
      ) : (
        <EmptyState
          title={page > 1 ? (t?.endTitle ?? "You've reached the end") : title}
          description={page > 1 ? (t?.endDescription ?? "There are no more wallpapers on this page.") : description}
          action={
            page > 1
              ? { href: basePath, label: t?.back ?? "Back to page 1" }
              : { href: locale ? `/${locale}/wallpapers` : "/wallpapers", label: t?.browseAll ?? "Browse all wallpapers" }
          }
        />
      )}

      {result.items.length ? <AdSlot placement="list_bottom" className="mt-16" /> : null}
      <Pagination
        basePath={basePath}
        page={page}
        totalPages={result.totalPages}
        params={{ sort: sort === "popular" ? "popular" : undefined }}
        labels={t ? { pagination: t.pagination, previous: t.previous, next: t.next } : undefined}
      />
    </>
  );
}

function ListingFallback() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="skeleton h-5 w-32 rounded-full" />
        <div className="skeleton h-10 w-56 rounded-full" />
      </div>
      <WallpaperGridSkeleton count={10} />
    </>
  );
}

/** Sortable, paginated wallpaper grid. Reads searchParams inside its own Suspense boundary. */
export function WallpaperListing(props: ListingProps) {
  return (
    <Suspense fallback={<ListingFallback />}>
      <ListingContent {...props} />
    </Suspense>
  );
}
