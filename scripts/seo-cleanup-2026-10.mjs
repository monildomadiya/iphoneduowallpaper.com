#!/usr/bin/env node
/**
 * One-off data changes for the October 2026 SEO pass (the 301s live in next.config.ts):
 *  - drops brand words from two slugs and gives the two copy-pasted "-2" duplicates their own
 *    title, slug, description and tags (each was a different picture with the first one's text);
 *  - renames the "Anime 4K" category to "Anime" (/categories/anime);
 *  - clears per-wallpaper SEO title/description overrides so every page uses the shared templates
 *    (several still said "| 4K" for 1495 px files).
 *
 *   node scripts/seo-cleanup-2026-10.mjs           # dry run: prints what would change
 *   node scripts/seo-cleanup-2026-10.mjs --apply   # writes, after saving a backup to .variants/
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

for (const file of [".env.local", ".env"]) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match || line.trim().startsWith("#") || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

const apply = process.argv.includes("--apply");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const WALLPAPERS = {
  "blue-and-orange-glow-duo-wallpaper-for-iphone-iphoneduowallpaper": { slug: "blue-orange-glow-duo-wallpaper" },
  "midnight-sage-gold-geometric-duo-wallpaper-for-iphone": { slug: "midnight-sage-gold-geometric-duo-wallpaper" },
  "moonlit-halloween-window-iphone-duo-wallpaper-2": {
    slug: "ivy-halloween-balcony-string-lights-iphone-duo-wallpaper",
    title: "Ivy-Covered Halloween Balcony with String Lights",
    description:
      "A cosy Halloween iPhone Duo wallpaper featuring an old stone balcony draped in autumn ivy, glowing lanterns, warm string lights and a row of grinning jack-o'-lanterns along the railing. Cobwebs hang from the ironwork, lit windows glow behind, and a small full moon rises over the rooftops and church spire of a sleeping town. Warm orange light against a deep blue night makes it festive rather than scary, and the balcony fills the wide inner display edge to edge.",
    tags: [
      "halloween wallpaper iphone",
      "halloween balcony wallpaper",
      "jack o lantern wallpaper",
      "string lights wallpaper",
      "autumn ivy wallpaper",
      "cozy halloween wallpaper",
      "full moon wallpaper",
      "iphone duo wallpaper",
    ],
  },
  "golden-cosmic-glass-orbs-iphone-duo-wallpaper-2": {
    slug: "violet-liquid-silk-waves-iphone-duo-wallpaper",
    title: "Violet Liquid Silk Waves",
    description:
      "An abstract iPhone Duo wallpaper featuring glossy waves of liquid violet silk rolling across the frame, with soft highlights along each crest and deep purple shadows in the folds. The bands run edge to edge, so the flow continues unbroken from the outer display to the unfolded inner display. Vivid but smooth, it suits a colourful Home Screen and keeps icons readable over its darker troughs.",
    tags: [
      "purple wallpaper",
      "violet wallpaper",
      "liquid silk wallpaper",
      "abstract waves wallpaper",
      "fluid gradient wallpaper",
      "vibrant abstract wallpaper",
      "iphone duo wallpaper",
      "dual screen wallpaper",
    ],
  },
};

const CATEGORY = {
  from: "anime-4k",
  slug: "anime",
  name: "Anime",
  description:
    "Anime wallpapers designed for iPhone Duo screens: original characters, cinematic artwork and dark themes framed to look right on both the outer and the inner display.",
};

const { data: wallpapers, error } = await supabase.from("wallpapers").select("*");
if (error) throw new Error(error.message);
const { data: categories, error: categoryError } = await supabase.from("categories").select("*");
if (categoryError) throw new Error(categoryError.message);

if (apply) {
  mkdirSync(".variants", { recursive: true });
  const backup = `.variants/backup-seo-cleanup-${Date.now()}.json`;
  writeFileSync(backup, JSON.stringify({ wallpapers, categories }, null, 2));
  console.log(`Backup: ${backup}`);
}

for (const [from, change] of Object.entries(WALLPAPERS)) {
  const row = wallpapers.find((item) => item.slug === from);
  if (!row) {
    console.log(`skip ${from}: not found (already renamed?)`);
    continue;
  }
  console.log(`wallpaper ${from} → ${change.slug}${change.title ? ` "${change.title}"` : ""}`);
  if (apply) {
    const { error: updateError } = await supabase.from("wallpapers").update(change).eq("id", row.id);
    if (updateError) throw new Error(updateError.message);
  }
}

const overridden = wallpapers.filter((row) => row.seo_title || row.seo_description);
console.log(`clear SEO overrides on ${overridden.length} wallpaper(s)`);
if (apply && overridden.length) {
  const { error: clearError } = await supabase
    .from("wallpapers")
    .update({ seo_title: null, seo_description: null })
    .in("id", overridden.map((row) => row.id));
  if (clearError) throw new Error(clearError.message);
}

const category = categories.find((item) => item.slug === CATEGORY.from);
if (category) {
  console.log(`category ${CATEGORY.from} → ${CATEGORY.slug} "${CATEGORY.name}"`);
  if (apply) {
    const { error: categoryUpdateError } = await supabase
      .from("categories")
      .update({ slug: CATEGORY.slug, name: CATEGORY.name, description: CATEGORY.description })
      .eq("id", category.id);
    if (categoryUpdateError) throw new Error(categoryUpdateError.message);
  }
} else {
  console.log(`skip category ${CATEGORY.from}: not found (already renamed?)`);
}

console.log(apply ? "Done." : "Dry run — add --apply to write.");
