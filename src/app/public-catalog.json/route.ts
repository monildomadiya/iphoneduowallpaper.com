import { getPublicSupabase } from "@/lib/supabase/public";
import { toCard } from "@/lib/data/wallpapers";
import { imageUrl } from "@/lib/utils";

export const dynamic = "force-static";
export async function GET() {
  const supabase = getPublicSupabase();
  if (!supabase) throw new Error("Public catalogue requires the public Supabase build configuration");
  const items = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from("wallpapers")
      .select("id,title,slug,description,tags,original_key,thumb_key,preview_key,width,height,dominant_color,downloads,views,is_featured,published_at,category:categories(name,slug)")
      .eq("status", "published").order("downloads", { ascending: false }).order("id").range(offset, offset + 999);
    if (error) throw new Error(`Could not build public catalogue: ${error.message}`);
    for (const row of data ?? []) items.push({ ...toCard(row), description: row.description, tags: row.tags ?? [], originalUrl: imageUrl(row.original_key) });
    if (!data || data.length < 1000) break;
  }
  if (!items.length) throw new Error("Refusing to publish an empty wallpaper catalogue");
  return Response.json(items, { headers: { "Cache-Control": "public, max-age=0, must-revalidate", "X-Robots-Tag": "noindex" } });
}
