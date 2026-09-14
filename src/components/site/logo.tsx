import { cn } from "@/lib/utils";

/** Two rounded panels opening like a book — a nod to the foldable iPhone Duo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-6", className)}>
      <defs>
        <linearGradient id="duo-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a84ff" />
          <stop offset="100%" stopColor="#6e5bff" />
        </linearGradient>
        <linearGradient id="duo-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d85bb0" />
          <stop offset="100%" stopColor="#ff8a3d" />
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="12.5" height="24" rx="3.6" fill="url(#duo-a)" />
      <rect x="16.5" y="4" width="12.5" height="24" rx="3.6" fill="url(#duo-b)" />
      <rect x="15.4" y="7" width="1.2" height="18" rx="0.6" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function Logo({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">{name}</span>
    </span>
  );
}
