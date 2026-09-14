import { NextResponse, type NextRequest } from "next/server";
import { safeAdminPath } from "@/lib/admin/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Exchanges the one-time code from Supabase auth emails (password reset) for a session. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeAdminPath(request.nextUrl.searchParams.get("next"));

  if (code && isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    console.error("[auth:callback]", error.message);
  }

  return NextResponse.redirect(new URL("/admin/login?error=link", request.url));
}
