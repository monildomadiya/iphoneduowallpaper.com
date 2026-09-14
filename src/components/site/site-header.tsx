import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/lib/data/taxonomy";
import { Logo } from "./logo";
import { DesktopNav, HeaderControls, NavLinks } from "./header-client";

export async function SiteHeader({ siteName, announcement }: { siteName: string; announcement: string | null }) {
  const categories = await getCategories();
  const quickLinks = [
    { href: "/wallpapers?sort=popular", label: "Most downloaded wallpapers" },
    { href: "/devices/iphone-duo-inner-display", label: "iPhone Duo inner display" },
    { href: "/devices/iphone-duo-outer-display", label: "iPhone Duo outer display" },
    ...categories.slice(0, 3).map((category) => ({
      href: `/categories/${category.slug}`,
      label: `${category.name} wallpapers`,
    })),
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-accent px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-2"
      >
        Skip to content
      </a>
      <header className="glass sticky top-0 z-50 border-b border-line">
        <div className="container-apple flex h-12 items-center justify-between gap-6">
          <Link href="/" aria-label={`${siteName} home`} className="shrink-0 text-fg">
            <Logo name={siteName} />
          </Link>
          <Suspense fallback={<NavLinks pathname={null} />}>
            <DesktopNav />
          </Suspense>
          <HeaderControls quickLinks={quickLinks} />
        </div>
      </header>
      {announcement ? (
        <div className="border-b border-line bg-surface">
          <p className="container-apple py-2.5 text-center text-[13px] text-fg-2">{announcement}</p>
        </div>
      ) : null}
    </>
  );
}
