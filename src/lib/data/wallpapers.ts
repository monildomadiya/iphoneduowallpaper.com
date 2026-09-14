import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import type {
  DeviceSummary,
  Paginated,
  WallpaperCardData,
  WallpaperDetail,
  WallpaperSort,
} from "@/lib/types";
import { isValidSlug } from "@/lib/utils";

const CARD_COLUMNS =
  "id,title,slug,thumb_key,preview_key,width,height,dominant_color,downloads,views,is_featured,published_at,category:categories(name,slug)";

const DETAIL_COLUMNS = `${CARD_COLUMNS},description,tags,original_key,file_size,mime_type,source_type,credit_name,credit_url,seo_title,seo_description,category_id,created_at,updated_at,devices:wallpaper_devices(device:devices(id,name,slug,family,screen_label,width,height,sort_order)),collections:wallpaper_collections(collection:collections(id,name,slug,is_active))`;

type Raw = Record<string, unknown>;

function one<T>(value: unknown): T | null {
  if (Array.isArray(value)) return (value[0] as T) ?? null;
  return (value as T) ?? null;
}

export function toCard(row: Raw): WallpaperCardData {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    thumb_key: row.thumb_key as string,
    preview_key: row.preview_key as string,
    width: Number(row.width),
    height: Number(row.height),
    dominant_color: (row.dominant_color as string) || "#1d1d1f",
    downloads: Number(row.downloads ?? 0),
    views: Number(row.views ?? 0),
    is_featured: Boolean(row.is_featured),
    published_at: (row.published_at as string | null) ?? null,
    category: one<{ name: string; slug: string }>(row.category),
  };
}

export function toDetail(row: Raw): WallpaperDetail {
  const devices = ((row.devices as Raw[] | null) ?? [])
    .map((link) => one<DeviceSummary & { sort_order: number }>(link.device))
    .filter((device): device is DeviceSummary & { sort_order: number } => Boolean(device))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ id, name, slug, family, screen_label, width, height }) => ({
      id,
      name,
      slug,
      family,
      screen_label,
      width,
      height,
    }));

  const collections = ((row.collections as Raw[] | null) ?? [])
    .map((link) => one<{ id: string; name: string; slug: string; is_active: boolean }>(link.collection))
    .filter((collection): collection is { id: string; name: string; slug: string; is_active: boolean } =>
      Boolean(collection?.is_active),
    )
    .map(({ id, name, slug }) => ({ id, name, slug }));

  return {
    ...toCard(row),
    description: (row.description as string | null) ?? null,
    tags: (row.tags as string[] | null) ?? [],
    original_key: row.original_key as string,
    file_size: Number(row.file_size ?? 0),
    mime_type: (row.mime_type as string) || "image/jpeg",
    source_type: (row.source_type as WallpaperDetail["source_type"]) ?? "original",
    credit_name: (row.credit_name as string | null) ?? null,
    credit_url: (row.credit_url as string | null) ?? null,
    seo_title: (row.seo_title as string | null) ?? null,
    seo_description: (row.seo_description as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    devices,
    collections,
  };
}

function emptyPage<T>(page: number, perPage: number): Paginated<T> {
  return { items: [], total: 0, page, perPage, totalPages: 1 };
}

export interface WallpaperQuery {
  sort?: WallpaperSort;
  page?: number;
  perPage?: number;
  categoryId?: string;
  deviceId?: string;
  collectionId?: string;
  featured?: boolean;
  excludeId?: string;
}

