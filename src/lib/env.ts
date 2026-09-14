// Public (client-safe) configuration. NEXT_PUBLIC_* values are inlined at build time.

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export const siteUrl = trimSlash(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000",
);

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const r2PublicUrl = trimSlash(process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "");

export const isProduction = process.env.NODE_ENV === "production";
