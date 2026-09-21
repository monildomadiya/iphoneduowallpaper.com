import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { ActionResult } from "@/lib/actions";
import { runOutsideAction } from "@/lib/admin/refresh";
import { getCurrentAdmin, type AdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient, getBearerToken } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export function apiError(error: string, status: number) {
  return json({ ok: false, error }, status);
}

/** Sends an ActionResult as JSON; failures become 400 so the app can show `error`. */
export function fromResult<T>(result: ActionResult<T>) {
  return json(result, result.ok ? 200 : 400);
}

export interface ApiContext {
  admin: AdminUser;
  supabase: SupabaseClient;
}

/**
 * Wraps an admin API handler.
 *
 * A bearer token is required — cookies are deliberately ignored here, so a site
 * the admin happens to be signed into cannot drive these endpoints from their
 * browser. Handlers run outside a Server Action, where `updateTag` is not allowed.
 */
export async function withAdmin(
  roles: AdminRole[] | null,
  handler: (context: ApiContext) => Promise<Response>,
): Promise<Response> {
  if (!isSupabaseConfigured) {
    return apiError("The server is not configured yet.", 503);
  }
  if (!(await getBearerToken())) {
    return apiError("Sign in to continue.", 401);
  }

  const admin = await getCurrentAdmin();
  if (!admin) return apiError("Your session has expired. Please sign in again.", 401);
  if (roles && !roles.includes(admin.role)) {
    return apiError("You don't have permission to do that.", 403);
  }

  const supabase = await createSupabaseServerClient();
  try {
    return await runOutsideAction(() => handler({ admin, supabase }));
  } catch (error) {
    console.error("[api:admin]", error);
    return apiError("Something went wrong. Please try again.", 500);
  }
}

/** Parses a JSON request body, or null when it is missing or malformed. */
export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function numberParam(value: string | null, fallback: number, max: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}
