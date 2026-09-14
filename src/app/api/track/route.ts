import { after, NextResponse, type NextRequest } from "next/server";
import { isLikelyBot, trackWallpaperEvent, UUID_PATTERN } from "@/lib/data/downloads";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  let payload: { id?: unknown; event?: unknown };
  try {
    payload = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const id = typeof payload.id === "string" ? payload.id : "";
  if (!UUID_PATTERN.test(id) || payload.event !== "view") {
    return new NextResponse(null, { status: 400 });
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== "null") {
    let sameOrigin = false;
    try {
      sameOrigin = new URL(origin).host === request.nextUrl.host;
    } catch {
      sameOrigin = false;
    }
    if (!sameOrigin) return new NextResponse(null, { status: 403 });
  }

  const ipKey = hashIp(getClientIp(request.headers));
  const burst = rateLimit(`track:${ipKey}`, 60, 60_000);
  const unique = rateLimit(`viewed:${ipKey}:${id}`, 1, 30 * 60_000);

  if (burst.ok && unique.ok && !isLikelyBot(request.headers.get("user-agent"))) {
    after(() => trackWallpaperEvent(id, "view"));
  }

  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
