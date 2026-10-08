import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/lib/data/taxonomy";
import { EN_HEADER, fill } from "@/lib/i18n/en";
import type { Chrome } from "@/lib/i18n/types";
import { LogoMark } from "./logo";
import { DesktopNav, HeaderBar, HeaderControls, NavLinks } from "./header-client";

export async function SiteHeader({
  siteName,
  announcement,
  chrome,
}: {
  siteName: string;
  announcement: string | null;
  /** Labels and links for a translated page; English when left out. */
  chrome?: Chrome;
}) {
  const categories = await getCategories();
  const strings = chrome?.header ?? EN_HEADER;
  const quickLinks = chrome?.quickLinks ?? [
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
        {strings.skip}
      </a>
      {announcement && !chrome ? (
        <div className="bg-linear-to-r from-[#0a84ff] via-[#6e5bff] to-[#d85bb0]">
          <p className="container-apple py-2 text-center text-[13px] font-medium text-white">{announcement}</p>
        </div>
      ) : null}
      <header className="pointer-events-none sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <HeaderBar>
          <Link
            href={chrome?.homeHref ?? "/"}
            aria-label={fill(strings.home, { site: siteName })}
            className="flex min-w-0 items-center gap-2 rounded-full py-1 pl-1.5 pr-3 text-fg transition hover:bg-black/[0.04] md:shrink-0"
          >
            <LogoMark className="size-7 shrink-0 drop-shadow-[0_3px_6px_rgba(110,91,255,0.35)]" />
            <span className="truncate text-[15px] font-semibold tracking-tight md:hidden lg:inline">{siteName}</span>
          </Link>
          <Suspense fallback={<NavLinks pathname={null} items={chrome?.nav} />}>
            <DesktopNav items={chrome?.nav} />
          </Suspense>
          <HeaderControls quickLinks={quickLinks} nav={chrome?.nav} strings={strings} searchPath={chrome?.searchPath} />
        </HeaderBar>
      </header>
    </>
  );
}
