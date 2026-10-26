// Correct audited metadata without renaming existing URLs or replacing unrelated custom copy.
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";

process.loadEnvFile(".env.local");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});
const { data: rows, error } = await db.from("wallpapers").select("*").eq("status", "published");
if (error) throw error;
const replacements = {
  "golden-cosmic-glass-orbs-iphone-duo-wallpaper-2": {
    title: "Violet Liquid Silk Waves iPhone Duo Wallpaper",
    description: "Glossy violet waves flow across this abstract wallpaper, with lavender highlights and deep purple folds. The broad curves create a calm background for the iPhone Duo inner display, while the outer crop focuses on the flowing centre. Preview both screen crops before saving the file.",
    seo_title: "Violet Silk Waves Wallpaper for iPhone Duo",
    seo_description: "Download violet silk waves for iPhone Duo. Glossy purple folds and lavender highlights, with previews for both displays and the exact file size shown.",
    tags: ["purple wallpaper", "violet", "silk waves", "abstract", "lavender", "iphone duo wallpaper"],
  },
  "moonlit-halloween-window-iphone-duo-wallpaper-2": {
    title: "Halloween Balcony with Pumpkins and String Lights",
    description: "Glowing jack-o'-lanterns line an iron balcony beneath a window framed by autumn ivy and warm string lights. Cobwebs hang across the railing, lanterns light the stone walls, and a full moon shines above the town. Preview the wide inner-display crop and the taller outer crop before downloading.",
    seo_title: "Halloween Balcony Wallpaper for iPhone Duo",
    seo_description: "Download a cosy Halloween balcony wallpaper for iPhone Duo, with glowing pumpkins, autumn ivy, string lights and a full moon. Preview both screen crops.",
    tags: ["halloween wallpaper", "pumpkins", "balcony", "string lights", "autumn ivy", "full moon", "iphone duo wallpaper"],
  },
};
const changes = [];
for (const row of rows) {
  const master = row.variants?.files?.["4k"];
  const has4k = Math.max(master?.width || row.width, master?.height || row.height) >= 3840;
  const patch = {};
  if (!has4k && /\b4k\b/i.test(row.seo_title || "")) patch.seo_title = null;
  if (!has4k && /\b4k\b/i.test(row.seo_description || "")) patch.seo_description = null;
  const replacement = replacements[row.slug];
  if (replacement) for (const [key, value] of Object.entries(replacement)) {
    if (JSON.stringify(row[key]) !== JSON.stringify(value)) patch[key] = value;
  }
  if (Object.keys(patch).length) changes.push({ row, patch });
}
console.log(JSON.stringify(changes.map(({ row, patch }) => ({ slug: row.slug, patch })), null, 2));
if (process.argv.includes("--apply") && changes.length) {
  mkdirSync(".variants", { recursive: true });
  const backup = `.variants/seo-metadata-backup-${Date.now()}.json`;
  writeFileSync(backup, JSON.stringify(changes, null, 2));
  console.log(`Backup saved: ${backup}`);
  for (const { row, patch } of changes) {
    const result = await db.from("wallpapers").update(patch).eq("id", row.id).eq("updated_at", row.updated_at).select("id");
    if (result.error) throw result.error;
    if (result.data.length !== 1) throw new Error(`Concurrent edit; stopped before overwriting ${row.slug}`);
  }
  console.log(`Updated ${changes.length} wallpapers. Rebuild the production release to refresh its cache.`);
} else console.log(`${changes.length} proposed changes; add --apply to write.`);

// The category URL has existing search history; correct its label without renaming it.
const categoryResult = await db.from("categories").select("*").eq("slug", "anime-4k").maybeSingle();
if (categoryResult.error) throw categoryResult.error;
const category = categoryResult.data;
if (category && /4k/i.test(`${category.name} ${category.seo_title || ""}`)) {
  const patch = {
    name: "Anime",
    description: "Browse anime-style wallpapers for iPhone Duo. Preview how each design fits both screens and check the exact downloadable resolution before saving.",
    seo_title: "Anime Wallpapers for iPhone Duo — Free HD Downloads",
    seo_description: "Browse anime-style iPhone Duo wallpapers in HD. Preview outer and inner display crops, check each file's resolution and download your favourite design.",
  };
  console.log(JSON.stringify({ category: category.slug, patch }, null, 2));
  if (process.argv.includes("--apply")) {
    mkdirSync(".variants", { recursive: true });
    writeFileSync(`.variants/seo-category-backup-${Date.now()}.json`, JSON.stringify(category, null, 2));
    const result = await db.from("categories").update(patch).eq("id", category.id).eq("updated_at", category.updated_at).select("id");
    if (result.error) throw result.error;
    if (result.data.length !== 1) throw new Error("Concurrent category edit; no category change applied");
    console.log("Corrected Anime category metadata; existing URL preserved.");
  }
}
