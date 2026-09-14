import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only admin + auth callback routes touch cookies, so public pages stay fully cacheable.
  matcher: ["/admin", "/admin/:path*", "/auth/:path*"],
};
