import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";

process.loadEnvFile(".env.local");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const changes = {
  "ios-inspired-wallpapers": {
    seo_title: "iOS Inspired iPhone Duo Wallpapers — Gradients & Glass",
    seo_description: "Free iOS-inspired wallpapers for iPhone Duo: gradients, glass shapes and abstract designs. Compare cover and inner crops and check actual file dimensions.",
  },
  minimal: {
    seo_title: "Minimal iPhone Duo Wallpapers — Free Clean Backgrounds",
    seo_description: "Find minimal iPhone Duo wallpapers with quiet colours, simple shapes and room for icons. Preview both screens and check each download's real resolution.",
  },
};
const { data, error } = await db.from("categories").select("id,slug,seo_title,seo_description,updated_at").in("slug", Object.keys(changes));
if (error) throw error;
if (data.length !== Object.keys(changes).length) throw new Error("Expected categories are missing; no metadata changed.");
const pending = data.filter((row) => Object.entries(changes[row.slug]).some(([key, value]) => row[key] !== value));
console.log(JSON.stringify(pending.map((row) => ({ slug: row.slug, patch: changes[row.slug] })), null, 2));
if (process.argv.includes("--apply") && pending.length) {
  mkdirSync(".variants", { recursive: true });
  writeFileSync(`.variants/category-metadata-before-${Date.now()}.json`, JSON.stringify(pending, null, 2));
  for (const row of pending) {
    const result = await db.from("categories").update(changes[row.slug]).eq("id", row.id).eq("updated_at", row.updated_at).select("id");
    if (result.error) throw result.error;
    if (result.data.length !== 1) throw new Error(`Concurrent edit; stopped before overwriting ${row.slug}`);
  }
  console.log(`Updated ${pending.length} categories; previous metadata backed up.`);
} else console.log(`${pending.length} changes proposed; use --apply to write.`);
