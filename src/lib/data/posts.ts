import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { Paginated, Post, PostCardData } from "@/lib/types";
import { isValidSlug } from "@/lib/utils";

const CARD_COLUMNS = "id,title,slug,excerpt,cover_key,tags,author_name,published_at,updated_at";
const DETAIL_COLUMNS = `${CARD_COLUMNS},content,seo_title,seo_description,status,created_at`;

export async function listPosts(page = 1, perPage = 12): Promise<Paginated<PostCardData>> {
  "use cache";
  cacheTag("posts");

  const supabase = getPublicSupabase();
  if (!supabase) {
    cacheLife("minutes");
    return { items: [], total: 0, page, perPage, totalPages: 1 };
  }

  const from = (page - 1) * perPage;
  const { data, error, count } = await supabase
    .from("posts")
    .select(CARD_COLUMNS, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    if (error.code !== "PGRST103") console.error("[data:posts]", error.message);
    cacheLife("minutes");
    return { items: [], total: 0, page, perPage, totalPages: 1 };
  }

  cacheLife("hours");
  const total = count ?? 0;
  return {
    items: (data ?? []) as PostCardData[],
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";

  if (!isValidSlug(slug)) {
    cacheLife("max");
    return null;
  }
  cacheTag("posts", `post:${slug}`);
  const supabase = getPublicSupabase();
  if (!supabase) {
    cacheLife("minutes");
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select(DETAIL_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Could not load post "${slug}": ${error.message}`);
  cacheLife("hours");
  return (data as Post | null) ?? null;
}

export async function getPrerenderPostSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("posts");
  cacheLife("hours");
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);
  return (data ?? []).map((row) => row.slug as string);
}

export async function getPostSitemapEntries(): Promise<{ slug: string; updated_at: string }[]> {
  "use cache";
  cacheTag("posts");
  const supabase = getPublicSupabase();
  if (!supabase) {
    cacheLife("minutes");
    return [];
  }
  const { data, error } = await supabase
    .from("posts")
    .select("slug,updated_at")
    .eq("status", "published")
    .limit(5000);
  if (error) cacheLife("minutes");
  else cacheLife("hours");
  return (data ?? []) as { slug: string; updated_at: string }[];
}
