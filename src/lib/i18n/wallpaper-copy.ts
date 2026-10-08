import { fill } from "@/lib/i18n/en";
import type { WallpaperStrings } from "@/lib/i18n/types";
import { orientationLabel } from "@/lib/utils";
import { describeColor, type ScreenFitDetail } from "@/lib/wallpaper-copy";

/** The English colour name ("deep navy", "pale rose") in another language. */
export function localizedColor(hex: string, t: WallpaperStrings): { name: string; dark: boolean } | null {
  const color = describeColor(hex);
  if (!color) return null;
  const [, shade, base] = /^(deep |pale )?(.+)$/.exec(color.name) ?? [];
  const name = t.colors[base] ?? base;
  if (!shade) return { name, dark: color.dark };
  return { name: fill(t.shade, { color: name, shade: shade.trim() === "deep" ? t.deep : t.pale }), dark: color.dark };
}

export function localizedOrientation(width: number, height: number, t: WallpaperStrings): string {
  const label = orientationLabel(width, height);
  return label === "Landscape" ? t.orientation.landscape : label === "Portrait" ? t.orientation.portrait : t.orientation.square;
}

function percent(value: number, t: WallpaperStrings): string {
  const rounded = Math.round(value * 100);
  return rounded < 1 ? t.lessThanOne : fill(t.percent, { n: rounded });
}

/** The Screen fit line, e.g. "Se recorta un 12 % de los lados". */
export function localizedFitNote(detail: ScreenFitDetail, t: WallpaperStrings, locale: string): string {
  const enlarged =
    detail.scale > 1.05 ? fill(t.fitEnlarged, { x: detail.scale.toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) }) : "";
  if (detail.trimmed === "nothing") return `${t.fitNothing}${enlarged}`;
  const edges = detail.trimmed === "sides" ? t.fitSides : t.fitTopBottom;
  return `${fill(t.fitTrimmed, { p: percent(detail.cropped, t), edges })}${enlarged}`;
}

/** The "About this wallpaper" paragraph, built from the picture's own colour and shape. */
export function localizedOverview(
  wallpaper: { width: number; height: number; dominant_color: string; category: { slug: string; name: string } | null },
  title: string,
  t: WallpaperStrings,
): string {
  const orientation = localizedOrientation(wallpaper.width, wallpaper.height, t);
  const category = wallpaper.category ? (t.categories[wallpaper.category.slug] ?? wallpaper.category.name) : null;
  const sentences = [
    category ? fill(t.introCategory, { title, orientation, category }) : fill(t.intro, { title, orientation }),
  ];
  const color = localizedColor(wallpaper.dominant_color, t);
  if (color) sentences.push(fill(color.dark ? t.dark : t.light, { color: color.name }));
  return sentences.join(" ");
}
