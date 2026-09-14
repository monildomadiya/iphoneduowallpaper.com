"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, signIn, updatePassword } from "@/app/admin/actions/auth";
import type { ActionResult } from "@/lib/actions";
import { inputClass } from "./ui";

function Message({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  if (state.ok) {
    return <p role="status" className="rounded-xl bg-success/10 px-3.5 py-2.5 text-[14px] text-success">{state.message}</p>;
  }
  return <p role="alert" className="rounded-xl bg-danger/10 px-3.5 py-2.5 text-[14px] text-danger">{state.error}</p>;
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[15px] font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(signIn, null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {notice && !state ? <p className="rounded-xl bg-warning/10 px-3.5 py-2.5 text-[14px] text-warning">{notice}</p> : null}
      <Message state={state} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-[13px] font-medium">
            Password
          </label>
          <Link href="/admin/forgot-password" className="text-[13px] text-link hover:underline">
            Forgot password?
          </Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      <Submit pending={pending}>Sign in</Submit>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(requestPasswordReset, null);
  return (
    <form action={action} className="space-y-4">
      <Message state={state} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium">
          Admin email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <Submit pending={pending}>Send reset link</Submit>
    </form>
  );
}

export function UpdatePasswordForm({ submitLabel = "Update password" }: { submitLabel?: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(updatePassword, null);
  return (
    <form action={action} className="space-y-4">
      <Message state={state} />
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium">
          New password
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-[13px] font-medium">
          Confirm new password
        </label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </div>
      <Submit pending={pending}>{submitLabel}</Submit>
    </form>
  );
}
