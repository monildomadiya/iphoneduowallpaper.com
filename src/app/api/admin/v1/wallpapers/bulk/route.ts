import type { NextRequest } from "next/server";
import { bulkUpdateWallpapers, deleteWallpapers } from "@/app/admin/actions/wallpapers";
import { apiError, fromResult, readJson, withAdmin } from "@/lib/api/admin";

interface BulkBody {
  ids?: string[];
  action?: "delete" | "update";
  patch?: { status?: "draft" | "published"; isFeatured?: boolean; categoryId?: string | null };
}

export async function POST(request: NextRequest) {
  const body = await readJson<BulkBody>(request);
  return withAdmin(null, async () => {
    const ids = Array.isArray(body?.ids) ? body.ids : [];
    if (!ids.length) return apiError("Select at least one item.", 400);

    if (body?.action === "delete") return fromResult(await deleteWallpapers(ids));
    return fromResult(await bulkUpdateWallpapers(ids, body?.patch ?? {}));
  });
}
