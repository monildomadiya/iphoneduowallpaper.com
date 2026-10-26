// Public (client-safe) configuration. NEXT_PUBLIC_* values are inlined at build time.

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export const isProduction = process.env.NODE_ENV === "production";

const productionSiteUrl = "https://iphoneduowallpaper.com";
const configuredSiteUrl = trimSlash(process.env.NEXT_PUBLIC_SITE_URL || "");

function publicSiteUrl(): string {
  if (!isProduction) return configuredSiteUrl || "http://localhost:3000";
  if (!configuredSiteUrl) return productionSiteUrl;
  try {
    const url = new URL(configuredSiteUrl);
    // A developer's .env.local must never publish loopback canonicals or sitemap URLs.
    if (url.protocol === "https:" && !/^(localhost|127(?:\.\d+){3}|\[::1\]|0\.0\.0\.0)$/.test(url.hostname)) {
      return url.origin;
    }
  } catch {
    // Invalid configuration uses the site's known public origin.
  }
  return productionSiteUrl;
}

export const siteUrl = publicSiteUrl();

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
