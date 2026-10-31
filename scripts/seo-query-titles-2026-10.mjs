// Point guides' search titles at the questions people actually type (Search Console, Oct 2026).
// "why is my wallpaper blurry on iphone" and its variants sit at position 9–11 with no clicks; the
// image-resolution guide ranks 22–33 for "how to check image resolution on iphone"; the official
// wallpaper guide shows at 7.4 for "iphone duo wallpaper 4k" (210 impressions, 1% CTR) without
// saying 4K in its title — it answers whether the files are 4K, so the title asks that. Slugs stay.
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";

process.loadEnvFile(".env.local");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const replacements = {
  "why-is-my-iphone-wallpaper-blurry": {
    seo_title: "Why Is My iPhone Wallpaper Blurry or Zoomed In? 9 Fixes",
    seo_description:
      "Wallpaper blurry or zoomed in on your iPhone? Nine causes and fixes, from a too-small image and Perspective Zoom to iCloud optimized copies and chat-app compression.",
  },
  "how-to-check-image-resolution-ppi-iphone": {
    seo_title: "How to Check Image Resolution on iPhone (Pixels & PPI)",
  },
  "official-iphone-duo-wallpaper": {
    seo_title: "Official iPhone Duo Wallpaper: Is It 4K? Sizes & Download",
  },
};

const { data: rows, error } = await db.from("posts").select("*").in("slug", Object.keys(replacements));
if (error) throw error;
const changes = [];
for (const row of rows) {
  const patch = {};
  for (const [key, value] of Object.entries(replacements[row.slug])) if (row[key] !== value) patch[key] = value;
  if (Object.keys(patch).length) changes.push({ row, patch });
}
console.log(JSON.stringify(changes.map(({ row, patch }) => ({ slug: row.slug, before: { seo_title: row.seo_title }, patch })), null, 2));

if (process.argv.includes("--apply") && changes.length) {
  mkdirSync(".variants", { recursive: true });
  const backup = `.variants/seo-query-titles-backup-${Date.now()}.json`;
  writeFileSync(backup, JSON.stringify(changes.map(({ row }) => row), null, 2));
  console.log(`Backup saved: ${backup}`);
  for (const { row, patch } of changes) {
    const result = await db.from("posts").update(patch).eq("id", row.id).eq("updated_at", row.updated_at).select("id");
    if (result.error) throw result.error;
    if (result.data.length !== 1) throw new Error(`Concurrent edit; stopped before overwriting ${row.slug}`);
  }
  console.log(`Updated ${changes.length} posts. Rebuild the production release to refresh its cache.`);
} else console.log(`${changes.length} proposed changes; add --apply to write.`);
