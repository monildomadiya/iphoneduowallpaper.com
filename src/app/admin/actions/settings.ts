"use server";

import { z } from "zod";
import { failure, success, type ActionResult } from "@/lib/actions";
import { refreshTag } from "@/lib/admin/refresh";
import { emptyToNull } from "@/lib/admin/slugs";
import { authorize, MANAGER_ROLES } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import {
  AD_FORMATS,
  AD_PAGES,
  AD_PLACEMENTS,
  type AdFormat,
  type AdPlacement,
  type AdPlacementConfig,
} from "@/lib/types";

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

    refreshTag("settings");
    return success(null, "Settings saved.");
  } catch (error) {
    return failure(error, "Could not save settings.");
  }
}

const placementKeys = AD_PLACEMENTS.map((placement) => placement.key) as [string, ...string[]];
const formatKeys = AD_FORMATS.map((format) => format.key) as [AdFormat, ...AdFormat[]];

const slotOrEmpty = z.union([z.string().trim().regex(/^\d{6,20}$/, "Ad unit IDs are numbers."), z.literal("")]);

const placementSchema = z.object({
  enabled: z.boolean(),
  slot: slotOrEmpty,
  format: z.enum(formatKeys),
  layout_key: z
    .union([z.string().trim().regex(/^[-+\w]{4,40}$/, "Layout keys look like -6t+ed+2i-1n-4w."), z.literal("")])
    .optional(),
});

/**
 * Every field is optional except the switches the first version of this screen already sent, so the
 * mobile admin app keeps working: a payload with the old flat `slots` map is read as "every slot
 * with an ID is on, using its default unit type".
 */
const adsSchema = z.object({
  enabled: z.boolean(),
  clientId: z
    .union([z.string().trim().regex(/^ca-pub-\d{10,20}$/, "Publisher IDs look like ca-pub-1234567890123456."), z.literal("")])
    .nullish(),
  autoAds: z.boolean(),
  frequencyHint: z.union([z.string().trim().regex(/^\d{1,3}s$/, 'Use a number of seconds, like "30s".'), z.literal("")]).nullish(),
  lazyLoad: z.boolean().optional(),
  maxPerPage: z.coerce.number().int().min(1, "Allow at least one ad per page.").max(10, "Ten ads on one page is ad stuffing.").optional(),
  preview: z.boolean().optional(),
  adsTxt: z.string().max(10_000).nullish(),
  slots: z.record(z.enum(placementKeys), slotOrEmpty).optional(),
  placements: z.record(z.enum(placementKeys), placementSchema).optional(),
});

type AdsInput = z.output<typeof adsSchema>;

function normalisePlacements(data: AdsInput) {
  const placements: Partial<Record<AdPlacement, AdPlacementConfig>> = {};

  for (const definition of AD_PLACEMENTS) {
    const key = definition.key as AdPlacement;
    const saved = data.placements?.[key];
    const legacySlot = data.slots?.[key]?.trim() ?? "";
    const slot = (saved?.slot ?? legacySlot).trim();
    const enabled = saved?.enabled ?? Boolean(legacySlot);
    if (!enabled && !slot) continue;
    placements[key] = {
      enabled,
      slot,
      format: saved?.format ?? definition.format,
      ...(saved?.layout_key ? { layout_key: saved.layout_key } : {}),
    };
  }

  return placements;
}

/** Postgres and PostgREST each have their own way of saying "no such column". */
function isMissingColumn(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  if (error.code === "42703" || error.code === "PGRST204") return true;
  return /column .* does not exist|could not find the .* column/i.test(error.message ?? "");
}

export async function saveAdsSettings(input: z.input<typeof adsSchema>): Promise<ActionResult<null>> {
  try {
    const { supabase } = await authorize(MANAGER_ROLES);
    const data = adsSchema.parse(input);
    const clientId = emptyToNull(data.clientId);
    if (data.enabled && !clientId) {
      return { ok: false, error: "Add your AdSense publisher ID before turning ads on." };
    }

    const placements = normalisePlacements(data);
    const maxPerPage = data.maxPerPage ?? 4;

    // Ad stuffing is the most common reason a healthy account gets ad serving limited, and it is
    // the one thing this screen can get wrong in one click. Count what would actually render.
    const live = {} as Record<string, number>;
    for (const definition of AD_PLACEMENTS) {
      const config = placements[definition.key as AdPlacement];
      if (config?.enabled && config.slot) live[definition.page] = (live[definition.page] ?? 0) + 1;
    }
    const tooMany = AD_PAGES.find((page) => (live[page.key] ?? 0) > maxPerPage);
    if (tooMany) {
      return {
        ok: false,
        error: `${tooMany.label} would show ${live[tooMany.key]} ads, over your limit of ${maxPerPage}. Switch one off or raise the limit.`,
      };
    }

    // ad_slots is written alongside ad_placements so a rollback to the previous deploy, which only
    // knows that column, still finds every ad unit.
    const slots = Object.fromEntries(
      Object.entries(placements)
        .filter(([, config]) => config.slot)
        .map(([key, config]) => [key, config.slot]),
    );

    const legacyColumns = {
      adsense_enabled: data.enabled,
      adsense_client_id: clientId,
      adsense_auto_ads: data.autoAds,
      ad_slots: slots,
      ads_txt: emptyToNull(data.adsTxt),
    };

    const { error } = await supabase
      .from("site_settings")
      .update({
        ...legacyColumns,
        adsense_frequency_hint: emptyToNull(data.frequencyHint),
        ad_placements: placements,
        ads_lazy_load: data.lazyLoad ?? true,
        ads_max_per_page: maxPerPage,
        ads_preview: data.preview ?? false,
      })
      .eq("id", 1);

    if (error) {
      if (!isMissingColumn(error)) throw error;
      // The site is deployed but supabase/migrations/0004_ads.sql has not been run yet. Save what
      // the old columns can hold rather than losing the whole edit.
      const { error: legacyError } = await supabase.from("site_settings").update(legacyColumns).eq("id", 1);
      if (legacyError) throw legacyError;
      refreshTag("settings");
      return success(
        null,
        "Saved the publisher ID, switches and ad unit IDs. Run supabase/migrations/0004_ads.sql in the Supabase SQL editor to store unit types and the per-placement switches.",
      );
    }

    refreshTag("settings");
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
