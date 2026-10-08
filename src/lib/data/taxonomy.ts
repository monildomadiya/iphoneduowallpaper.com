import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getDarkWallpapers } from "@/lib/data/wallpapers";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { Category, Device } from "@/lib/types";
import { DARK_CATEGORY } from "@/lib/site";
import { isValidSlug } from "@/lib/utils";

const BASE_COLUMNS =
  "id,name,slug,description,cover_key,seo_title,seo_description,sort_order,is_active,created_at,updated_at";
const DEVICE_COLUMNS =
  "id,name,slug,family,screen_label,width,height,diagonal_in,ppi,description,seo_title,seo_description,sort_order,is_active,created_at,updated_at";

interface StatsRow {
  wallpaper_count: number | string | null;
  latest_thumb_key: string | null;
}

async function loadTaxonomy<T extends { id: string; cover_key?: string | null }>(
  table: "categories" | "devices",
  columns: string,
  statsView: string,
  statsId: string,
): Promise<{ items: Array<T & { wallpaper_count: number; cover_thumb_key: string | null }>; failed: boolean }> {
  const supabase = getPublicSupabase();
  if (!supabase) return { items: [], failed: true };

  const [rows, stats] = await Promise.all([
    supabase.from(table).select(columns).eq("is_active", true).order("sort_order").order("name"),
    supabase.from(statsView).select(`${statsId},wallpaper_count,latest_thumb_key`),
  ]);

  if (rows.error) {
    console.error(`[data:${table}]`, rows.error.message);
    return { items: [], failed: true };
  }
  if (stats.error) console.error(`[data:${statsView}]`, stats.error.message);

  const statMap = new Map<string, StatsRow>();
  for (const row of (stats.data ?? []) as unknown as Array<StatsRow & Record<string, string>>) {
    statMap.set(row[statsId], row);
  }

  const items = ((rows.data ?? []) as unknown as T[]).map((row) => {
    const stat = statMap.get(row.id);
    return {
      ...row,
      wallpaper_count: Number(stat?.wallpaper_count ?? 0),
      cover_thumb_key: row.cover_key ?? stat?.latest_thumb_key ?? null,
    };
  });
  return { items, failed: false };
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("categories", "wallpapers");
  const { items, failed } = await loadTaxonomy<Category>("categories", BASE_COLUMNS, "category_stats", "category_id");
  if (failed) cacheLife("minutes");
  else cacheLife("hours");
  return items;
}

export async function getDevices(): Promise<Device[]> {
  "use cache";
  cacheTag("devices", "wallpapers");
  const { items, failed } = await loadTaxonomy<Device>("devices", DEVICE_COLUMNS, "device_stats", "device_id");
  if (failed) cacheLife("minutes");
  else cacheLife("hours");
  return items.map((device) => ({ ...device, cover_thumb_key: device.cover_thumb_key ?? null }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isValidSlug(slug)) return null;
  return (await getCategories()).find((item) => item.slug === slug) ?? null;
}

export async function getDeviceBySlug(slug: string): Promise<Device | null> {
  if (!isValidSlug(slug)) return null;
  return (await getDevices()).find((item) => item.slug === slug) ?? null;
}

/** The Dark page shaped like a category, so it can sit among the category tiles and links. */
export async function getDarkCategory(): Promise<Category> {
  const { ids, cover_thumb_key } = await getDarkWallpapers();
  return {
    id: `virtual:${DARK_CATEGORY.slug}`,
    name: DARK_CATEGORY.name,
    slug: DARK_CATEGORY.slug,
    description: DARK_CATEGORY.description,
    cover_key: null,
    seo_title: DARK_CATEGORY.title,
    seo_description: DARK_CATEGORY.description,
    sort_order: 0,
    is_active: true,
    created_at: "",
    updated_at: "",
    wallpaper_count: ids.length,
    cover_thumb_key,
  };
}
