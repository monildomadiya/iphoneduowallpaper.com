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
    .trim();
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

export type FitLevel = "sharp" | "good" | "low";

/** How well an image of width×height fills a screen of screenW×screenH with object-fit: cover. */
export function screenFit(width: number, height: number, screenW: number, screenH: number) {
  const scale = Math.max(screenW / width, screenH / height);
  const level: FitLevel = scale <= 1 ? "sharp" : scale <= 1.3 ? "good" : "low";
  return { level, scale };
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
