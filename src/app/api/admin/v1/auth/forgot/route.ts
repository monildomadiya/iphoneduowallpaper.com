import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, json, readJson } from "@/lib/api/admin";
import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { createSupabaseAnonClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) return apiError("The server is not configured yet.", 503);

  const limit = rateLimit(`api-reset:${hashIp(getClientIp(request.headers))}`, 4, 30 * 60_000);
  if (!limit.ok) return apiError("Too many requests. Please try again later.", 429);

  const body = await readJson<{ email?: unknown }>(request);
  const parsed = z.email().safeParse(String(body?.email ?? "").trim().toLowerCase());
  if (!parsed.success) return apiError("Enter a valid email address.", 400);

  const supabase = createSupabaseAnonClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/reset-password`,
  });
  if (error) console.error("[api:reset]", error.message);

  // Same answer either way, so the endpoint cannot be used to discover admin emails.
  return json({
    ok: true,
    data: null,
    message: "If that email belongs to an admin, a reset link is on its way. Open it in a browser on this device.",
  });
}
