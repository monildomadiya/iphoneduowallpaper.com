// AdSense content clean-up (Oct 2026): resolution claims the files don't meet, social-media titles,
// and wallpapers published without a description. Slugs are left alone so no URL changes.
// Dry run by default; `node scripts/fix-adsense-content-2026-10.mjs --apply` writes the changes
// and saves the previous values under reports/ first.
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";

process.loadEnvFile(".env.local");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});
const apply = process.argv.includes("--apply");

const replacements = {
  "modern-abstract-geometric-lines-wallpaper-beige-gold-and-black-minimalist-design": {
    title: "Beige & Gold Retro Curves Duo Wallpaper",
    description:
      "Rounded bands of gold, cream and black step down the frame between two woven textures, a charcoal weave on one side and a beige ribbed panel on the other. The mid-century curves sit in the centre, so the inner display shows the full sweep while the outer crop keeps the gold arcs in view. Check both screen previews before you save it.",
    seo_title: "Beige & Gold Retro Curves Wallpaper for iPhone Duo",
    seo_description:
      "Mid-century gold, cream and black curves between charcoal and beige woven textures. Preview the iPhone Duo inner and outer crops, with the exact file size shown.",
  },
  "premium-purple-abstract-3d-wallpaper-ultra-hd-lavender-glass-design-2670-1878": {
    title: "Lavender Glass Curves Duo Wallpaper",
    description:
      "Two glossy lavender glass forms cross on a soft grey-white background, their violet edges catching a thin metallic highlight. The light background keeps the clock and app labels readable, and the curves fill the wide inner display while the outer crop centres on the overlap. Preview both screens before downloading.",
    seo_title: "Lavender Glass Curves Wallpaper for iPhone Duo",
    seo_description:
      "Glossy lavender and violet glass curves on a soft light background. Preview the iPhone Duo inner and outer crops, with the exact file size shown.",
  },
  "golden-sunrise-desert-dunes-and-mountain-landscape": {
    description:
      "The sun rises behind a jagged mountain range, lighting smooth golden dunes with fine wind ripples under a blue sky with thin streaks of cloud. The bright horizon sits in the middle of the frame, so the inner display shows the whole range while the outer crop focuses on the sunrise and the nearest dune.",
    seo_title: "Golden Sunrise Desert Dunes Wallpaper for iPhone Duo",
    seo_description:
      "Golden sand dunes and a mountain sunrise under a clear blue sky. Preview the iPhone Duo inner and outer crops before downloading, with the exact file size shown.",
  },
  "golden-desert-dunes-4k-wallpaper-blue-and-golden-sand-dunes-minimalist-nature-ba": {
    title: "Blue Shadow Golden Dunes Duo Wallpaper",
    description:
      "A tall sand dune rises to a sharp crest, its sunlit side pale gold and its shaded slope a deep blue. Distant ridges fade into a clear sky, leaving calm space at the top of the frame for the Lock Screen clock. Preview the wide inner-display crop and the taller outer crop before saving.",
    seo_title: "Blue & Gold Desert Dunes Wallpaper for iPhone Duo",
    seo_description:
      "A golden dune crest with deep blue shadows and a clear sky. Minimal desert wallpaper with iPhone Duo inner and outer crop previews and the exact file size shown.",
  },
  "luxury-sports-car-at-golden-sunset-cinematic-car-edit-shorts": {
    title: "Grey Sports Car at Golden Sunset Duo Wallpaper",
    description:
      "A grey sports coupe stands on mirror-still water beside a dark, cracked rock wall, with the sun setting over misty mountains behind it. The car and its reflection sit low in the frame, so the inner display keeps the whole scene and the outer crop centres on the car and the golden sky.",
    seo_title: "Grey Sports Car Sunset Wallpaper for iPhone Duo",
    seo_description:
      "A grey sports coupe reflected in still water at golden sunset, beside a dark rock wall. Preview the iPhone Duo inner and outer crops with the exact file size shown.",
  },
  "minimal-blue-abstract-iphone-duo-wallpaper": {
    description:
      "Two soft, rounded shapes in slate blue and deep navy overlap on an off-white paper texture, with a visible canvas grain throughout. The large calm areas leave room for widgets and app labels, and the outer crop keeps the point where the two shapes meet.",
  },
  "blue-neon-abstract-orb-iphone-duo-wallpaper": {
    description:
      "Nested rings of glowing blue glass stack symmetrically around a bright centre on a deep navy background, like light passing through a column of lenses. The dark surround suits Dark Mode, and the symmetry keeps the design balanced on both the inner and outer displays.",
  },
  "aqua-glass-ios-inspired-duo-wallpaper": {
    description:
      "Two glossy aqua glass domes meet in the middle of the frame, separated by thin gold rims that catch the light. Soft teal gradients fill the rest of the image, giving a clean iOS-style look that stays calm behind icons on the inner display and centres neatly on the outer screen.",
  },
  "neon-green-eyes-anime-amoled-wallpaper-iphone-duo": { title: "Neon Green Eyes Anime AMOLED iPhone Duo Wallpaper" },
  "blindfolded-crimson-warrior-amoled-wallpaper-iphone-duo": { title: "Blindfolded Crimson Warrior AMOLED iPhone Duo Wallpaper" },
  "crimson-eyes-anime-duo-amoled-wallpaper-iphone-duo": { title: "Crimson Eyes Anime AMOLED iPhone Duo Wallpaper" },
  "blue-and-orange-glow-duo-wallpaper-for-iphone-iphoneduowallpaper": { title: "Blue & Orange Glow Duo Wallpaper for iPhone" },
};

