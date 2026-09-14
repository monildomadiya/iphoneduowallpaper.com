"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/lib/actions";
import { safeAdminPath } from "@/lib/admin/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const NOT_CONFIGURED = "Supabase is not configured yet. Add the environment variables and restart the server.";

async function limitByIp(bucket: string, limit: number, windowMs: number) {
  const ip = getClientIp(await headers());
  return rateLimit(`${bucket}:${hashIp(ip)}`, limit, windowMs);
}

export async function signIn(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const limit = await limitByIp("login", 8, 15 * 60_000);
  if (!limit.ok) {
    return { ok: false, error: `Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Enter your email and password." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { ok: false, error: "Incorrect email or password." };

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account does not have access to the admin panel." };
  }

  redirect(safeAdminPath(formData.get("next")));
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function requestPasswordReset(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const limit = await limitByIp("reset", 4, 30 * 60_000);
  if (!limit.ok) return { ok: false, error: "Too many requests. Please try again later." };

  const parsed = z.email().safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/reset-password`,
  });
  if (error) console.error("[auth:reset]", error.message);

  // Same message either way, so the form cannot be used to discover admin emails.
  return {
    ok: true,
    data: undefined,
    message: "If that email belongs to an admin, a reset link is on its way. Open it on this device and browser.",
  };
}

const passwordSchema = z
  .object({
    password: z.string().min(10, "Use at least 10 characters.").max(128),
    confirm: z.string(),
  })
  .refine((value) => value.password === value.confirm, { path: ["confirm"], message: "Passwords do not match." });

export async function updatePassword(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Your reset link has expired. Request a new one." };

  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the password fields." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: error.message };

  return { ok: true, data: undefined, message: "Password updated." };
}
