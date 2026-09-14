import { after, NextResponse, type NextRequest } from "next/server";
import { getDownloadTarget, isLikelyBot, trackWallpaperEvent, UUID_PATTERN } from "@/lib/data/downloads";
import { createPresignedDownload } from "@/lib/r2";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { isR2Configured } from "@/lib/server-env";
import { imageUrl } from "@/lib/utils";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: NextRequest, context: RouteContext<"/api/download/[id]">) {
  const { id } = await context.params;
  if (!UUID_PATTERN.test(id)) {
    return new NextResponse("Wallpaper not found", { status: 404, headers: NO_STORE });
  }

  const wallpaper = await getDownloadTarget(id);
  if (!wallpaper) {
    return new NextResponse("Wallpaper not found", { status: 404, headers: NO_STORE });
  }

  const ipKey = hashIp(getClientIp(request.headers));
  const limit = rateLimit(`download:${ipKey}`, 40, 60_000);
  if (!limit.ok) {
    return new NextResponse("Too many downloads in a short time. Please wait a moment and try again.", {
      status: 429,
      headers: { ...NO_STORE, "Retry-After": String(limit.retryAfter) },
    });
  }

  const userAgent = request.headers.get("user-agent");
  // Count each visitor at most once per wallpaper per ~10 minutes.
  const shouldCount = !isLikelyBot(userAgent) && rateLimit(`counted:${ipKey}:${id}`, 1, 10 * 60_000).ok;
  if (shouldCount) {
    after(() => trackWallpaperEvent(id, "download"));
  }

  const viewInline = request.nextUrl.searchParams.get("mode") === "view";
  let target = imageUrl(wallpaper.original_key);

  if (!viewInline && isR2Configured) {
    const extension = wallpaper.original_key.split(".").pop() ?? "jpg";
    const filename = `${wallpaper.slug}-${wallpaper.width}x${wallpaper.height}-iphoneduowallpaper.${extension}`;
    try {
      target = await createPresignedDownload(wallpaper.original_key, filename);
    } catch (error) {
      console.error("[download] presign failed", error);
    }
  }

  if (!target) {
    return new NextResponse("Download is temporarily unavailable.", { status: 503, headers: NO_STORE });
  }

  return NextResponse.redirect(target, { status: 302, headers: NO_STORE });
}