export async function listWallpapers(query: WallpaperQuery = {}): Promise<Paginated<WallpaperCardData>> {
  "use cache";
  cacheTag("wallpapers");

  const sort = query.sort ?? "latest";
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.min(Math.max(1, query.perPage ?? 24), 60);
  const supabase = getPublicSupabase();
  if (!supabase) {
    cacheLife("minutes");
    return emptyPage(page, perPage);
  }

  let columns = CARD_COLUMNS;
  if (query.deviceId) columns += ",wallpaper_devices!inner(device_id)";
  if (query.collectionId) columns += ",wallpaper_collections!inner(collection_id)";

  let request = supabase.from("wallpapers").select(columns, { count: "exact" }).eq("status", "published");
  if (query.categoryId) request = request.eq("category_id", query.categoryId);
  if (query.deviceId) request = request.eq("wallpaper_devices.device_id", query.deviceId);
  if (query.collectionId) request = request.eq("wallpaper_collections.collection_id", query.collectionId);
  if (query.featured) request = request.eq("is_featured", true);
  if (query.excludeId) request = request.neq("id", query.excludeId);

  request =
    sort === "popular"
      ? request.order("downloads", { ascending: false }).order("published_at", { ascending: false })
      : request.order("published_at", { ascending: false, nullsFirst: false }).order("id");

  const from = (page - 1) * perPage;
  const { data, error, count } = await request.range(from, from + perPage - 1);

  if (error) {
    // PGRST103: requested range is beyond the last row → treat as an empty page.
    if (error.code !== "PGRST103") console.error("[data:wallpapers]", error.message);
    cacheLife("minutes");
    return emptyPage(page, perPage);
  }

  cacheLife("hours");
  const total = count ?? 0;
  return {
    items: ((data ?? []) as unknown as Raw[]).map(toCard),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getWallpaperBySlug(slug: string): Promise<WallpaperDetail | null> {
  "use cache";

  if (!isValidSlug(slug)) {
    cacheLife("max");
    return null;
  }
  cacheTag("wallpapers", `wallpaper:${slug}`);
  const supabase = getPublicSupabase();
  if (!supabase) {
    cacheLife("minutes");
    return null;
  }

  const { data, error } = await supabase
    .from("wallpapers")
    .select(DETAIL_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load wallpaper "${slug}": ${error.message}`);
  }
  cacheLife("hours");
  return data ? toDetail(data as unknown as Raw) : null;
}

export async function getRelatedWallpapers(
  wallpaperId: string,
  categoryId: string | null,
  limit = 12,
): Promise<WallpaperCardData[]> {
  "use cache";
  cacheTag("wallpapers");
  cacheLife("hours");

  const sameCategory = categoryId
    ? (await listWallpapers({ categoryId, excludeId: wallpaperId, perPage: limit, sort: "popular" })).items
    : [];
  if (sameCategory.length >= limit) return sameCategory;

  const latest = await listWallpapers({ excludeId: wallpaperId, perPage: limit * 2 });
  const seen = new Set(sameCategory.map((item) => item.id));
  const fill = latest.items.filter((item) => !seen.has(item.id));
  return [...sameCategory, ...fill].slice(0, limit);
}

/** Turns free text into a prefix-matching tsquery: "blue sky" → "blue:* & sky:*". */
function toTsQuery(input: string): string | null {
  const tokens = input.toLowerCase().normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? [];
  const unique = [...new Set(tokens)].slice(0, 8);
  return unique.length ? unique.map((token) => `${token}:*`).join(" & ") : null;
}

export async function searchWallpapers(
  term: string,
  page = 1,
  perPage = 24,
): Promise<Paginated<WallpaperCardData>> {
  "use cache";
  cacheTag("wallpapers");

  const tsQuery = toTsQuery(term.slice(0, 100));
  const supabase = getPublicSupabase();
  if (!tsQuery || !supabase) {
    cacheLife("minutes");
    return emptyPage(page, perPage);
  }

  const from = (page - 1) * perPage;
  const { data, error, count } = await supabase
    .from("wallpapers")
    .select(CARD_COLUMNS, { count: "exact" })
    .eq("status", "published")
    .textSearch("search", tsQuery, { config: "simple" })
    .order("downloads", { ascending: false })
    .range(from, from + perPage - 1);

  cacheLife("minutes");
  if (error) {
    if (error.code !== "PGRST103") console.error("[data:search]", error.message);
    return emptyPage(page, perPage);
  }
  const total = count ?? 0;
  return {
    items: ((data ?? []) as unknown as Raw[]).map(toCard),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Most-downloaded slugs to prerender at build time. */
export async function getPrerenderWallpaperSlugs(limit = 60): Promise<string[]> {
  "use cache";
  cacheTag("wallpapers");
  cacheLife("hours");
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("wallpapers")
    .select("slug")
    .eq("status", "published")
    .order("downloads", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[data:prerender-slugs]", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug as string);
}

export async function getWallpaperSitemapEntries(): Promise<{ slug: string; updated_at: string }[]> {
  "use cache";
  cacheTag("wallpapers");
  const supabase = getPublicSupabase();
  if (!supabase) {
    cacheLife("minutes");
    return [];
  }
  const { data, error } = await supabase
    .from("wallpapers")
    .select("slug,updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(45000);
  if (error) cacheLife("minutes");
  else cacheLife("hours");
  if (error) {
    console.error("[data:sitemap]", error.message);
    return [];
  }
  return (data ?? []) as { slug: string; updated_at: string }[];
}
