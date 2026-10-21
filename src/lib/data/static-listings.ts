import "server-only";
import { notFound } from "next/navigation";
import { getCategories, getDarkCategory, getDevices } from "@/lib/data/taxonomy";
import { listWallpapers } from "@/lib/data/wallpapers";
import { listPosts } from "@/lib/data/posts";
import { categoryCopy, deviceCopy } from "@/lib/i18n/taxonomy";
import type { ForeignLocale } from "@/lib/i18n/types";

export function staticListing(parts: string[]) {
  const [kind, slug, sort, rawPage] = parts;
  if (parts.length !== 4 || !["wallpapers", "category", "device", "blog"].includes(kind) || !/^[a-z0-9-]+$/.test(slug) || !["latest", "popular"].includes(sort) || !/^[1-9]\d{0,4}$/.test(rawPage)) notFound();
  return { kind, slug, searchParams: Promise.resolve({ page: rawPage, sort }) };
}

export async function staticListingParams(locale?: ForeignLocale) {
  const [categories, dark, devices, library, posts] = await Promise.all([
    getCategories(), getDarkCategory(), getDevices(), listWallpapers({ perPage: 1 }), listPosts(1, 12),
  ]);
  if (!library.total || !categories.length || !devices.length) throw new Error("Cannot pre-render listings without the published library and taxonomy.");
  const result: { parts: string[] }[] = [];
  function add(kind: string, slug: string, total: number, perPage = 30) {
    const count = Math.max(1, Math.ceil(total / perPage));
    for (const sort of kind === "blog" ? ["latest"] : ["latest", "popular"]) {
      for (let page = 1; page <= count; page++) result.push({ parts: [kind, slug, sort, String(page)] });
    }
  }
  add("wallpapers", "all", library.total);
  for (const category of [...categories, dark]) {
    if (!locale || categoryCopy(locale, category.slug)) add("category", category.slug, category.wallpaper_count);
  }
  for (const device of devices) {
    if (!locale || deviceCopy(locale, device.slug)) add("device", device.slug, device.wallpaper_count);
  }
  if (!locale) add("blog", "all", posts.total, 12);
  return result;
}
