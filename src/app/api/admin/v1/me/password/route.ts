import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, json, readJson, withAdmin } from "@/lib/api/admin";
import { createSupabaseAnonClient, getBearerToken } from "@/lib/supabase/server";

const schema = z
  .object({
    password: z.string().min(10, "Use at least 10 characters.").max(128),
    confirm: z.string(),
    refreshToken: z.string().min(1, "Missing refresh token."),
  })
  .refine((value) => value.password === value.confirm, { path: ["confirm"], message: "Passwords do not match." });

export async function POST(request: NextRequest) {
  const body = await readJson<Record<string, unknown>>(request);

  return withAdmin(null, async () => {
    const parsed = schema.safeParse({
      password: String(body?.password ?? ""),
      confirm: String(body?.confirm ?? ""),
      refreshToken: String(body?.refreshToken ?? ""),
    });
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Check the password fields.", 400);
    }

    // Changing a password is a session-scoped operation, so rebuild the app's session first.
    const accessToken = await getBearerToken();
    const supabase = createSupabaseAnonClient();
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken ?? "",
      refresh_token: parsed.data.refreshToken,
    });
    if (sessionError) return apiError("Your session has expired. Please sign in again.", 401);

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) return apiError(error.message, 400);

    // Supabase issues a new token pair with the password change; hand it back to the app.
    const { data } = await supabase.auth.getSession();
    return json({
      ok: true,
      data: data.session
        ? {
            session: {
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
              expiresAt: data.session.expires_at ?? 0,
            },
          }
        : null,
      message: "Password updated.",
    });
  });
}
