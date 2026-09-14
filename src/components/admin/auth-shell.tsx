import Link from "next/link";
import { LogoMark } from "@/components/site/logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl dark:opacity-35"
        style={{ background: "radial-gradient(closest-side, rgba(10,132,255,0.3), rgba(110,91,255,0.18) 50%, transparent)" }}
      />
      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="Back to site">
            <LogoMark className="size-12" />
          </Link>
          <h1 className="mt-5 text-[28px] font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-[15px] text-fg-2">{subtitle}</p> : null}
        </div>
        <div className="rounded-[24px] border border-line bg-elevated p-6 shadow-float">{children}</div>
        <p className="mt-6 text-center text-[13px] text-fg-3">
          <Link href="/" className="hover:text-fg">
            ‹ Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
