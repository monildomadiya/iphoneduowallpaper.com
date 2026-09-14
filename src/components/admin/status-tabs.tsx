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
    <nav className="mb-5 inline-flex rounded-full bg-elevated p-1 shadow-card" aria-label="Filter">
      {options.map((option) => (
        <Link
          key={option.value}
          href={option.value === options[0].value ? basePath : `${basePath}?status=${option.value}`}
          aria-current={current === option.value ? "page" : undefined}
          className={cn(
            "rounded-full px-4 py-1.5 text-[13px] font-medium transition",
            current === option.value ? "bg-fg text-bg" : "text-fg-2 hover:text-fg",
          )}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
