import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js prefers proxy.ts, but OpenNext currently requires Edge Middleware.
// Keep session refresh and the admin guard enabled on both hosting targets.
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only admin + auth callback routes touch cookies, so public pages stay fully cacheable.
  matcher: ["/admin", "/admin/:path*", "/auth/:path*"],
};
