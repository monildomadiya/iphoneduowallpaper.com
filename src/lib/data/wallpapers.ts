import "server-only";
import { cachedPublicQuery } from "@/lib/data/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { DeviceSummary, Paginated, WallpaperCardData, WallpaperDetail, WallpaperSort, } from "@/lib/types";
import { isDarkWallpaper, isValidSlug } from "@/lib/utils";
import type { WallpaperVariants } from "@/lib/variants/types";
const CARD_COLUMNS = "id,title,slug,thumb_key,preview_key,width,height,dominant_color,downloads,views,is_featured,published_at,category:categories(name,slug)";
const DETAIL_COLUMNS = `${CARD_COLUMNS},description,tags,original_key,file_size,mime_type,source_type,credit_name,credit_url,seo_title,seo_description,category_id,created_at,updated_at,focal_x,focal_y,variants,lock_screen_friendly,devices:wallpaper_devices(device:devices(id,name,slug,family,screen_label,width,height,sort_order))`;
type Raw = Record<string, unknown>;
function one<T>(value: unknown): T | null {
    if (Array.isArray(value))
        return (value[0] as T) ?? null;
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
        category: one<{
            name: string;
            slug: string;
        }>(row.category),
    };
}
/** The stored file list, or null when none has been built (the column defaults to `{}`). */
function parseVariants(value: unknown): WallpaperVariants | null {
    const variants = value as WallpaperVariants | null;
    return variants?.version === 1 && variants.files?.outer && variants.files.inner ? variants : null;
}
export function toDetail(row: Raw): WallpaperDetail {
    const devices = ((row.devices as Raw[] | null) ?? [])
        .map((link) => one<DeviceSummary & {
        sort_order: number;
    }>(link.device))
        .filter((device): device is DeviceSummary & {
        sort_order: number;
    } => Boolean(device))
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
        focal_x: row.focal_x == null ? 0.5 : Number(row.focal_x),
        focal_y: row.focal_y == null ? 0.5 : Number(row.focal_y),
        variants: parseVariants(row.variants),
        lock_screen_friendly: Boolean(row.lock_screen_friendly),
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
    featured?: boolean;
    excludeId?: string;
    /** Limits the listing to these wallpapers — for pages drawn from more than one category. */
    ids?: string[];
}
export async function listWallpapers(query: WallpaperQuery = {}): Promise<Paginated<WallpaperCardData>> {
    return cachedPublicQuery(async () => {
        const sort = query.sort ?? "latest";
        const page = Math.max(1, query.page ?? 1);
        const perPage = Math.min(Math.max(1, query.perPage ?? 24), 60);
        const supabase = getPublicSupabase();
        if (!supabase) {
            return emptyPage(page, perPage);
        }
        let columns = CARD_COLUMNS;
        if (query.deviceId)
            columns += ",wallpaper_devices!inner(device_id)";
        let request = supabase.from("wallpapers").select(columns, { count: "exact" }).eq("status", "published");
        if (query.categoryId)
            request = request.eq("category_id", query.categoryId);
        if (query.deviceId)
            request = request.eq("wallpaper_devices.device_id", query.deviceId);
        if (query.featured)
            request = request.eq("is_featured", true);
        if (query.excludeId)
            request = request.neq("id", query.excludeId);
        // An empty list would match nothing anyway; PostgREST rejects `in.()`, so ask for an id that can't exist.
        if (query.ids)
            request = request.in("id", query.ids.length ? query.ids : ["00000000-0000-0000-0000-000000000000"]);
        request =
            sort === "popular"
                ? request.order("downloads", { ascending: false }).order("published_at", { ascending: false })
                : request.order("published_at", { ascending: false, nullsFirst: false }).order("id");
        const from = (page - 1) * perPage;
        const { data, error, count } = await request.range(from, from + perPage - 1);
        if (error) {
            // PGRST103: requested range is beyond the last row → treat as an empty page.
            if (error.code !== "PGRST103")
                console.error("[data:wallpapers]", error.message);
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
    }, "listWallpapers", [query], ["wallpapers"]);
}
export async function getWallpaperBySlug(slug: string): Promise<WallpaperDetail | null> {
    return cachedPublicQuery(async () => {
        if (!isValidSlug(slug)) {
            return null;
        }
        const supabase = getPublicSupabase();
        if (!supabase) {
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
        return data ? toDetail(data as unknown as Raw) : null;
    }, "getWallpaperBySlug", [slug], ["wallpapers"]);
}
export async function getRelatedWallpapers(wallpaperId: string, categoryId: string | null, limit = 12): Promise<WallpaperCardData[]> {
    return cachedPublicQuery(async () => {
        const sameCategory = categoryId
            ? (await listWallpapers({ categoryId, excludeId: wallpaperId, perPage: limit, sort: "popular" })).items
            : [];
        if (sameCategory.length >= limit)
            return sameCategory;
        const latest = await listWallpapers({ excludeId: wallpaperId, perPage: limit * 2 });
        const seen = new Set(sameCategory.map((item) => item.id));
        const fill = latest.items.filter((item) => !seen.has(item.id));
        return [...sameCategory, ...fill].slice(0, limit);
    }, "getRelatedWallpapers", [wallpaperId, categoryId, limit], ["wallpapers"]);
}
/** Turns free text into a prefix-matching tsquery: "blue sky" → "blue:* & sky:*". */
function toTsQuery(input: string): string | null {
    const tokens = input.toLowerCase().normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? [];
    const unique = [...new Set(tokens)].slice(0, 8);
    return unique.length ? unique.map((token) => `${token}:*`).join(" & ") : null;
}
export async function searchWallpapers(term: string, page = 1, perPage = 24): Promise<Paginated<WallpaperCardData>> {
    return cachedPublicQuery(async () => {
        const tsQuery = toTsQuery(term.slice(0, 100));
        const supabase = getPublicSupabase();
        if (!tsQuery || !supabase) {
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
        if (error) {
            if (error.code !== "PGRST103")
                console.error("[data:search]", error.message);
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
    }, "searchWallpapers", [term, page, perPage], ["wallpapers"]);
}
/** Most-downloaded slugs to prerender at build time. */
export async function getPrerenderWallpaperSlugs(limit = 60): Promise<string[]> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase)
            return [];
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
    }, "getPrerenderWallpaperSlugs", [limit], ["wallpapers"]);
}
export interface WallpaperSitemapEntry {
    slug: string;
    title: string;
    updated_at: string;
    preview_key: string;
    original_key: string;
    variants: WallpaperVariants | null;
}
export async function getWallpaperSitemapEntries(): Promise<WallpaperSitemapEntry[]> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase) {
            return [];
        }
        const { data, error } = await supabase
            .from("wallpapers")
            .select("slug,title,updated_at,preview_key,original_key,variants")
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(45000);
        if (error) {
            console.error("[data:sitemap]", error.message);
            return [];
        }
        return (data ?? []).map((row) => ({ ...(row as WallpaperSitemapEntry), variants: parseVariants(row.variants) }));
    }, "getWallpaperSitemapEntries", [], ["wallpapers"]);
}
/**
 * Whether the library can honestly be called 4K: at least 90% of published wallpapers have a file
 * 3840 px or more on the long edge. Site-wide copy (home title, FAQ) says "4K" only then; a few
 * new uploads waiting for the upscaler don't flip it back.
 */
