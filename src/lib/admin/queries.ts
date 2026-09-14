import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toDetail } from "@/lib/data/wallpapers";
import type {
  CategoryRow,
  CollectionRow,
  ContactMessage,
  ContentReport,
  DeviceRow,
  Paginated,
  Post,
  PublishStatus,
  SiteSettings,
  WallpaperAdminRow,
} from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/data/settings";

export interface DashboardStats {
  wallpapers_total: number;
  wallpapers_published: number;
  wallpapers_draft: number;
  downloads_total: number;
  views_total: number;
  categories_total: number;
  collections_total: number;
  posts_published: number;
  messages_new: number;
  reports_open: number;
  series: { day: string; downloads: number; views: number }[];
}

const EMPTY_STATS: DashboardStats = {
  wallpapers_total: 0,
  wallpapers_published: 0,
  wallpapers_draft: 0,
  downloads_total: 0,
  views_total: 0,
  categories_total: 0,
  collections_total: 0,
  posts_published: 0,
  messages_new: 0,
  reports_open: 0,
  series: [],
};

export async function getDashboardStats(supabase: SupabaseClient, days = 30): Promise<DashboardStats> {
  const { data, error } = await supabase.rpc("admin_dashboard_stats", { p_days: days });
  if (error) {
    console.error("[admin:stats]", error.message);
    return EMPTY_STATS;
  }
  const stats = { ...EMPTY_STATS, ...(data as Partial<DashboardStats>) };
  return {
    ...stats,
    series: (stats.series ?? []).map((point) => ({
      day: point.day,
      downloads: Number(point.downloads),
      views: Number(point.views),
    })),
  };
}

export interface AdminWallpaperListItem {
  id: string;
  title: string;
  slug: string;
  thumb_key: string;
  width: number;
  height: number;
  status: PublishStatus;
  is_featured: boolean;
  downloads: number;
  views: number;
  created_at: string;
  published_at: string | null;
  dominant_color: string;
  category: { id: string; name: string } | null;
}

export interface AdminWallpaperFilters {
  q?: string;
  status?: PublishStatus | "all";
  categoryId?: string;
  featured?: boolean;
  sort?: "newest" | "oldest" | "downloads" | "views" | "title";
  page?: number;
  perPage?: number;
}

export async function listAdminWallpapers(
  supabase: SupabaseClient,
  filters: AdminWallpaperFilters,
): Promise<Paginated<AdminWallpaperListItem>> {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? 25;
  let request = supabase
    .from("wallpapers")
    .select(
      "id,title,slug,thumb_key,width,height,status,is_featured,downloads,views,created_at,published_at,dominant_color,category:categories(id,name)",
      { count: "exact" },
    );

  if (filters.q) {
    const term = filters.q.replace(/[%_,()]/g, " ").trim();
    if (term) request = request.or(`title.ilike.%${term}%,slug.ilike.%${term}%`);
  }
  if (filters.status && filters.status !== "all") request = request.eq("status", filters.status);
  if (filters.categoryId) request = request.eq("category_id", filters.categoryId);
  if (filters.featured) request = request.eq("is_featured", true);

  switch (filters.sort) {
    case "oldest":
      request = request.order("created_at", { ascending: true });
      break;
    case "downloads":
      request = request.order("downloads", { ascending: false });
      break;
    case "views":
      request = request.order("views", { ascending: false });
      break;
    case "title":
      request = request.order("title", { ascending: true });
      break;
    default:
      request = request.order("created_at", { ascending: false });
  }

  const from = (page - 1) * perPage;
  const { data, error, count } = await request.range(from, from + perPage - 1);
  if (error && error.code !== "PGRST103") console.error("[admin:wallpapers]", error.message);

  const total = count ?? 0;
  const items = ((data ?? []) as unknown as Array<AdminWallpaperListItem & { category: unknown }>).map((row) => ({
    ...row,
    downloads: Number(row.downloads),
    views: Number(row.views),
    category: (Array.isArray(row.category) ? row.category[0] : row.category) ?? null,
  })) as AdminWallpaperListItem[];

  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function getAdminWallpaper(supabase: SupabaseClient, id: string): Promise<WallpaperAdminRow | null> {
  const { data, error } = await supabase
    .from("wallpapers")
    .select(
      "*,category:categories(name,slug),devices:wallpaper_devices(device:devices(id,name,slug,family,screen_label,width,height,sort_order)),collections:wallpaper_collections(collection:collections(id,name,slug,is_active))",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin:wallpaper]", error.message);
    return null;
  }
  if (!data) return null;

  const raw = data as Record<string, unknown>;
  // Admins should see inactive collections too.
  const collections = ((raw.collections as Array<{ collection: unknown }> | null) ?? [])
    .map((link) => (Array.isArray(link.collection) ? link.collection[0] : link.collection))
    .filter(Boolean) as { id: string; name: string; slug: string }[];

  return {
    ...toDetail(raw),
    collections: collections.map(({ id: collectionId, name, slug }) => ({ id: collectionId, name, slug })),
    status: raw.status as PublishStatus,
    created_by: (raw.created_by as string | null) ?? null,
  };
}

