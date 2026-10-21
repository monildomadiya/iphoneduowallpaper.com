import { after, NextResponse, type NextRequest } from "next/server";
import { type DownloadTarget, getDownloadTarget, isLikelyBot, trackWallpaperEvent, UUID_PATTERN } from "@/lib/data/downloads";
import { createPresignedDownload } from "@/lib/r2";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { isR2Configured } from "@/lib/server-env";
import { imageUrl } from "@/lib/utils";
import type { VariantName } from "@/lib/variants/types";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

const VARIANT_NAMES: Record<VariantName | "zip", string> = {
  outer: "iphone-duo-outer",
  inner: "iphone-duo-inner",
  "pro-max": "iphone-18-pro-max",
  pro: "iphone-18-pro",
  "4k": "4k",
  zip: "iphone-duo-pair",
};

/**
 * `?variant=outer|inner|pro-max|pro|4k|zip` picks one of the per-device files, the 4K master by
 * default. A wallpaper without that file (not built yet, or too small for 4K) sends the original
 * upload. "View full size" opens the 4K master, or the original, in the browser.
 */
function pickFile(wallpaper: DownloadTarget, requested: string | null, viewInline: boolean) {
  const files = wallpaper.variants?.files ?? {};
  const name = (requested && requested in VARIANT_NAMES ? requested : "4k") as VariantName | "zip";
  const file = viewInline ? files["4k"] : files[name];
  if (file) {
    const size = name === "zip" ? "" : `-${file.width}x${file.height}`;
    const extension = file.key.split(".").pop() ?? "jpg";
    return { key: file.key, filename: `${wallpaper.slug}-${VARIANT_NAMES[name]}${size}.${extension}` };
  }
  const extension = wallpaper.original_key.split(".").pop() ?? "jpg";
  return {
    key: wallpaper.original_key,
    filename: `${wallpaper.slug}-${wallpaper.width}x${wallpaper.height}-iphoneduowallpaper.${extension}`,
  };
}

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
  const file = pickFile(wallpaper, request.nextUrl.searchParams.get("variant"), viewInline);
  let target = imageUrl(file.key);

  if (!viewInline && isR2Configured) {
    try {
      target = await createPresignedDownload(file.key, file.filename);
    } catch (error) {
      console.error("[download] presign failed", error);
    }
  }

  if (!target) {
    return new NextResponse("Download is temporarily unavailable.", { status: 503, headers: NO_STORE });
  }

  return NextResponse.redirect(target, { status: 302, headers: NO_STORE });
}
