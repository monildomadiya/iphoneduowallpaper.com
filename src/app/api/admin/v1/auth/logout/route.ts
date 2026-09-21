import type { NextRequest } from "next/server";
import { readJson, withAdmin } from "@/lib/api/admin";
import { createSupabaseAnonClient, getBearerToken } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await readJson<{ refreshToken?: unknown }>(request);
  const refreshToken = String(body?.refreshToken ?? "");

  return withAdmin(null, async () => {
    const accessToken = await getBearerToken();
    // Revoking needs a real session, so rebuild one from the app's token pair.
    if (accessToken && refreshToken) {
      const supabase = createSupabaseAnonClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (!error) await supabase.auth.signOut();
    }
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  });
}
