import { cacheLife } from "next/cache";
import Link from "next/link";
import { FOOTER_NAV } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { LogoMark } from "./logo";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  pinterest: "Pinterest",
  x: "X",
  youtube: "YouTube",
  threads: "Threads",
  facebook: "Facebook",
};

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = Object.entries(settings.social_links ?? {}).filter(([, url]) => Boolean(url));

  return (
    <footer className="mt-24 border-t border-line bg-surface text-[12px] leading-5 text-fg-2">
      <div className="container-apple py-10">
        <p className="border-b border-line pb-5 text-fg-3">
          {settings.site_name} is an independent website and is not affiliated with, endorsed by or sponsored by
          Apple Inc. iPhone, iPhone Duo and iOS are trademarks of Apple Inc., registered in the U.S. and other
          countries, and are used here only to describe device compatibility. Wallpapers are provided for personal,
          non-commercial use.
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:grid-cols-4">
          {FOOTER_NAV.map((group) => (
            <div key={group.title}>
              <h2 className="mb-2.5 font-semibold text-fg">{group.title}</h2>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-fg hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="size-4" />
            <span>
              Copyright © <CopyrightYear /> {settings.site_name}. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {socials.map(([network, url]) => (
              <a key={network} href={url} target="_blank" rel="noopener noreferrer me" className="hover:text-fg">
                {SOCIAL_LABELS[network] ?? network}
              </a>
            ))}
            <a href={`mailto:${settings.contact_email}`} className="hover:text-fg">
              {settings.contact_email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
