"use client";

import {
  ExternalLink,
  FileText,
  Flag,
  FolderOpen,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Plus,
  Settings,
  Smartphone,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/admin/actions/auth";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  admin: { email: string; displayName: string | null; role: string };
  counts: { messages: number; reports: number };
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: "messages" | "reports";
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/wallpapers", label: "Wallpapers", icon: Images, exact: true },
      { href: "/admin/wallpapers/new", label: "Upload", icon: Upload },
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
      { href: "/admin/devices", label: "Devices", icon: Smartphone },
      { href: "/admin/posts", label: "Blog posts", icon: FileText },
    ],
  },
  {
    title: "Inbox",
    items: [
      { href: "/admin/messages", label: "Messages", icon: Mail, badge: "messages" },
      { href: "/admin/reports", label: "Reports", icon: Flag, badge: "reports" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { href: "/admin/ads", label: "Ads & AdSense", icon: Megaphone },
      { href: "/admin/settings", label: "Site settings", icon: Settings },
      { href: "/admin/account", label: "Account", icon: UserRound },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((group) => group.items);

function isActive(pathname: string, item: Pick<NavItem, "href" | "exact">) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Title for the phone top bar: the deepest nav entry the path sits under. */
function currentTitle(pathname: string) {
  if (/^\/admin\/wallpapers\/(?!new)[^/]+/.test(pathname)) return "Edit wallpaper";
  if (pathname === "/admin/posts/new") return "New article";
  if (/^\/admin\/posts\/[^/]+/.test(pathname)) return "Edit article";
  const match = ALL_ITEMS.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0];
  return match?.label ?? "Admin";
}

/** Editors have their own fixed save bar, which takes the tab bar's place. */
function hasOwnBottomBar(pathname: string) {
  return /^\/admin\/wallpapers\/(?!new$)[^/]+$/.test(pathname) || /^\/admin\/posts\/[^/]+$/.test(pathname);
}

function CountBadge({ value, inverted }: { value: number; inverted?: boolean }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold leading-5 tabular-nums",
        inverted ? "bg-white/25 text-white" : "bg-danger text-white",
      )}
    >
      {value > 99 ? "99+" : value}
    </span>
  );
}

