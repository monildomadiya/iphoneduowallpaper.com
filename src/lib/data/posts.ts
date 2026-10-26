import "server-only";
import { cachedPublicQuery } from "@/lib/data/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { Paginated, Post, PostCardData } from "@/lib/types";
import { guideTopicScore } from "@/lib/guide-links";
import { isValidSlug } from "@/lib/utils";
const CARD_COLUMNS = "id,title,slug,excerpt,cover_key,tags,author_name,published_at,updated_at";
const DETAIL_COLUMNS = `${CARD_COLUMNS},content,seo_title,seo_description,status,created_at`;
export async function listPosts(page = 1, perPage = 12): Promise<Paginated<PostCardData>> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase) {
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
            if (error.code !== "PGRST103")
                console.error("[data:posts]", error.message);
            return { items: [], total: 0, page, perPage, totalPages: 1 };
        }
        const total = count ?? 0;
        return {
            items: (data ?? []) as PostCardData[],
            total,
            page,
            perPage,
            totalPages: Math.max(1, Math.ceil(total / perPage)),
        };
    }, "listPosts", [page, perPage], ["posts"]);
}
export async function getPostBySlug(slug: string): Promise<Post | null> {
    return cachedPublicQuery(async () => {
        if (!isValidSlug(slug)) {
            return null;
        }
        const supabase = getPublicSupabase();
        if (!supabase) {
            return null;
        }
        const { data, error } = await supabase
            .from("posts")
            .select(DETAIL_COLUMNS)
            .eq("slug", slug)
            .eq("status", "published")
            .maybeSingle();
        if (error)
            throw new Error(`Could not load post "${slug}": ${error.message}`);
        return (data as Post | null) ?? null;
    }, "getPostBySlug", [slug], ["posts"]);
}
/**
 * Guides on the same topic, ranked by shared tags and then by date. "Keep reading" used to show
 * the three newest posts everywhere, so a guide only ever linked to whatever was published last.
 */
export async function getRelatedPosts(post: Pick<Post, "id" | "slug" | "tags">, limit = 3): Promise<PostCardData[]> {
    const { items } = await listPosts(1, 50);
    const tags = new Set(post.tags.map((tag) => tag.toLowerCase()).filter((tag) => !["guides", "how-to", "iphone duo"].includes(tag)));
    return items
        .filter((item) => item.id !== post.id)
        .map((item, index) => ({ item, index, topic: guideTopicScore(post.slug, item.slug), shared: item.tags.filter((tag) => tags.has(tag.toLowerCase())).length }))
        .sort((a, b) => b.topic - a.topic || b.shared - a.shared || a.index - b.index)
        .slice(0, limit)
        .map(({ item }) => item);
}
export async function getPrerenderPostSlugs(): Promise<string[]> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase)
            return [];
        const { data } = await supabase
            .from("posts")
            .select("slug")
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(50);
        return (data ?? []).map((row) => row.slug as string);
    }, "getPrerenderPostSlugs", [], ["posts"]);
}
export async function getPostSitemapEntries(): Promise<{
    slug: string;
    updated_at: string;
}[]> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase) {
            return [];
        }
        const { data } = await supabase
            .from("posts")
            .select("slug,updated_at")
            .eq("status", "published")
            .limit(5000);
        return (data ?? []) as {
            slug: string;
            updated_at: string;
        }[];
    }, "getPostSitemapEntries", [], ["posts"]);
}