export async function getTopWallpapers(supabase: SupabaseClient, limit = 6) {
  const { data } = await supabase
    .from("wallpapers")
    .select("id,title,slug,thumb_key,downloads,views,dominant_color")
    .eq("status", "published")
    .order("downloads", { ascending: false })
    .limit(limit);
  return (data ?? []) as Array<{
    id: string;
    title: string;
    slug: string;
    thumb_key: string;
    downloads: number;
    views: number;
    dominant_color: string;
  }>;
}

export async function getRecentWallpapers(supabase: SupabaseClient, limit = 6) {
  const { data } = await supabase
    .from("wallpapers")
    .select("id,title,slug,thumb_key,status,created_at,dominant_color")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Array<{
    id: string;
    title: string;
    slug: string;
    thumb_key: string;
    status: PublishStatus;
    created_at: string;
    dominant_color: string;
  }>;
}

export async function listAllCategories(supabase: SupabaseClient) {
  const { data } = await supabase.from("categories").select("*").order("sort_order").order("name");
  return (data ?? []) as CategoryRow[];
}

export async function listAllCollections(supabase: SupabaseClient) {
  const { data } = await supabase.from("collections").select("*").order("sort_order").order("name");
  return (data ?? []) as CollectionRow[];
}

export async function listAllDevices(supabase: SupabaseClient) {
  const { data } = await supabase.from("devices").select("*").order("sort_order").order("name");
  return (data ?? []) as DeviceRow[];
}

export async function getTaxonomyCounts(supabase: SupabaseClient, view: string, idColumn: string) {
  const { data } = await supabase.from(view).select(`${idColumn},wallpaper_count`);
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as unknown as Array<Record<string, string | number>>) {
    counts[String(row[idColumn])] = Number(row.wallpaper_count ?? 0);
  }
  return counts;
}

export async function listAdminPosts(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("posts")
    .select("id,title,slug,status,published_at,updated_at,author_name,tags,cover_key")
    .order("updated_at", { ascending: false });
  return (data ?? []) as Array<
    Pick<Post, "id" | "title" | "slug" | "status" | "published_at" | "updated_at" | "author_name" | "tags" | "cover_key">
  >;
}

export async function getAdminPost(supabase: SupabaseClient, id: string) {
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  return (data as Post | null) ?? null;
}

export async function listMessages(
  supabase: SupabaseClient,
  status: ContactMessage["status"] | "inbox" | "all",
  page = 1,
  perPage = 20,
): Promise<Paginated<ContactMessage>> {
  let request = supabase.from("contact_messages").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (status === "inbox") request = request.in("status", ["new", "read"]);
  else if (status !== "all") request = request.eq("status", status);
  const from = (page - 1) * perPage;
  const { data, count } = await request.range(from, from + perPage - 1);
  const total = count ?? 0;
  return {
    items: (data ?? []) as ContactMessage[],
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function listReports(
  supabase: SupabaseClient,
  status: ContentReport["status"] | "all",
  page = 1,
  perPage = 20,
): Promise<Paginated<ContentReport & { wallpaper: { id: string; title: string; slug: string } | null }>> {
  let request = supabase
    .from("reports")
    .select("*,wallpaper:wallpapers(id,title,slug)", { count: "exact" })
    .order("created_at", { ascending: false });
  if (status !== "all") request = request.eq("status", status);
  const from = (page - 1) * perPage;
  const { data, count } = await request.range(from, from + perPage - 1);
  const total = count ?? 0;
  const items = ((data ?? []) as Array<ContentReport & { wallpaper: unknown }>).map((row) => ({
    ...row,
    wallpaper: (Array.isArray(row.wallpaper) ? row.wallpaper[0] : row.wallpaper) ?? null,
  })) as Array<ContentReport & { wallpaper: { id: string; title: string; slug: string } | null }>;
  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function getInboxCounts(supabase: SupabaseClient) {
  const [messages, reports] = await Promise.all([
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);
  return { messages: messages.count ?? 0, reports: reports.count ?? 0 };
}

export async function getAdminSettings(supabase: SupabaseClient): Promise<SiteSettings> {
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const settings: SiteSettings = { ...DEFAULT_SETTINGS };
  if (data) {
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
      const value = (data as Record<string, unknown>)[key];
      if (value !== null && value !== undefined) {
        (settings as unknown as Record<string, unknown>)[key] = value;
      }
    }
  }
  return settings;
}

export async function listAdminUsers(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("admin_users")
    .select("user_id,email,display_name,role,created_at")
    .order("created_at");
  return (data ?? []) as Array<{
    user_id: string;
    email: string;
    display_name: string | null;
    role: string;
    created_at: string;
  }>;
}
