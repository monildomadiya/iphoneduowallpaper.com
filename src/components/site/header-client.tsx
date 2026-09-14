"use client";

import { ArrowRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

/** Plain nav links. Rendered without an active state as the prerendered fallback. */
export function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
      {MAIN_NAV.map((item) => {
        const active = pathname ? pathname === item.href || pathname.startsWith(`${item.href}/`) : false;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-[13px] tracking-[-0.01em] transition-colors",
              active ? "text-fg" : "text-fg/70 hover:text-fg",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Highlights the current section. Must be wrapped in <Suspense> because it reads the URL. */
export function DesktopNav() {
  return <NavLinks pathname={usePathname()} />;
}

interface QuickLink {
  href: string;
  label: string;
}

export function HeaderControls({ quickLinks }: { quickLinks: QuickLink[] }) {
  const router = useRouter();
  const [panel, setPanel] = useState<"search" | "menu" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = () => setPanel(null);

  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    const onHistory = () => setPanel(null);
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onHistory);
    document.body.style.overflow = "hidden";
    if (panel === "search") requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onHistory);
      document.body.style.overflow = "";
    };
  }, [panel]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPanel((current) => (current === "search" ? null : "search"));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q")?.toString().trim();
    if (!value) return;
    close();
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Search wallpapers"
          aria-expanded={panel === "search"}
          onClick={() => setPanel(panel === "search" ? null : "search")}
          className="grid size-9 place-items-center rounded-full text-fg/80 transition hover:bg-surface hover:text-fg"
        >
          {panel === "search" ? <X className="size-[18px]" /> : <Search className="size-[17px]" strokeWidth={1.8} />}
        </button>
        <ThemeToggle />
        <button
          type="button"
          aria-label={panel === "menu" ? "Close menu" : "Open menu"}
          aria-expanded={panel === "menu"}
          onClick={() => setPanel(panel === "menu" ? null : "menu")}
          className="grid size-9 place-items-center rounded-full text-fg/80 transition hover:bg-surface hover:text-fg md:hidden"
        >
          {panel === "menu" ? <X className="size-[18px]" /> : <Menu className="size-[18px]" strokeWidth={1.8} />}
        </button>
      </div>

      {panel
        ? createPortal(
            <div className="fixed inset-x-0 top-12 bottom-0 z-40" role="presentation">
              <button
                type="button"
                aria-label="Close"
                tabIndex={-1}
                className="absolute inset-0 animate-fade-in bg-black/20 backdrop-blur-sm dark:bg-black/50"
                onClick={close}
              />
              <div className="relative animate-fade-in border-b border-line bg-bg/95 shadow-float backdrop-blur-2xl">
                <div className="container-apple max-w-3xl py-8 md:py-10">
                  {panel === "search" ? (
                    <>
                      <form onSubmit={onSearch} role="search" className="flex items-center gap-3">
                        <Search className="size-6 shrink-0 text-fg-3" />
                        <input
                          ref={inputRef}
                          name="q"
                          type="search"
                          placeholder="Search wallpapers"
                          autoComplete="off"
                          enterKeyHint="search"
                          className="w-full bg-transparent text-2xl font-semibold tracking-tight text-fg outline-none placeholder:text-fg-3 md:text-3xl"
                        />
                      </form>
                      <p className="mt-8 text-xs font-medium text-fg-3">Quick Links</p>
                      <ul className="mt-3 space-y-1">
                        {quickLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={close}
                              className="group flex items-center gap-2 rounded-lg py-1.5 text-[15px] font-medium text-fg/85 hover:text-link"
                            >
                              <ArrowRight className="size-3.5 text-fg-3 transition group-hover:translate-x-0.5 group-hover:text-link" />
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <nav aria-label="Mobile" className="flex flex-col">
                      {MAIN_NAV.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          style={{ animationDelay: `${index * 40}ms` }}
                          className="animate-fade-up py-2.5 text-[28px] font-semibold tracking-tight text-fg"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-sm text-fg-2">
                        <Link href="/about" onClick={close}>
                          About
                        </Link>
                        <Link href="/contact" onClick={close}>
                          Contact
                        </Link>
                        <Link href="/privacy-policy" onClick={close}>
                          Privacy
                        </Link>
                        <Link href="/terms" onClick={close}>
                          Terms
                        </Link>
                      </div>
                    </nav>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
