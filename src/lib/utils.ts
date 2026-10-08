import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { r2PublicUrl, siteUrl } from "@/lib/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 100 && SLUG_PATTERN.test(slug);
}

/** "sunset_glow-1320x2868.jpg" → "Sunset Glow" */
export function titleFromFilename(name: string): string {
  const base = name
    .replace(/\.[^.]+$/, "")
    .replace(/\b\d{3,5}\s*[x×]\s*\d{3,5}\b/gi, " ")
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    // Image tools cut long filenames mid-word ("…duo-wallpa.jpg"), which leaked into titles and slugs.
    .replace(/\bwallp(?:a(?:p(?:e(?:r)?)?)?)?$/i, "Wallpaper");
  const title = (base || "Wallpaper").replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  return title.length < 2 ? "Wallpaper" : title.slice(0, 120);
}

/** Public URL for an object stored in Cloudflare R2. */
export function imageUrl(key: string | null | undefined): string {
  if (!key) return "";
  if (/^https?:\/\//.test(key)) return key;
  return `${r2PublicUrl}/${key.replace(/^\/+/, "")}`;
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompact(value: number): string {
  return compactFormatter.format(value || 0);
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return numberFormatter.format(value || 0);
}

export function formatDate(
  iso: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" },
): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(date);
}

export function qualityLabel(width: number, height: number): string {
  const longEdge = Math.max(width, height);
  if (longEdge >= 5000) return "5K";
  if (longEdge >= 3840) return "4K";
  if (longEdge >= 2560) return "QHD+";
  if (longEdge >= 1920) return "FHD";
  return "HD";
}

export function orientationLabel(width: number, height: number): string {
  const ratio = width / height;
  if (ratio > 1.05) return "Landscape";
  if (ratio < 0.95) return "Portrait";
  return "Square";
}

/** "1320 × 2868" → "2.17:1". Phone screens rarely reduce to a tidy ratio, so fall back to a decimal. */
export function aspectRatioLabel(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const divisor = gcd(width, height) || 1;
  const [w, h] = [width / divisor, height / divisor];
  if (w <= 40 && h <= 40) return `${w}:${h}`;
  const long = Math.max(width, height) / Math.min(width, height);
  return `${long.toFixed(2)}:1`;
}

function hasPhrase(haystack: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(haystack);
}

/** Characters Google shows before a title is cut; the ` | Site Name` suffix eats the rest. */
const TITLE_BUDGET = 60;

/**
 * Builds a wallpaper's <title> without repeating words it already contains. The title template
 * already ends in "| iPhone Duo Wallpapers", so blindly appending the device family and resolution
 * produced "Neon Cyberpunk City Dual iPhone Wallpaper iPhone Duo Wallpaper — HD 1495x1052", which
 * reads as keyword stuffing and gets truncated in search results.
 */
export function wallpaperPageTitle(title: string, family: string, width: number, height: number): string {
  let base = hasPhrase(title, "wallpaper") ? title : `${title} Wallpaper`;
  if (!hasPhrase(base, "iPhone")) base = `${base} for ${family}`;
  // People do search resolutions ("1320x2868"), but it is only worth the space when the file is big
  // enough to be a selling point and the title still has room for it.
  const resolution = ` ${width}×${height}`;
  if (Math.max(width, height) >= 1920 && base.length + resolution.length <= TITLE_BUDGET) base += resolution;
  return base;
}

/**
 * Describes the image for Google Images and screen readers. Titles nearly always end in
 * "Wallpaper", so the old `${title} wallpaper` pattern read "… Wallpaper wallpaper".
 */
export function wallpaperAlt(title: string, width: number, height: number, category?: string | null): string {
  const subject = hasPhrase(title, "wallpaper") ? title : `${title} wallpaper`;
  const topic = category && !hasPhrase(subject, category) ? ` — ${category} design,` : " —";
  return `${subject}${topic} ${width}×${height}, for iPhone Duo and iPhone 18 Pro`;
}

export type FitLevel = "sharp" | "good" | "low" | "crop";

/** How well an image of width×height fills a screen of screenW×screenH with object-fit: cover. */
export function screenFit(width: number, height: number, screenW: number, screenH: number) {
  const scale = Math.max(screenW / width, screenH / height);
  // Cover keeps the whole screen filled and throws away the overhang. Reporting only the scale said
  // "slightly soft" for a landscape image on a portrait phone, where the real problem is that two
  // thirds of the picture never make it onto the screen.
  const cropped = 1 - (screenW * screenH) / (width * scale * height * scale);
  const level: FitLevel =
    cropped > 0.35 ? "crop" : scale <= 1 ? "sharp" : scale <= 1.3 ? "good" : "low";
  return { level, scale, cropped };
}

export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function clampPage(value: unknown): number {
  const page = Number.parseInt(String(value ?? "1"), 10);
  return Number.isFinite(page) && page > 0 ? Math.min(page, 10_000) : 1;
}

/**
 * Hub pages list stocked taxonomies first. An empty category is a dead end for readers and a crawl
 * path to a noindex page, so it waits its turn behind the ones that have something to show.
 */
export function stockedFirst<T extends { wallpaper_count: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => Number(b.wallpaper_count > 0) - Number(a.wallpaper_count > 0));
}

/** Relative luminance (0 = black, 1 = white) of a #rrggbb color. */
export function luminance(hex: string): number {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return 1;
  const value = Number.parseInt(match[1], 16);
  const [r, g, b] = [value >> 16, (value >> 8) & 255, value & 255].map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const DARK_TAG = /\b(a?moled|oled|dark|black)\b/i;

/**
 * Dark wallpapers sit in every category (anime, cars, abstract), so the Dark page is drawn from the
 * picture itself: a near-black dominant color, or a dark one when the tags agree. Tags alone let in
 * grey designs labelled "black and white"; color alone missed deep reds and navies tagged AMOLED.
 */
export function isDarkWallpaper(dominantColor: string, words: string[]): boolean {
  const lum = luminance(dominantColor);
  return lum < 0.045 || (lum < 0.08 && words.some((word) => DARK_TAG.test(word)));
}