function NavContent({ admin, counts, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-5">
        <LogoMark className="size-7" />
        <div className="leading-tight">
          <p className="text-[14px] font-semibold tracking-tight">Duo Wallpapers</p>
          <p className="text-[11px] text-fg-3">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-3 py-4" aria-label="Admin">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-3">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors lg:py-2",
                        active ? "bg-accent text-white" : "text-fg/80 hover:bg-surface hover:text-fg active:bg-surface",
                      )}
                    >
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                      <span className="flex-1">{item.label}</span>
                      <CountBadge value={item.badge ? counts[item.badge] : 0} inverted={active} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:pb-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium text-fg/80 transition hover:bg-surface hover:text-fg"
        >
          <ExternalLink className="size-[18px]" strokeWidth={1.8} />
          View website
        </Link>
        <div className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#0a84ff] to-[#6e5bff] text-[13px] font-semibold text-white">
            {(admin.displayName || admin.email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{admin.displayName || admin.email}</p>
            <p className="text-[11px] capitalize text-fg-3">{admin.role}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="grid size-9 place-items-center rounded-full text-fg-2 transition hover:bg-surface hover:text-danger"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Phone tab bar: the five places an admin goes most, with Upload in the middle. */
function TabBar({ counts, onMore, menuOpen }: { counts: SidebarProps["counts"]; onMore: () => void; menuOpen: boolean }) {
  const pathname = usePathname();
  const inboxActive = isActive(pathname, { href: "/admin/messages" }) || isActive(pathname, { href: "/admin/reports" });
  const tabs = [
    { href: "/admin", label: "Home", icon: LayoutDashboard, active: pathname === "/admin" },
    {
      href: "/admin/wallpapers",
      label: "Wallpapers",
      icon: Images,
      active: isActive(pathname, { href: "/admin/wallpapers" }) && pathname !== "/admin/wallpapers/new",
    },
    null,
    {
      href: counts.reports && !counts.messages ? "/admin/reports" : "/admin/messages",
      label: "Inbox",
      icon: Mail,
      active: inboxActive,
      badge: counts.messages + counts.reports,
    },
  ];
  const anyActive = tabs.some((tab) => tab?.active) || pathname === "/admin/wallpapers/new";

  return (
    <nav
      aria-label="Quick navigation"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-line pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {tabs.map((tab) =>
          tab ? (
            <li key={tab.label}>
              <Link
                href={tab.href}
                aria-current={tab.active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-1.5 text-[10.5px] font-medium transition-colors active:scale-95",
                  tab.active ? "text-accent" : "text-fg-3",
                )}
              >
                <tab.icon className="size-[22px]" strokeWidth={tab.active ? 2.1 : 1.7} />
                {tab.label}
                {"badge" in tab && tab.badge ? (
                  <span className="absolute left-1/2 top-0.5 ml-1.5 min-w-4 rounded-full bg-danger px-1 text-center text-[10px] font-semibold leading-4 text-white">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          ) : (
            <li key="upload" className="flex justify-center">
              <Link
                href="/admin/wallpapers/new"
                aria-label="Upload wallpapers"
                aria-current={pathname === "/admin/wallpapers/new" ? "page" : undefined}
                className={cn(
                  "grid size-12 place-items-center rounded-full bg-accent text-white shadow-[0_8px_20px_-6px_rgba(0,113,227,0.6)] transition active:scale-95",
                  pathname === "/admin/wallpapers/new" && "ring-4 ring-accent/20",
                )}
              >
                <Plus className="size-6" strokeWidth={2.2} />
              </Link>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            onClick={onMore}
            aria-expanded={menuOpen}
            className={cn(
              "flex w-full flex-col items-center gap-0.5 py-1.5 text-[10.5px] font-medium transition-colors active:scale-95",
              !anyActive || menuOpen ? "text-accent" : "text-fg-3",
            )}
          >
            <Menu className="size-[22px]" strokeWidth={1.7} />
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function AdminSidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // While the menu is open: Escape closes it and the page behind stays put.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-elevated/70 backdrop-blur-xl lg:block">
        <NavContent {...props} />
      </aside>

      <header className="glass sticky top-0 z-40 border-b border-line pt-[env(safe-area-inset-top)] lg:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link href="/admin" aria-label="Dashboard" className="shrink-0">
            <LogoMark className="size-7" />
          </Link>
          <p className="min-w-0 flex-1 truncate text-[16px] font-semibold tracking-tight">{currentTitle(pathname)}</p>
          <a
            href="/"
            target="_blank"
            aria-label="View website"
            className="grid size-9 shrink-0 place-items-center rounded-full text-fg-2 hover:bg-surface active:bg-surface"
          >
            <ExternalLink className="size-[18px]" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="relative grid size-9 shrink-0 place-items-center rounded-full hover:bg-surface active:bg-surface"
          >
            <Menu className="size-5" />
            {props.counts.messages + props.counts.reports ? (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-bg" />
            ) : null}
          </button>
        </div>
      </header>

      {hasOwnBottomBar(pathname) ? null : <TabBar counts={props.counts} onMore={() => setOpen(true)} menuOpen={open} />}

      {/* Always mounted so it can slide both ways; inert while closed. */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")} inert={!open}>
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={-1}
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 left-0 w-[min(20rem,85vw)] border-r border-line bg-elevated pt-[env(safe-area-inset-top)] shadow-float transition-transform duration-300 ease-apple",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-10 grid size-9 place-items-center rounded-full hover:bg-surface"
          >
            <X className="size-5" />
          </button>
          <NavContent {...props} onNavigate={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}
