import Link from "next/link";
import { cn } from "@/lib/utils";

export function StatusTabs({
  basePath,
  current,
  options,
}: {
  basePath: string;
  current: string;
  options: { value: string; label: string }[];
}) {
  return (
    <nav className="mb-5" aria-label="Filter">
      <div className="flex w-full rounded-full bg-elevated p-1 shadow-card sm:inline-flex sm:w-auto">
        {options.map((option) => (
          <Link
            key={option.value}
            href={option.value === options[0].value ? basePath : `${basePath}?status=${option.value}`}
            aria-current={current === option.value ? "page" : undefined}
            className={cn(
              "min-w-0 flex-1 truncate rounded-full px-2 py-2 text-center text-[13px] font-medium transition sm:flex-none sm:px-4 sm:py-1.5",
              current === option.value ? "bg-fg text-bg" : "text-fg-2 hover:text-fg",
            )}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
