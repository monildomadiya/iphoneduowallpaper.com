import type { NextRequest } from "next/server";
import { apiError, json, readJson } from "@/lib/api/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { createSupabaseAnonClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) return apiError("The server is not configured yet.", 503);

  const limit = rateLimit(`api-refresh:${hashIp(getClientIp(request.headers))}`, 60, 15 * 60_000);
  if (!limit.ok) return apiError("Too many requests. Please try again later.", 429);

  const body = await readJson<{ refreshToken?: unknown }>(request);
  const refreshToken = String(body?.refreshToken ?? "");
  if (!refreshToken) return apiError("Missing refresh token.", 400);

  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) return apiError("Your session has expired. Please sign in again.", 401);

  return json({
    ok: true,
    data: {
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? 0,
      },
    },
  });
}
