import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, json, readJson } from "@/lib/api/admin";
import { isSupabaseConfigured, r2PublicUrl, siteUrl } from "@/lib/env";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { createSupabaseAnonClient, createSupabaseTokenClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.email(), password: z.string().min(1) });

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) return apiError("The server is not configured yet.", 503);

  const limit = rateLimit(`api-login:${hashIp(getClientIp(request.headers))}`, 8, 15 * 60_000);
  if (!limit.ok) {
    return apiError(`Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.`, 429);
  }

  const body = await readJson<{ email?: unknown; password?: unknown }>(request);
  const parsed = schema.safeParse({
    email: String(body?.email ?? "").trim().toLowerCase(),
    password: String(body?.password ?? ""),
  });
  if (!parsed.success) return apiError("Enter your email and password.", 400);

  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.session || !data.user) return apiError("Incorrect email or password.", 401);

  // The admin_users row is the real gate; a Supabase account alone is not enough.
  const authed = createSupabaseTokenClient(data.session.access_token);
  const { data: admin } = await authed
    .from("admin_users")
    .select("user_id, email, display_name, role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return apiError("This account does not have access to the admin panel.", 403);
  }

  return json({
    ok: true,
    data: {
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? 0,
      },
      admin: {
        id: admin.user_id as string,
        email: admin.email as string,
        displayName: (admin.display_name as string | null) ?? null,
        role: admin.role as string,
      },
      config: { imageBaseUrl: r2PublicUrl, siteUrl },
    },
  });
}
