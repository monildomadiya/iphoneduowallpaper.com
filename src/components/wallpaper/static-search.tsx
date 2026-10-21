"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { usePublicCatalog } from "./use-public-catalog";
import { localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import type { ForeignLocale } from "@/lib/i18n/types";
import { wallpaperTranslation } from "@/lib/i18n/wallpapers";
import { normalizeSearch } from "@/lib/public-catalog";
import { clampPage } from "@/lib/utils";
export function StaticSearch({ locale }: { locale?: ForeignLocale }) {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim().slice(0, 100);
  const page = clampPage(params.get("page"));
  const t = locale ? localeContent(locale).search : null;
  const listing = locale ? localeContent(locale).listing : null;
  const path = locale ? `/${locale}/search` : "/search";
  const { items, error } = usePublicCatalog(Boolean(query));
  const stop = new Set((t?.stopWords ?? []).map(normalizeSearch));
  const words = normalizeSearch(query).split(" ").filter((word) => word && !stop.has(word));
  const matches = words.length ? (items ?? []).filter((item) => {
    const translation = locale ? wallpaperTranslation(locale, item.slug) : null;
    const text = normalizeSearch([item.title, item.description, item.category?.name, ...item.tags, translation?.title, translation?.description].join(" "));
    return words.every((word) => text.includes(word));
  }) : [];
  const shown = matches.slice((page - 1) * 24, page * 24);
  return <>
    <form action={path} role="search" className="relative mb-10 max-w-2xl">
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-fg-3" />
      <input key={query} name="q" type="search" defaultValue={query} placeholder={t?.placeholder ?? "Try aurora, black or mountains"} aria-label={t?.label ?? "Search wallpapers"} enterKeyHint="search" className="h-14 w-full rounded-full border border-line bg-elevated pl-13 pr-5 text-[17px] outline-none focus:border-accent" />
    </form>
    {!query || !words.length ? <p className="text-fg-2"><Link href={locale ? `/${locale}/categories` : "/categories"} className="link-apple">{t?.browse ?? "Browse categories"}</Link></p> : error ? <p role="alert">The search library could not be loaded. Please refresh and try again.</p> : !items ? <p role="status">Loading wallpaper library…</p> : <>
      <p role="status" className="mb-8 text-fg-2">{t ? fill(matches.length === 1 ? t.resultsOne : t.resultsMany, { n: matches.length.toLocaleString(locale), q: query }) : `${matches.length} ${matches.length === 1 ? "result" : "results"} for “${query}”`}</p>
      {shown.length ? <WallpaperGrid wallpapers={shown} priorityCount={4} locale={locale} /> : <div className="rounded-2xl bg-surface p-8"><h2 className="text-xl font-semibold">{t?.emptyTitle ?? "No matches found"}</h2><p className="mt-3 text-fg-2">{t?.emptyDescription ?? "Try another word or browse by category."}</p></div>}
      <nav aria-label={listing?.pagination ?? "Search pagination"} className="mt-10 flex gap-4">
        {page > 1 ? <Link className="btn-secondary" href={`${path}?${new URLSearchParams({ q: query, page: String(page - 1) })}`}>{listing?.previous ?? "Previous"}</Link> : null}
        {page * 24 < matches.length ? <Link className="btn-secondary" href={`${path}?${new URLSearchParams({ q: query, page: String(page + 1) })}`}>{listing?.next ?? "Next"}</Link> : null}
      </nav>
    </>}
  </>;
}
