// Public (client-safe) configuration. NEXT_PUBLIC_* values are inlined at build time.

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export const isProduction = process.env.NODE_ENV === "production";

// Production falls back to the custom domain so canonical URLs, the sitemap and robots.txt
// never point at the onrender.com address.
export const siteUrl = trimSlash(
  process.env.NEXT_PUBLIC_SITE_URL || (isProduction ? "https://iphoneduowallpaper.com" : "http://localhost:3000"),
);

// Supabase is only used on the server, so the unprefixed names (as Supabase lists them) work too.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const r2PublicUrl = trimSlash(process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "");
