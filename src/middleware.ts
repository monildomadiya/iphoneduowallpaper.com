import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { listingRewrite } from "@/lib/listing-rewrite";

// Next.js prefers proxy.ts, but OpenNext currently requires Edge Middleware.
// Keep session refresh and the admin guard enabled on both hosting targets.
export async function middleware(request: NextRequest) {
  const path = listingRewrite(request.nextUrl);
  if (path) {
    const target = request.nextUrl.clone();
    target.pathname = path;
    target.search = "";
    return NextResponse.rewrite(target);
  }
  return updateSession(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/auth/:path*", "/wallpapers", "/categories/:slug", "/devices/:slug", "/blog", "/:lang(es|tr)/wallpapers", "/:lang(es|tr)/categories/:slug", "/:lang(es|tr)/devices/:slug"],
};
