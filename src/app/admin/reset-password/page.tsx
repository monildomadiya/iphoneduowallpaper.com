import type { Metadata } from "next";
import Link from "next/link";
import { UpdatePasswordForm } from "@/components/admin/auth-forms";
import { AuthShell } from "@/components/admin/auth-shell";
import { getCurrentAdmin } from "@/lib/auth";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  const admin = await getCurrentAdmin();

  return (
    <AuthShell title="Choose a new password" subtitle={admin ? admin.email : undefined}>
      {admin ? (
        <>
          <UpdatePasswordForm submitLabel="Save new password" />
          <Link href="/admin" className="mt-4 block text-center text-[14px] text-link hover:underline">
            Continue to dashboard ›
          </Link>
        </>
      ) : (
        <p className="text-center text-[15px] text-fg-2">
          This reset link has expired.{" "}
          <Link href="/admin/forgot-password" className="text-link hover:underline">
            Request a new one
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
