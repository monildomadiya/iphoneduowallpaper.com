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
  Settings,
  Smartphone,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/admin/actions/auth";
import { LogoMark } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

interface SidebarProps {
  admin: { email: string; displayName: string | null; role: string };
  counts: { messages: number; reports: number };
}

const GROUPS = [
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
      { href: "/admin/collections", label: "Collections", icon: Sparkles },
      { href: "/admin/devices", label: "Devices", icon: Smartphone },
      { href: "/admin/posts", label: "Blog posts", icon: FileText },
    ],
  },
  {
    title: "Inbox",
    items: [
      { href: "/admin/messages", label: "Messages", icon: Mail, badge: "messages" as const },
      { href: "/admin/reports", label: "Reports", icon: Flag, badge: "reports" as const },
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

function NavContent({ admin, counts, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <LogoMark className="size-7" />
        <div className="leading-tight">
          <p className="text-[14px] font-semibold tracking-tight">Duo Wallpapers</p>
          <p className="text-[11px] text-fg-3">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Admin">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-3">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  "exact" in item && item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const badge = "badge" in item && item.badge ? counts[item.badge] : 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium transition",
                        active ? "bg-accent text-white" : "text-fg/80 hover:bg-surface hover:text-fg",
                      )}
                    >
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                      <span className="flex-1">{item.label}</span>
                      {badge ? (
                        <span
                          className={cn(
                            "min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold",
                            active ? "bg-white/25 text-white" : "bg-danger text-white",
                          )}
                        >
                          {badge > 99 ? "99+" : badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
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
          <ThemeToggle className="size-8" />
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="grid size-8 place-items-center rounded-full text-fg-2 transition hover:bg-surface hover:text-danger"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
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

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-elevated/70 backdrop-blur-xl lg:block">
        <NavContent {...props} />
      </aside>

      <div className="glass sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <LogoMark className="size-6" />
          <span className="text-[14px] font-semibold">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid size-9 place-items-center rounded-full hover:bg-surface"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 animate-fade-in border-r border-line bg-elevated shadow-float">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 grid size-8 place-items-center rounded-full hover:bg-surface"
            >
              <X className="size-4" />
            </button>
            <NavContent {...props} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
