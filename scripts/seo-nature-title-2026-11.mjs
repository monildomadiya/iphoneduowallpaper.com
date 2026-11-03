// Name "nature" on the Landscape category: Google Trends shows "nature wallpaper" searched far more
// than styles we already target (Nov 2026), and Landscape has the most downloads per wallpaper. Slug stays.
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";

process.loadEnvFile(".env.local");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const patch = {
  seo_title: "Nature & Landscape iPhone Duo Wallpapers — Free HD",
  seo_description:
    "Free nature and landscape wallpapers for iPhone Duo: desert dunes, snowy mountains, misty forests and calm seas, with a fit check for both displays.",
};

const { data: row, error } = await db.from("categories").select("*").eq("slug", "landscape").single();
if (error) throw error;
console.log(JSON.stringify({ before: { seo_title: row.seo_title, seo_description: row.seo_description }, patch }, null, 2));

if (process.argv.includes("--apply")) {
  mkdirSync(".variants", { recursive: true });
  const backup = `.variants/seo-nature-title-backup-${Date.now()}.json`;
  writeFileSync(backup, JSON.stringify(row, null, 2));
  console.log(`Backup saved: ${backup}`);
  const result = await db.from("categories").update(patch).eq("id", row.id).eq("updated_at", row.updated_at).select("id");
  if (result.error) throw result.error;
  if (result.data.length !== 1) throw new Error("Concurrent edit; stopped before overwriting landscape");
  console.log("Updated. Rebuild the production release to refresh its cache.");
} else console.log("Add --apply to write.");
