import { Suspense } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import { EmptyState, Pagination, SortTabs } from "@/components/ui/primitives";
import { listWallpapers } from "@/lib/data/wallpapers";
import { clampPage, formatNumber } from "@/lib/utils";
import { WallpaperGrid, WallpaperGridSkeleton } from "./wallpaper-card";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface ListingProps {
  basePath: string;
  searchParams: SearchParams;
  categoryId?: string;
  deviceId?: string;
  collectionId?: string;
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
  collectionId,
  emptyTitle = "No wallpapers yet",
  emptyDescription = "New wallpapers are added regularly. Check back soon or explore other categories.",
}: ListingProps) {
  const params = await searchParams;
  const sort = first(params.sort) === "popular" ? "popular" : "latest";
  const page = clampPage(first(params.page));
  const result = await listWallpapers({ categoryId, deviceId, collectionId, sort, page, perPage: 30 });

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] text-fg-2">
          {formatNumber(result.total)} {result.total === 1 ? "wallpaper" : "wallpapers"}
          {page > 1 ? ` · Page ${page} of ${result.totalPages}` : ""}
        </p>
        <SortTabs basePath={basePath} current={sort} />
      </div>

      {result.items.length ? (
        <WallpaperGrid wallpapers={result.items} priorityCount={page === 1 ? 4 : 0} />
      ) : (
        <EmptyState
          title={page > 1 ? "You've reached the end" : emptyTitle}
          description={page > 1 ? "There are no more wallpapers on this page." : emptyDescription}
          action={page > 1 ? { href: basePath, label: "Back to page 1" } : { href: "/wallpapers", label: "Browse all wallpapers" }}
        />
      )}

      {result.items.length ? <AdSlot placement="list_bottom" className="mt-16" /> : null}
      <Pagination
        basePath={basePath}
        page={page}
        totalPages={result.totalPages}
        params={{ sort: sort === "popular" ? "popular" : undefined }}
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
