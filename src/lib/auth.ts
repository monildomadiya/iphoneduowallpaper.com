import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types";

export interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
  role: AdminRole;
}

export class ActionError extends Error {}

/** Verifies the session cookie and returns the admin profile (deduped per request). */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  // Always evaluate per request, even before Supabase is configured.
  await connection();
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, email, display_name, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: data.user_id as string,
    email: data.email as string,
    displayName: (data.display_name as string | null) ?? null,
    role: data.role as AdminRole,
  };
});

/** For admin pages: redirects to the login screen when not authorized. */
export async function requireAdmin(roles?: AdminRole[]): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (roles && !roles.includes(admin.role)) redirect("/admin?denied=1");
  return admin;
}

/** For Server Actions / Route Handlers: throws an ActionError when not authorized. */
export async function authorize(roles?: AdminRole[]) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new ActionError("Your session has expired. Please sign in again.");
  if (roles && !roles.includes(admin.role)) {
    throw new ActionError("You don't have permission to do that.");
  }
  const supabase = await createSupabaseServerClient();
  return { admin, supabase };
}

export const MANAGER_ROLES: AdminRole[] = ["owner", "admin"];
