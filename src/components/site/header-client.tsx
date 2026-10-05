"use client";

import { ArrowRight, BookOpen, FolderOpen, Images, Search, Smartphone, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<string, { icon: typeof Images; tint: string }> = {
  "/wallpapers": { icon: Images, tint: "from-[#0a84ff] to-[#5e5ce6]" },
  "/categories": { icon: FolderOpen, tint: "from-[#ff9f0a] to-[#ff375f]" },
  "/devices": { icon: Smartphone, tint: "from-[#30d158] to-[#0a84ff]" },
  "/blog": { icon: BookOpen, tint: "from-[#64d2ff] to-[#5e5ce6]" },
};

function isActive(pathname: string | null, href: string) {
  return pathname ? pathname === href || pathname.startsWith(`${href}/`) : false;
}

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** The floating pill. Tightens and lifts once the page scrolls under it. */
export function HeaderBar({ children }: { children: React.ReactNode }) {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <div
      data-scrolled={scrolled}
      className={cn(
        "group/bar pointer-events-auto relative mx-auto flex items-center gap-2 rounded-full border border-white/70 bg-white/72 pl-2 pr-1.5 ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-[1.8] transition-all duration-500 ease-apple",
        scrolled
          ? "h-14 max-w-5xl bg-white/85 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.28)]"
          : "h-14 max-w-6xl shadow-[0_10px_30px_-20px_rgba(0,0,0,0.22)] md:h-16",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 -bottom-px h-px bg-linear-to-r from-transparent via-[#6e5bff]/45 to-transparent opacity-0 transition-opacity duration-500 group-data-[scrolled=true]/bar:opacity-100"
      />
    </div>
  );
}

/** Plain nav links. Rendered without an active state as the prerendered fallback. */
export function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Primary" className="hidden flex-1 justify-center md:flex">
      <ul className="flex items-center gap-0.5 rounded-full bg-black/[0.045] p-1">
        {MAIN_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-full px-3 py-1.5 text-[13.5px] font-medium tracking-[-0.01em] transition-all duration-300 lg:px-4",
                  active
                    ? "bg-white text-fg shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_-4px_rgba(0,0,0,0.12)]"
                    : "text-fg/65 hover:bg-white/60 hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Highlights the current section. Must be wrapped in <Suspense> because it reads the URL. */
export function DesktopNav() {
  return <NavLinks pathname={usePathname()} />;
}

const noopSubscribe = () => () => {};

function useShortcutLabel() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"),
    () => "Ctrl K",
  );
}

interface QuickLink {
  href: string;
  label: string;
}

export function HeaderControls({ quickLinks }: { quickLinks: QuickLink[] }) {
  const router = useRouter();
  const shortcut = useShortcutLabel();
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

  const iconButton =
    "grid size-10 place-items-center rounded-full text-fg/75 transition hover:bg-black/[0.05] hover:text-fg active:scale-95";

  return (
    <>
      <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
        <button
          type="button"
          aria-label="Search wallpapers"
          aria-expanded={panel === "search"}
          onClick={() => setPanel(panel === "search" ? null : "search")}
          className="hidden h-10 w-44 shrink-0 items-center gap-2 rounded-full bg-black/[0.045] pl-3.5 pr-2 text-[13px] text-fg-3 transition hover:bg-black/[0.07] lg:flex"
        >
          <Search className="size-4" strokeWidth={2} />
          <span className="flex-1 truncate whitespace-nowrap text-left">Search…</span>
          <kbd className="rounded-md bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-fg-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06]">
            {shortcut}
          </kbd>
        </button>
        <button
          type="button"
          aria-label="Search wallpapers"
          aria-expanded={panel === "search"}
          onClick={() => setPanel(panel === "search" ? null : "search")}
          className={cn(iconButton, "lg:hidden")}
        >
          <Search className="size-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label={panel === "menu" ? "Close menu" : "Open menu"}
          aria-expanded={panel === "menu"}
          onClick={() => setPanel(panel === "menu" ? null : "menu")}
          className={cn(iconButton, "bg-black/[0.045] md:hidden")}
        >
          <span aria-hidden="true" className="relative block h-3 w-[18px]">
            <span
              className={cn(
                "absolute left-0 h-[1.75px] w-full rounded-full bg-current transition-all duration-300 ease-apple",
                panel === "menu" ? "top-[5px] rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 h-[1.75px] w-full rounded-full bg-current transition-all duration-300 ease-apple",
                panel === "menu" ? "top-[5px] -rotate-45" : "top-[10px]",
              )}
            />
          </span>
        </button>
      </div>

      {panel
        ? createPortal(
            <div className="fixed inset-0 z-40" role="presentation">
              <button
                type="button"
                aria-label="Close"
                tabIndex={-1}
                className="absolute inset-0 animate-fade-in bg-[#0b0b1f]/25 backdrop-blur-[6px]"
                onClick={close}
              />
              <div className="pointer-events-none absolute inset-x-3 top-[4.75rem] mx-auto max-w-2xl md:top-[6rem]">
                <div className="pointer-events-auto max-h-[calc(100dvh-6rem)] animate-fade-up overflow-y-auto rounded-[28px] border border-white/70 bg-white/95 p-3 shadow-float ring-1 ring-black/[0.06] backdrop-blur-2xl [animation-duration:0.45s] md:p-4">
                  {panel === "search" ? (
                    <>
                      <form
                        onSubmit={onSearch}
                        role="search"
                        className="flex items-center gap-3 rounded-2xl bg-black/[0.04] px-4 py-3.5 ring-accent/40 focus-within:bg-white focus-within:ring-2"
                      >
                        <Search className="size-5 shrink-0 text-fg-3" />
                        <input
                          ref={inputRef}
                          name="q"
                          type="search"
                          placeholder="Search wallpapers…"
                          autoComplete="off"
                          enterKeyHint="search"
                          className="w-full bg-transparent text-[17px] font-medium text-fg outline-none placeholder:font-normal placeholder:text-fg-3 md:text-lg"
                        />
                        <button
                          type="button"
                          onClick={close}
                          aria-label="Close search"
                          className="grid size-7 shrink-0 place-items-center rounded-full bg-black/[0.06] text-fg-2 transition hover:bg-black/10"
                        >
                          <X className="size-3.5" />
                        </button>
                      </form>
                      <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-3">
                        Quick links
                      </p>
                      <ul>
                        {quickLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={close}
                              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-fg/85 transition hover:bg-black/[0.04] hover:text-fg"
                            >
                              <ArrowRight className="size-4 text-fg-3 transition group-hover:translate-x-0.5 group-hover:text-accent" />
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <nav aria-label="Mobile">
                      <ul className="space-y-1">
                        {MAIN_NAV.map((item, index) => {
                          const meta = NAV_ICONS[item.href];
                          const Icon = meta?.icon ?? Images;
                          // The menu only renders after a tap, so reading the URL here is safe and
                          // keeps usePathname (and its Suspense requirement) out of the header shell.
                          const active = isActive(window.location.pathname, item.href);
                          return (
                            <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${index * 35}ms` }}>
                              <Link
                                href={item.href}
                                onClick={close}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                  "flex items-center gap-3.5 rounded-2xl p-2.5 text-[17px] font-semibold tracking-tight transition",
                                  active ? "bg-black/[0.05]" : "hover:bg-black/[0.035]",
                                )}
                              >
                                <span
                                  className={cn(
                                    "grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br text-white shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)]",
                                    meta?.tint ?? "from-[#0a84ff] to-[#6e5bff]",
                                  )}
                                >
                                  <Icon className="size-[19px]" strokeWidth={2} />
                                </span>
                                <span className="flex-1">{item.label}</span>
                                <ArrowRight className="size-4 text-fg-3" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-3 pb-1 pt-4 text-[13px] text-fg-2">
                        <Link href="/about" onClick={close} className="hover:text-fg">
                          About
                        </Link>
                        <Link href="/contact" onClick={close} className="hover:text-fg">
                          Contact
                        </Link>
                        <Link href="/privacy-policy" onClick={close} className="hover:text-fg">
                          Privacy
                        </Link>
                        <Link href="/terms" onClick={close} className="hover:text-fg">
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
