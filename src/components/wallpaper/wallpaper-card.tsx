/* eslint-disable @next/next/no-img-element -- thumbnails are pre-optimized WebP files served from Cloudflare R2 */
import { Download } from "lucide-react";
import Link from "next/link";
import { localeContent } from "@/lib/i18n";
import type { ForeignLocale } from "@/lib/i18n/types";
import { wallpaperHref, wallpaperTranslation } from "@/lib/i18n/wallpapers";
import type { WallpaperCardData } from "@/lib/types";
import { cn, formatCompact, imageUrl, qualityLabel, wallpaperAlt } from "@/lib/utils";

interface WallpaperCardProps {
  wallpaper: WallpaperCardData;
  priority?: boolean;
  className?: string;
  sizes?: "grid" | "large";
  /** On a translated page: link to the translation and show its title and category name. */
  locale?: ForeignLocale;
}

export function WallpaperCard({ wallpaper, priority = false, className, sizes = "grid", locale }: WallpaperCardProps) {
  const t = locale ? localeContent(locale).wallpaper : null;
  const title = (locale && wallpaperTranslation(locale, wallpaper.slug)?.title) || wallpaper.title;
  const category = wallpaper.category
    ? (t?.categories[wallpaper.category.slug] ?? wallpaper.category.name)
    : (t?.fallbackCategory ?? "Wallpaper");
  return (
    <Link href={wallpaperHref(wallpaper.slug, locale)} className={cn("group block outline-none", className)}>
      <div
        className={cn(
          "relative aspect-[9/16] overflow-hidden rounded-[22px] shadow-card ring-1 ring-line transition duration-500 ease-apple group-hover:-translate-y-1 group-hover:shadow-float group-focus-visible:ring-2 group-focus-visible:ring-accent",
          sizes === "large" && "rounded-[28px]",
        )}
        style={{ backgroundColor: wallpaper.dominant_color }}
      >
        <img
          src={imageUrl(wallpaper.thumb_key)}
          alt={
            t
              ? `${title} — ${t.kicker}, ${wallpaper.width}×${wallpaper.height}`
              : wallpaperAlt(wallpaper.title, wallpaper.width, wallpaper.height, wallpaper.category?.name)
          }
          width={480}
          height={Math.round((480 * wallpaper.height) / wallpaper.width)}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 size-full object-cover transition duration-700 ease-apple group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <span className="absolute right-2.5 top-2.5 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md">
          {qualityLabel(wallpaper.width, wallpaper.height)}
        </span>
        {wallpaper.is_featured ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-[#1d1d1f] backdrop-blur-md">
            {t?.featured ?? "Featured"}
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 flex translate-y-2 items-center gap-1 text-[12px] font-medium text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Download className="size-3.5" />
          {formatCompact(wallpaper.downloads)}
        </span>
      </div>
      <div className="mt-3 px-1">
        <h3 className="truncate text-[15px] font-semibold tracking-tight text-fg">{title}</h3>
        <p className="mt-0.5 truncate text-[13px] text-fg-2">
          {category} · {wallpaper.width} × {wallpaper.height}
        </p>
      </div>
    </Link>
  );
}

export function WallpaperGrid({
  wallpapers,
  priorityCount = 0,
  className,
  locale,
}: {
  wallpapers: WallpaperCardData[];
  priorityCount?: number;
  className?: string;
  locale?: ForeignLocale;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {wallpapers.map((wallpaper, index) => (
        <li key={wallpaper.id}>
          <WallpaperCard wallpaper={wallpaper} priority={index < priorityCount} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

export function WallpaperGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <div className="skeleton aspect-[9/16] rounded-[22px]" />
          <div className="skeleton mt-3 h-4 w-3/4 rounded-full" />
          <div className="skeleton mt-2 h-3 w-1/2 rounded-full" />
        </li>
      ))}
    </ul>
  );
}
