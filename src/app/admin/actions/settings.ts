"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { failure, success, type ActionResult } from "@/lib/actions";
import { emptyToNull } from "@/lib/admin/slugs";
import { authorize, MANAGER_ROLES } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { AD_PLACEMENTS } from "@/lib/types";

const urlOrEmpty = z.union([z.url({ protocol: /^https?$/, error: "Enter a full URL starting with https://" }), z.literal("")]).nullish();

const generalSchema = z.object({
  siteName: z.string().trim().min(2, "Site name is required.").max(60),
  tagline: z.string().trim().min(2).max(160),
  contactEmail: z.email("Enter a valid contact email."),
  announcement: z.string().trim().max(200).nullish(),
  gaMeasurementId: z
    .union([z.string().trim().regex(/^G-[A-Z0-9]{4,20}$/i, "GA4 IDs look like G-XXXXXXXXXX."), z.literal("")])
    .nullish(),
  cookieBannerEnabled: z.boolean(),
  legalEntity: z.string().trim().max(120).nullish(),
  legalJurisdiction: z.string().trim().min(2).max(80),
  social: z.object({
    instagram: urlOrEmpty,
    pinterest: urlOrEmpty,
    x: urlOrEmpty,
    youtube: urlOrEmpty,
    threads: urlOrEmpty,
    facebook: urlOrEmpty,
  }),
});

export async function saveGeneralSettings(input: z.input<typeof generalSchema>): Promise<ActionResult<null>> {
  try {
    const { supabase } = await authorize(MANAGER_ROLES);
    const data = generalSchema.parse(input);
    const social = Object.fromEntries(Object.entries(data.social).filter(([, value]) => Boolean(value)));

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: data.siteName,
        tagline: data.tagline,
        contact_email: data.contactEmail.toLowerCase(),
        announcement: emptyToNull(data.announcement),
        ga_measurement_id: emptyToNull(data.gaMeasurementId)?.toUpperCase() ?? null,
        cookie_banner_enabled: data.cookieBannerEnabled,
        legal_entity: emptyToNull(data.legalEntity),
        legal_jurisdiction: data.legalJurisdiction,
        social_links: social,
      })
      .eq("id", 1);
    if (error) throw error;

    updateTag("settings");
    return success(null, "Settings saved.");
  } catch (error) {
    return failure(error, "Could not save settings.");
  }
}

const placementKeys = AD_PLACEMENTS.map((placement) => placement.key) as [string, ...string[]];

const adsSchema = z.object({
  enabled: z.boolean(),
  clientId: z
    .union([z.string().trim().regex(/^ca-pub-\d{10,20}$/, "Publisher IDs look like ca-pub-1234567890123456."), z.literal("")])
    .nullish(),
  autoAds: z.boolean(),
  slots: z.record(z.enum(placementKeys), z.union([z.string().trim().regex(/^\d{6,20}$/, "Ad slot IDs are numbers."), z.literal("")])),
  adsTxt: z.string().max(10_000).nullish(),
});

export async function saveAdsSettings(input: z.input<typeof adsSchema>): Promise<ActionResult<null>> {
  try {
    const { supabase } = await authorize(MANAGER_ROLES);
    const data = adsSchema.parse(input);
    const clientId = emptyToNull(data.clientId);
    if (data.enabled && !clientId) {
      return { ok: false, error: "Add your AdSense publisher ID before turning ads on." };
    }
    const slots = Object.fromEntries(Object.entries(data.slots).filter(([, value]) => Boolean(value)));

    const { error } = await supabase
      .from("site_settings")
      .update({
        adsense_enabled: data.enabled,
        adsense_client_id: clientId,
        adsense_auto_ads: data.autoAds,
        ad_slots: slots,
        ads_txt: emptyToNull(data.adsTxt),
      })
      .eq("id", 1);
    if (error) throw error;

    updateTag("settings");
    return success(null, "Ad settings saved.");
  } catch (error) {
    return failure(error, "Could not save ad settings.");
  }
}

export async function updateDisplayName(name: string): Promise<ActionResult<null>> {
  try {
    const { admin } = await authorize();
    const displayName = z.string().trim().max(60).parse(name);
    const service = getServiceSupabase();
    if (!service) throw new Error("SUPABASE_SECRET_KEY is not configured");
    const { error } = await service
      .from("admin_users")
      .update({ display_name: displayName || null })
      .eq("user_id", admin.id);
    if (error) throw error;
    return success(null, "Profile updated.");
  } catch (error) {
    return failure(error, "Could not update your profile.");
  }
}
