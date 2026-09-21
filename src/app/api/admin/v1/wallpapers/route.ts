import type { NextRequest } from "next/server";
import { createWallpaper, type CreateWallpaperInput } from "@/app/admin/actions/wallpapers";
import { fromResult, json, numberParam, readJson, withAdmin } from "@/lib/api/admin";
import { listAdminWallpapers, type AdminWallpaperFilters } from "@/lib/admin/queries";
import type { PublishStatus } from "@/lib/types";

const SORTS = new Set(["newest", "oldest", "downloads", "views", "title"]);

export async function GET(request: NextRequest) {
  return withAdmin(null, async ({ supabase }) => {
    const params = request.nextUrl.searchParams;
    const status = params.get("status");
    const sort = params.get("sort");

    const filters: AdminWallpaperFilters = {
      q: params.get("q")?.trim() || undefined,
      status: status === "draft" || status === "published" ? (status as PublishStatus) : "all",
      categoryId: params.get("categoryId") || undefined,
      featured: params.get("featured") === "1",
      sort: SORTS.has(sort ?? "") ? (sort as AdminWallpaperFilters["sort"]) : "newest",
      page: numberParam(params.get("page"), 1, 10_000),
      perPage: numberParam(params.get("perPage"), 24, 100),
    };

    return json({ ok: true, data: await listAdminWallpapers(supabase, filters) });
  });
}

export async function POST(request: NextRequest) {
  const body = await readJson<CreateWallpaperInput>(request);
  return withAdmin(null, async () => {
    if (!body) return json({ ok: false, error: "Invalid request body." }, 400);
    return fromResult(await createWallpaper(body));
  });
}
