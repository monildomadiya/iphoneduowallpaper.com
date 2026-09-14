"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { submitContact, submitReport } from "@/app/(site)/actions";
import type { ActionResult } from "@/lib/actions";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-line-strong/70 bg-elevated px-4 py-3 text-[17px] text-fg outline-none transition placeholder:text-fg-3 focus:border-accent focus:ring-4 focus:ring-accent/15";

function Field({
  label,
  name,
  error,
  children,
  hint,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[14px] font-medium text-fg">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-[13px] text-fg-3">{hint}</p> : null}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Hidden anti-spam fields: a honeypot and the time the form was first shown. */
function SpamGuards() {
  const startedAt = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);
  return (
    <>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="0" />
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    </>
  );
}

function SuccessMessage({ message }: { message?: string }) {
  return (
    <div role="status" className="rounded-[24px] bg-surface p-8 text-center">
      <CheckCircle2 className="mx-auto size-10 text-success" />
      <p className="mx-auto mt-4 max-w-md text-[17px] leading-7 text-fg">{message}</p>
    </div>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Sending…" : label}
    </button>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(submitContact, null);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  if (state?.ok) return <SuccessMessage message={state.message} />;

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <SpamGuards />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name}>
          <input id="name" name="name" required autoComplete="name" className={inputClass} aria-invalid={Boolean(errors.name)} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
      </div>
      <Field label="Subject" name="subject" error={errors.subject}>
        <input id="subject" name="subject" className={inputClass} placeholder="Wallpaper request, feedback, partnership…" />
      </Field>
      <Field label="Message" name="message" error={errors.message}>
        <textarea id="message" name="message" required rows={6} className={cn(inputClass, "resize-y")} aria-invalid={Boolean(errors.message)} />
      </Field>
      {state && !state.ok ? (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}
      <SubmitButton pending={pending} label="Send message" />
    </form>
  );
}

export function ReportForm() {
  const searchParams = useSearchParams();
  const wallpaper = searchParams.get("wallpaper")?.replace(/[^a-z0-9-]/g, "").slice(0, 120) ?? "";
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(submitReport, null);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  if (state?.ok) return <SuccessMessage message={state.message} />;

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <SpamGuards />
      <input type="hidden" name="wallpaper" value={wallpaper} />
      <Field label="Type of report" name="kind">
        <select id="kind" name="kind" defaultValue="copyright" className={inputClass}>
          <option value="copyright">Copyright infringement (DMCA notice)</option>
          <option value="inappropriate">Inappropriate content</option>
          <option value="broken">Broken download or image</option>
          <option value="other">Something else</option>
        </select>
      </Field>
      <Field
        label="Page on our site"
        name="pageUrl"
        error={errors.pageUrl}
        hint={wallpaper ? `Reporting: /wallpapers/${wallpaper}` : "Paste the full link to the wallpaper or page."}
      >
        <input
          id="pageUrl"
          name="pageUrl"
          type="url"
          defaultValue={wallpaper ? `/wallpapers/${wallpaper}` : ""}
          className={inputClass}
          placeholder="https://iphoneduowallpaper.com/wallpapers/…"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full legal name" name="name" error={errors.name}>
          <input id="name" name="name" required autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </Field>
      </div>
      <Field
        label="Link to the original work (for copyright notices)"
        name="originalUrl"
        hint="Where can we see your original work?"
      >
        <input id="originalUrl" name="originalUrl" type="url" className={inputClass} />
      </Field>
      <Field label="Details" name="details" error={errors.details}>
        <textarea
          id="details"
          name="details"
          rows={6}
          required
          className={cn(inputClass, "resize-y")}
          placeholder="Describe the work and explain the issue."
        />
      </Field>
      <div>
        <label className="flex items-start gap-3 text-[14px] leading-6 text-fg-2">
          <input type="checkbox" name="statement" className="mt-1.5 size-4 accent-[var(--accent)]" />
          <span>
            I have a good-faith belief that the use of the material is not authorized by the copyright owner, its agent
            or the law, and I declare that the information in this notice is accurate and, under penalty of perjury,
            that I am the owner or authorized to act on behalf of the owner. My typed name above serves as my electronic
            signature.
          </span>
        </label>
        {errors.statement ? <p className="mt-1.5 text-[13px] text-danger">{errors.statement}</p> : null}
      </div>
      {state && !state.ok ? (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}
      <SubmitButton pending={pending} label="Submit report" />
    </form>
  );
}
