import "server-only";
import { cachedPublicQuery } from "@/lib/data/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import { getServiceSupabase } from "@/lib/supabase/service";
import type { WallpaperVariants } from "@/lib/variants/types";
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export interface DownloadTarget {
    id: string;
    slug: string;
    original_key: string;
    width: number;
    height: number;
    mime_type: string;
    variants: WallpaperVariants | null;
}
export async function getDownloadTarget(id: string): Promise<DownloadTarget | null> {
    return cachedPublicQuery(async () => {
        const supabase = getPublicSupabase();
        if (!supabase || !UUID_PATTERN.test(id)) {
            return null;
        }
        const { data, error } = await supabase
            .from("wallpapers")
            .select("id,slug,original_key,width,height,mime_type,variants")
            .eq("id", id)
            .eq("status", "published")
            .maybeSingle();
        if (error)
            throw new Error(`Could not load download target: ${error.message}`);
        if (!data)
            return null;
        const variants = data.variants as WallpaperVariants | null;
        return { ...(data as DownloadTarget), variants: variants?.version === 1 ? variants : null };
    }, "getDownloadTarget", [id], ["wallpapers"]);
}
const BOT_PATTERN = /bot|crawler|spider|crawling|preview|facebookexternalhit|slurp|mediapartners|headless/i;
export function isLikelyBot(userAgent: string | null) {
    return !userAgent || BOT_PATTERN.test(userAgent);
}
export async function trackWallpaperEvent(id: string, event: "view" | "download") {
    const supabase = getServiceSupabase();
    if (!supabase)
        return;
    const { error } = await supabase.rpc("track_wallpaper_event", { p_wallpaper_id: id, p_event: event });
    if (error)
        console.error(`[track:${event}]`, error.message);
}
