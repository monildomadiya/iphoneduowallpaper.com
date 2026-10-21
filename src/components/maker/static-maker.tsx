"use client";
import { useSearchParams } from "next/navigation";
import { DuoMaker } from "@/components/maker/duo-maker";
import { usePublicCatalog } from "@/components/wallpaper/use-public-catalog";
import type { MakerStrings } from "@/lib/i18n/types";
export function StaticMaker({ strings, date }: { strings?: MakerStrings; date?: string }) {
  const slug = useSearchParams().get("wallpaper");
  const { items, error } = usePublicCatalog(Boolean(slug));
  const wallpaper = items?.find((item) => item.slug === slug);
  return <>
    {error ? <p role="status" className="mb-4 text-fg-2">The selected wallpaper could not be loaded. You can still choose a photo from your device.</p> : null}
    <DuoMaker key={wallpaper?.id ?? "blank"} strings={strings} date={date} wallpaper={wallpaper ? { url: wallpaper.originalUrl, slug: wallpaper.slug, title: wallpaper.title } : null} />
  </>;
}