const RESOLUTION_CLAIM = /\b(4k|8k|uhd|ultra hd)\b/i;
const TAG_TYPOS = { asthetic: "aesthetic", peacefull: "peaceful" };

function cleanTags(tags, has4k) {
  const out = [];
  for (const tag of tags ?? []) {
    let next = tag;
    for (const [wrong, right] of Object.entries(TAG_TYPOS)) next = next.replace(new RegExp(`\\b${wrong}\\b`, "gi"), right);
    if (!has4k) next = next.replace(/\b(4k|8k|uhd|ultra hd)\b/gi, "").replace(/\s+/g, " ").trim();
    if (next.split(" ").length < 2 && /^(wallpaper|background)$/i.test(next)) continue;
    if (next && !out.some((item) => item.toLowerCase() === next.toLowerCase())) out.push(next);
  }
  return out;
}

const { data: rows, error } = await db.from("wallpapers").select("*").eq("status", "published");
if (error) throw error;

const changes = [];
for (const row of rows) {
  const master = row.variants?.files?.["4k"];
  const has4k = Math.max(master?.width || row.width, master?.height || row.height) >= 3840;
  const patch = { ...(replacements[row.slug] ?? {}) };
  for (const key of ["seo_title", "seo_description"]) {
    const value = key in patch ? patch[key] : row[key];
    if (!has4k && RESOLUTION_CLAIM.test(value || "")) patch[key] = null;
  }
  const tags = cleanTags(row.tags, has4k);
  if (JSON.stringify(tags) !== JSON.stringify(row.tags)) patch.tags = tags;
  for (const key of Object.keys(patch)) if (JSON.stringify(patch[key]) === JSON.stringify(row[key])) delete patch[key];
  if (Object.keys(patch).length) changes.push({ row, patch });
}

for (const { row, patch } of changes) console.log(row.slug, JSON.stringify(patch, null, 1));
console.log(`${changes.length} wallpapers to update${apply ? "" : " (dry run; pass --apply to write)"}`);
const missing = Object.keys(replacements).filter((slug) => !rows.some((row) => row.slug === slug));
if (missing.length) console.warn("Not found among published wallpapers:", missing.join(", "));

if (apply && changes.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  mkdirSync("reports", { recursive: true });
  const backup = `reports/adsense-content-before-${stamp}.json`;
  writeFileSync(
    backup,
    JSON.stringify(changes.map(({ row, patch }) => ({ id: row.id, slug: row.slug, before: Object.fromEntries(Object.keys(patch).map((key) => [key, row[key]])) })), null, 2),
  );
  for (const { row, patch } of changes) {
    const { error: updateError } = await db.from("wallpapers").update(patch).eq("id", row.id);
    if (updateError) throw new Error(`${row.slug}: ${updateError.message}`);
  }
  console.log(`Updated ${changes.length}; previous values saved to ${backup}`);
}