export async function isLibrary4k(): Promise<boolean> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase) {
            return false;
        }
        const { data, error } = await supabase.from("wallpapers").select("variants").eq("status", "published");
        if (error) {
            console.error("[data:library-4k]", error.message);
            return false;
        }
        const rows = data ?? [];
        const with4k = rows.filter((row) => parseVariants(row.variants)?.files["4k"]).length;
        return rows.length > 0 && with4k / rows.length >= 0.9;
    }, "isLibrary4k", [], ["wallpapers"]);
}
/** Every published wallpaper as a card, by category then title — the /wallpapers/all index. */
export async function getAllWallpaperCards(): Promise<WallpaperCardData[]> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase) {
            return [];
        }
        const { data, error } = await supabase
            .from("wallpapers")
            .select(CARD_COLUMNS)
            .eq("status", "published")
            .order("title")
            .limit(5000);
        if (error) {
            console.error("[data:all]", error.message);
            return [];
        }
        return ((data ?? []) as unknown as Raw[]).map(toCard);
    }, "getAllWallpaperCards", [], ["wallpapers"]);
}
/** Every published dark wallpaper, whatever its category, newest first — the Dark page's listing. */
export async function getDarkWallpapers(): Promise<{
    ids: string[];
    cover_thumb_key: string | null;
}> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase) {
            return { ids: [], cover_thumb_key: null };
        }
        const { data, error } = await supabase
            .from("wallpapers")
            .select("id,title,tags,dominant_color,thumb_key,downloads")
            .eq("status", "published")
            .order("published_at", { ascending: false, nullsFirst: false });
        if (error) {
            console.error("[data:dark]", error.message);
            return { ids: [], cover_thumb_key: null };
        }
        const dark = (data ?? []).filter((row) => isDarkWallpaper(row.dominant_color as string, [...((row.tags as string[] | null) ?? []), row.title as string]));
        // The newest dark wallpaper is often a seasonal one; the most downloaded is a fairer cover.
        const cover = [...dark].sort((a, b) => Number(b.downloads ?? 0) - Number(a.downloads ?? 0))[0];
        return { ids: dark.map((row) => row.id as string), cover_thumb_key: (cover?.thumb_key as string | undefined) ?? null };
    }, "getDarkWallpapers", [], ["wallpapers"]);
}
/** id, slug and category of every published wallpaper — what translated search matches against. */
export async function getSearchRows(): Promise<{
    id: string;
    slug: string;
    category: string | null;
}[]> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase) {
            return [];
        }
        const { data, error } = await supabase
            .from("wallpapers")
            .select("id,slug,category:categories(slug)")
            .eq("status", "published");
        if (error) {
            console.error("[data:search-rows]", error.message);
            return [];
        }
        return (data ?? []).map((row) => ({
            id: row.id as string,
            slug: row.slug as string,
            category: ((row.category as {
                slug?: string;
            } | null)?.slug as string | undefined) ?? null,
        }));
    }, "getSearchRows", [], ["wallpapers"]);
}
