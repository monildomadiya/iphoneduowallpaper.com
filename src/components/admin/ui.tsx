import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full rounded-xl border border-line-strong/80 bg-elevated px-3.5 py-2.5 text-[15px] text-fg outline-none transition placeholder:text-fg-3 focus:border-accent focus:ring-4 focus:ring-accent/15 disabled:opacity-60";

export const selectClass = `${inputClass} select-chevron appearance-none pr-9`;

const buttonBase =
  "inline-flex min-h-10 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full py-2 text-[14px] font-medium transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

export const buttonClass = {
  primary: `${buttonBase} bg-accent px-4 text-white hover:bg-accent-hover`,
  secondary: `${buttonBase} bg-surface px-4 text-fg hover:bg-surface-hover`,
  ghost: `${buttonBase} px-3 text-fg-2 hover:bg-surface hover:text-fg`,
  danger: `${buttonBase} bg-danger/10 px-4 text-danger hover:bg-danger/15`,
};

/** Round icon-only button; always pair with aria-label and title. */
export const iconButtonClass =
  "grid size-9 shrink-0 place-items-center rounded-full text-fg-2 transition hover:bg-surface hover:text-fg active:scale-95 disabled:opacity-50";

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
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link
            href={back.href}
            className="-ml-1.5 mb-1.5 inline-flex items-center gap-0.5 rounded-full py-1 pl-0.5 pr-2.5 text-[14px] font-medium text-link transition hover:bg-accent/10"
          >
            <ChevronLeft className="size-4" />
            {back.label}
          </Link>
        ) : null}
        <h1 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[28px] md:text-[34px]">{title}</h1>
        {description ? (
          <div className="mt-1 max-w-2xl text-[14px] leading-snug text-fg-2 sm:mt-1.5 sm:text-[15px]">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:*:flex-1">{actions}</div> : null}
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
        <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="min-w-0">
            {title ? <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-[13px] text-fg-2">{description}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
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
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium capitalize",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Published / draft pill with a status dot, used by every content list. */
export function StatusBadge({ status }: { status: string }) {
  const live = status === "published";
  return (
    <Badge tone={live ? "green" : "gray"}>
      <span className={cn("size-1.5 rounded-full", live ? "bg-success" : "bg-fg-3")} />
      {live ? "Published" : "Draft"}
    </Badge>
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
        <p className="mt-1.5 text-[12px] leading-relaxed text-fg-3 [overflow-wrap:anywhere]">{hint}</p>
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
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[13px] font-medium text-fg-2">{label}</p>
        {icon ? <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-fg-2">{icon}</span> : null}
      </div>
      <p className="mt-2 text-[26px] font-bold leading-none tracking-tight tabular-nums sm:text-[30px]">{value}</p>
      {hint ? <p className="mt-2 truncate text-[12px] text-fg-3">{hint}</p> : null}
    </>
  );
  const className = "block min-w-0 rounded-[22px] border border-line bg-elevated p-4 shadow-card transition sm:p-5";
  return href ? (
    <Link href={href} className={cn(className, "hover:-translate-y-0.5 hover:border-line-strong active:scale-[0.98]")}>
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
    <div className="rounded-[22px] border border-dashed border-line-strong px-5 py-12 text-center sm:px-6 sm:py-14">
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
  const disabled = cn(buttonClass.secondary, "pointer-events-none opacity-40");
  return (
    <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-3 text-[14px]">
      {page > 1 ? (
        <Link href={href(page - 1)} className={buttonClass.secondary}>
          <ChevronLeft className="-ml-1 size-4" />
          Previous
        </Link>
      ) : (
        <span className={disabled} aria-hidden>
          <ChevronLeft className="-ml-1 size-4" />
          Previous
        </span>
      )}
      <p className="text-fg-2 tabular-nums">
        <strong className="font-semibold text-fg">{page}</strong> / {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={buttonClass.secondary}>
          Next
          <ChevronRight className="-mr-1 size-4" />
        </Link>
      ) : (
        <span className={disabled} aria-hidden>
          Next
          <ChevronRight className="-mr-1 size-4" />
        </span>
      )}
    </nav>
  );
}
