import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "iPhone Duo Wallpapers",
  tagline: "Beautiful wallpapers made for iPhone Duo.",
  contact_email: "contact@iphoneduowallpaper.com",
  announcement: null,
  adsense_enabled: false,
  adsense_client_id: null,
  adsense_auto_ads: false,
  ad_slots: {},
  ads_txt: null,
  ga_measurement_id: null,
  cookie_banner_enabled: true,
  social_links: {},
  legal_entity: null,
  legal_jurisdiction: "India",
  updated_at: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("settings");

  const supabase = getPublicSupabase();
  if (!supabase) {
    cacheLife("minutes");
    return DEFAULT_SETTINGS;
  }

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) console.error("[data:settings]", error.message);
    cacheLife("minutes");
    return DEFAULT_SETTINGS;
  }

  cacheLife("hours");
  const settings: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
    const value = (data as Record<string, unknown>)[key];
    if (value !== null && value !== undefined) {
      (settings as unknown as Record<string, unknown>)[key] = value;
    }
  }
  return settings;
}
