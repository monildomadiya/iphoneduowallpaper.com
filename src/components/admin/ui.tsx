import Link from "next/link";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full rounded-xl border border-line-strong/80 bg-elevated px-3.5 py-2.5 text-[15px] text-fg outline-none transition placeholder:text-fg-3 focus:border-accent focus:ring-4 focus:ring-accent/15 disabled:opacity-60";

export const selectClass = `${inputClass} select-chevron appearance-none pr-9`;

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-surface px-4 py-2 text-[14px] font-medium text-fg transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[14px] font-medium text-fg-2 transition hover:bg-surface hover:text-fg disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full bg-danger/10 px-4 py-2 text-[14px] font-medium text-danger transition hover:bg-danger/15 disabled:opacity-60",
};

export function AdminHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className="mb-2 inline-block text-[13px] font-medium text-link hover:underline">
            ‹ {back.label}
          </Link>
        ) : null}
        <h1 className="text-[28px] font-bold leading-tight tracking-tight md:text-[34px]">{title}</h1>
        {description ? <div className="mt-1.5 max-w-2xl text-[15px] text-fg-2">{description}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-[22px] border border-line bg-elevated shadow-card", className)}>
      {title || actions ? (
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {title ? <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-[13px] text-fg-2">{description}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

const BADGE_TONES = {
  green: "bg-success/12 text-success",
  blue: "bg-accent/12 text-link",
  orange: "bg-warning/12 text-warning",
  red: "bg-danger/12 text-danger",
  gray: "bg-surface text-fg-2",
} as const;

export function Badge({
  tone = "gray",
  children,
  className,
}: {
  tone?: keyof typeof BADGE_TONES;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-fg">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12px] text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-fg-3">{hint}</p>
      ) : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-fg-2">{label}</p>
        {icon ? <span className="text-fg-3">{icon}</span> : null}
      </div>
      <p className="mt-2 text-[30px] font-bold leading-none tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-[12px] text-fg-3">{hint}</p> : null}
    </>
  );
  const className = "block rounded-[22px] border border-line bg-elevated p-5 shadow-card transition";
  return href ? (
    <Link href={href} className={cn(className, "hover:border-line-strong")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function AdminEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-line-strong px-6 py-14 text-center">
      <p className="text-[17px] font-semibold">{title}</p>
      {description ? <p className="mx-auto mt-1 max-w-md text-[14px] text-fg-2">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AdminPagination({
  page,
  totalPages,
  href,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between text-[14px]">
      <p className="text-fg-2">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={buttonClass.secondary}>
            Previous
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link href={href(page + 1)} className={buttonClass.secondary}>
            Next
          </Link>
        ) : null}
      </div>
    </div>
  );
}
