import { orientationLabel, screenFit } from "@/lib/utils";

/**
 * Plain-language copy built from a wallpaper's own numbers. Every wallpaper page used to share
 * ~80% of its words with every other one (fit list, details, how-to), which Google reads as
 * near-duplicate pages and leaves "crawled – currently not indexed". These sentences are true for
 * one image only: its colour, its shape, and exactly how much each screen crops away.
 */

interface ScreenLike {
  name: string;
  width: number;
  height: number;
}

interface WallpaperLike {
  title: string;
  width: number;
  height: number;
  dominant_color: string;
  tags: string[];
  category: { name: string } | null;
}

function parseHex(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Names the dominant colour the way a person would ("deep crimson", "charcoal"), and says if the image is dark. */
export function describeColor(hex: string): { name: string; dark: boolean } | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;
  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;

  const linear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  const dark = luminance < 0.12;

  if (saturation < 0.15 || delta < 0.06) {
    const name = lightness < 0.1 ? "black" : lightness < 0.3 ? "charcoal" : lightness < 0.6 ? "grey" : lightness < 0.88 ? "silver" : "white";
    return { name, dark };
  }

  const hues: [number, string][] = [
    [12, "red"],
    [35, "orange"],
    [50, "amber"],
    [65, "yellow"],
    [90, "lime"],
    [150, "green"],
    [175, "teal"],
    [200, "cyan"],
    [240, "blue"],
    [265, "indigo"],
    [290, "purple"],
    [330, "magenta"],
    [345, "rose"],
    [360, "red"],
  ];
  let name = hues.find(([limit]) => hue < limit)?.[1] ?? "red";
  if ((name === "orange" || name === "amber") && lightness < 0.4) name = "bronze";
  if (name === "red" && lightness < 0.3) name = "crimson";
  if (name === "blue" && lightness < 0.3) name = "navy";

  const prefix = lightness < 0.18 ? "deep " : lightness > 0.75 ? "pale " : "";
  return { name: `${prefix}${name}`, dark };
}

function percent(value: number): string {
  const rounded = Math.round(value * 100);
  return rounded < 1 ? "less than 1%" : `${rounded}%`;
}

export interface ScreenFitDetail {
  cropped: number;
  /** Which edges lose picture when the image fills the screen. */
  trimmed: "sides" | "top and bottom" | "nothing";
  scale: number;
}

export function screenFitDetail(width: number, height: number, screen: ScreenLike): ScreenFitDetail {
  const { scale, cropped } = screenFit(width, height, screen.width, screen.height);
  const imageRatio = width / height;
  const screenRatio = screen.width / screen.height;
  const trimmed = cropped < 0.01 ? "nothing" : imageRatio > screenRatio ? "sides" : "top and bottom";
  return { cropped, trimmed, scale };
}

/** One short line for the Screen fit list, e.g. "12% trimmed from the sides". */
export function fitNote(detail: ScreenFitDetail): string {
  const sharpness = detail.scale > 1.05 ? ` · enlarged ${detail.scale.toFixed(1)}×` : "";
  if (detail.trimmed === "nothing") return `Fills the screen with nothing cut${sharpness}`;
  return `${percent(detail.cropped)} trimmed from the ${detail.trimmed}${sharpness}`;
}

function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

/**
 * The "About this wallpaper" paragraphs. Only facts that differ between wallpapers belong here:
 * nearly every file in the library shares one size, so sentences about size or screen fit would
 * come out word for word the same on every page and make the duplication worse, not better.
 */
export function wallpaperOverview(wallpaper: WallpaperLike): string[] {
  const { width, height } = wallpaper;
  const orientation = orientationLabel(width, height).toLowerCase();
  const category = wallpaper.category ? `${wallpaper.category.name} ` : "";
  const color = describeColor(wallpaper.dominant_color);

  const intro = [`${wallpaper.title} is a ${orientation} ${category}wallpaper for iPhone Duo and iPhone 18 Pro.`];
  if (color) {
    intro.push(
      color.dark
        ? `Its palette is dominated by ${color.name}, so most of the screen stays dark: easy on the eyes at night, and on an OLED iPhone dark pixels use very little power.`
        : `Its palette is built around ${color.name} tones, a bright base where the Lock Screen clock reads best in a dark or tinted style.`,
    );
  }
  const paragraphs = [intro.join(" ")];

  // "iphone duo wallpaper"-style tags describe the site, not the picture, and read as keyword stuffing.
  const subjects = wallpaper.tags.filter((tag) => !/\b(wallpapers?|iphone)\b/i.test(tag)).slice(0, 8);
  if (subjects.length) paragraphs.push(`Themes: ${list(subjects)}.`);

  return paragraphs;
}
