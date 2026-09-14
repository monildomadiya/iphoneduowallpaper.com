import { Search, Upload } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty, AdminHeader, AdminPagination, buttonClass, inputClass, selectClass } from "@/components/admin/ui";
import { WallpaperTable } from "@/components/admin/wallpaper-table";
import { listAdminWallpapers, listAllCategories, type AdminWallpaperFilters } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clampPage, formatNumber } from "@/lib/utils";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Wallpapers" };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminWallpapersPage({ searchParams }: PageProps<"/admin/wallpapers">) {
  await requireAdmin();
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();

  const filters: AdminWallpaperFilters = {
    q: first(params.q)?.slice(0, 80),
    status: (["published", "draft"] as const).find((value) => value === first(params.status)) ?? "all",
    categoryId: first(params.category) || undefined,
    featured: first(params.featured) === "1",
    sort: (["newest", "oldest", "downloads", "views", "title"] as const).find((value) => value === first(params.sort)) ?? "newest",
    page: clampPage(first(params.page)),
  };

  const [result, categories] = await Promise.all([listAdminWallpapers(supabase, filters), listAllCategories(supabase)]);

  const query = (page: number) => {
    const search = new URLSearchParams();
    if (filters.q) search.set("q", filters.q);
    if (filters.status && filters.status !== "all") search.set("status", filters.status);
    if (filters.categoryId) search.set("category", filters.categoryId);
    if (filters.featured) search.set("featured", "1");
    if (filters.sort && filters.sort !== "newest") search.set("sort", filters.sort);
    if (page > 1) search.set("page", String(page));
    const value = search.toString();
    return value ? `/admin/wallpapers?${value}` : "/admin/wallpapers";
  };

  return (
    <>
      <AdminHeader
        title="Wallpapers"
        description={`${formatNumber(result.total)} matching wallpapers`}
        actions={
          <Link href="/admin/wallpapers/new" className={buttonClass.primary}>
            <Upload className="size-4" />
            Upload
          </Link>
        }
      />

      <form className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_150px_180px_160px_auto]" role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-3" />
          <input name="q" defaultValue={filters.q} placeholder="Search title or slug" className={`${inputClass} pl-9`} />
        </div>
        <select name="status" defaultValue={filters.status} className={selectClass} aria-label="Status">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <select name="category" defaultValue={filters.categoryId ?? ""} className={selectClass} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={filters.sort} className={selectClass} aria-label="Sort">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="downloads">Most downloads</option>
          <option value="views">Most views</option>
          <option value="title">Title A–Z</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className={buttonClass.secondary}>
            Filter
          </button>
          {filters.q || filters.status !== "all" || filters.categoryId || filters.sort !== "newest" ? (
            <Link href="/admin/wallpapers" className={buttonClass.ghost}>
              Reset
            </Link>
          ) : null}
        </div>
      </form>

      {result.items.length ? (
        <>
          <WallpaperTable key={query(filters.page ?? 1)} items={result.items} />
          <AdminPagination page={result.page} totalPages={result.totalPages} href={query} />
        </>
      ) : (
        <AdminEmpty
          title={filters.q || filters.status !== "all" || filters.categoryId ? "No wallpapers match these filters" : "No wallpapers yet"}
          description="Upload your first batch — previews and thumbnails are created automatically."
          action={
            <Link href="/admin/wallpapers/new" className={buttonClass.primary}>
              Upload wallpapers
            </Link>
          }
        />
      )}
    </>
  );
}
