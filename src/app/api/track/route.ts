import { after, NextResponse, type NextRequest } from "next/server";
import { isLikelyBot, trackWallpaperEvent, UUID_PATTERN } from "@/lib/data/downloads";
import { siteUrl } from "@/lib/env";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";

// Behind Render and Cloudflare, nextUrl.host is the internal address the app listens on, not the
// domain the browser used, so comparing against it alone rejected every real view as cross-origin.
function allowedHosts(request: NextRequest) {
  const hosts = new Set([new URL(siteUrl).host, request.nextUrl.host]);
  for (const header of ["x-forwarded-host", "host"]) {
    const value = request.headers.get(header)?.split(",")[0]?.trim();
    if (value) hosts.add(value);
  }
  return hosts;
}

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
      sameOrigin = allowedHosts(request).has(new URL(origin).host);
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
