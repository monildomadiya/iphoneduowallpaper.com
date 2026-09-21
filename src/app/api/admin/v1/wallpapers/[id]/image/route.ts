import type { NextRequest } from "next/server";
import { replaceWallpaperImage } from "@/app/admin/actions/wallpapers";
import { apiError, fromResult, readJson, withAdmin } from "@/lib/api/admin";

export async function POST(request: NextRequest, context: RouteContext<"/api/admin/v1/wallpapers/[id]/image">) {
  const { id } = await context.params;
  const body = await readJson<Parameters<typeof replaceWallpaperImage>[1]>(request);
  return withAdmin(null, async () => {
    if (!body) return apiError("Invalid request body.", 400);
    return fromResult(await replaceWallpaperImage(id, body));
  });
}
