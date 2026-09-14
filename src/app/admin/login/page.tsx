import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/auth-forms";
import { AuthShell } from "@/components/admin/auth-shell";
import { safeAdminPath } from "@/lib/admin/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const next = safeAdminPath(Array.isArray(params.next) ? params.next[0] : params.next);

  if (await getCurrentAdmin()) redirect(next);

  const notice = !isSupabaseConfigured
    ? "Supabase environment variables are missing. Configure them to enable sign-in."
    : params.error === "link"
      ? "That sign-in link is invalid or has expired. Please try again."
      : undefined;

  return (
    <AuthShell title="Admin sign in" subtitle="Manage wallpapers, content and ads.">
      <LoginForm next={next} notice={notice} />
    </AuthShell>
  );
}
