import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/auth-forms";
import { AuthShell } from "@/components/admin/auth-shell";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset password" subtitle="We’ll email you a secure link to choose a new password.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
