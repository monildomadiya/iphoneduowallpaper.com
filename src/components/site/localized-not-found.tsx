"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NotFoundContent } from "@/components/site/not-found-content";
import type { ForeignLocale, NotFoundStrings } from "@/lib/i18n/types";

export interface NotFoundVariant {
  strings: NotFoundStrings;
  date: string;
}

/** Pages whose English original might exist when the translation doesn't. */
const ENGLISH_TWIN = /^\/(?:es|tr)(\/(?:wallpapers|categories|devices|blog)\/[a-z0-9-]+)$/;

/**
 * not-found.tsx gets no params, so the 404 inside /es and /tr reads the language from the address.
 * Both languages' words arrive as props; the only request is a HEAD check for the English page.
 */
export function LocalizedNotFound({ variants }: { variants: Record<ForeignLocale, NotFoundVariant> }) {
  const pathname = usePathname() ?? "";
  const locale: ForeignLocale = pathname.startsWith("/tr") ? "tr" : "es";
  const { strings, date } = variants[locale];
  const twin = ENGLISH_TWIN.exec(pathname)?.[1];
  // Only offer the English page once it is known to exist, so the link never leads to another 404.
  const [englishHref, setEnglishHref] = useState<string>();
  useEffect(() => {
    if (!twin) return;
    let cancelled = false;
    fetch(twin, { method: "HEAD" })
      .then((response) => {
        if (!cancelled && response.ok) setEnglishHref(twin);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [twin]);

  return (
    <NotFoundContent
      strings={strings}
      date={date}
      homeHref={`/${locale}`}
      browseHref={`/${locale}/wallpapers`}
      englishHref={englishHref}
    />
  );
}
