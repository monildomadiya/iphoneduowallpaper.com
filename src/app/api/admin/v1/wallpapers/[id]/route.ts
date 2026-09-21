import type { NextRequest } from "next/server";
import { deleteWallpapers, updateWallpaper } from "@/app/admin/actions/wallpapers";
import { apiError, fromResult, json, readJson, withAdmin } from "@/lib/api/admin";
import { getAdminWallpaper } from "@/lib/admin/queries";

export async function GET(_request: NextRequest, context: RouteContext<"/api/admin/v1/wallpapers/[id]">) {
  const { id } = await context.params;
  return withAdmin(null, async ({ supabase }) => {
    const wallpaper = await getAdminWallpaper(supabase, id);
    if (!wallpaper) return apiError("That wallpaper no longer exists.", 404);
    return json({ ok: true, data: wallpaper });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/v1/wallpapers/[id]">) {
  const { id } = await context.params;
  const body = await readJson<Parameters<typeof updateWallpaper>[1]>(request);
  return withAdmin(null, async () => {
    if (!body) return apiError("Invalid request body.", 400);
    return fromResult(await updateWallpaper(id, body));
  });
}

export async function DELETE(_request: NextRequest, context: RouteContext<"/api/admin/v1/wallpapers/[id]">) {
  const { id } = await context.params;
  return withAdmin(null, async () => fromResult(await deleteWallpapers([id])));
}
