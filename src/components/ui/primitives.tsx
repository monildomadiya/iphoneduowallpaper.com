import { ChevronLeft, ChevronRight, ChevronRight as Chevron } from "lucide-react";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Apple-style two-tone heading: "Latest. Fresh from the studio." */
export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  as: Tag = "h2",
  className,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("mb-7 flex flex-col gap-3 md:mb-9 md:flex-row md:items-end md:justify-between", className)}>
      <Tag className="headline-section max-w-3xl">
        <span className="text-fg">{title}</span>
        {subtitle ? <span className="text-fg-3"> {subtitle}</span> : null}
      </Tag>
      {href ? (
        <Link href={href} className="link-apple inline-flex shrink-0 items-center gap-0.5 text-[17px]">
          {linkLabel}
          <Chevron className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-apple pt-10 pb-8 md:pt-16 md:pb-12", className)}>
      {eyebrow ? <p className="mb-3 text-[15px] font-semibold text-fg-2">{eyebrow}</p> : null}
      <h1 className="headline-page max-w-4xl text-balance">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-pretty text-[19px] leading-7 text-fg-2 md:text-[21px] md:leading-8">
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[13px] text-fg-2">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((item, index) => {
            const last = index === all.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="truncate text-fg-3">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="hover:text-fg hover:underline">
                      {item.name}
                    </Link>
                    <Chevron className="size-3 text-fg-3" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

function pageHref(basePath: string, page: number, params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({
  basePath,
  page,
  totalPages,
  params = {},
}: {
  basePath: string;
  page: number;
  totalPages: number;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "gap")[] = [];
  const visible = new Set([1, totalPages, page - 1, page, page + 1]);
  for (let index = 1; index <= totalPages; index += 1) {
    if (visible.has(index)) pages.push(index);
    else if (pages.at(-1) !== "gap") pages.push("gap");
  }

  const pill = "grid h-10 min-w-10 place-items-center rounded-full px-3 text-[15px] transition";

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={pageHref(basePath, page - 1, params)} rel="prev" className={cn(pill, "hover:bg-surface")} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : null}
      {pages.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-fg-3">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(basePath, item, params)}
            aria-current={item === page ? "page" : undefined}
            className={cn(pill, item === page ? "bg-fg text-bg" : "text-fg hover:bg-surface")}
          >
            {item}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={pageHref(basePath, page + 1, params)} rel="next" className={cn(pill, "hover:bg-surface")} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-[28px] bg-surface px-6 py-16 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[17px] text-fg-2">{description}</p>
      {action ? (
        <Link href={action.href} className="btn-primary mt-6">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function SortTabs({
  basePath,
  current,
  params = {},
}: {
  basePath: string;
  current: "latest" | "popular";
  params?: Record<string, string | undefined>;
}) {
  const options = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Most downloaded" },
  ] as const;

  return (
    <div role="tablist" aria-label="Sort wallpapers" className="inline-flex rounded-full bg-surface p-1">
      {options.map((option) => {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
        if (option.value !== "latest") search.set("sort", option.value);
        const href = search.toString() ? `${basePath}?${search}` : basePath;
        const active = current === option.value;
        return (
          <Link
            key={option.value}
            href={href}
            role="tab"
            aria-selected={active}
            scroll={false}
            className={cn(
              "rounded-full px-4 py-1.5 text-[14px] font-medium transition",
              active ? "bg-elevated text-fg shadow-card" : "text-fg-2 hover:text-fg",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
