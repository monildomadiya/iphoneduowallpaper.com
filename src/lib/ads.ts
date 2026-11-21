import {
  AD_FORMATS,
  AD_PLACEMENTS,
  type AdFormat,
  type AdPage,
  type AdPlacement,
  type AdPlacementConfig,
  type SiteSettings,
} from "@/lib/types";

/** One placement, ready to render: the slot ID and the format its `<ins>` should use. */
export interface ResolvedPlacement {
  slot: string;
  format: AdFormat;
  layoutKey?: string;
}

/** Everything a page needs to decide what to draw. Passed from the server into AdsProvider. */
export interface AdsConfig {
  enabled: boolean;
  clientId: string | null;
  placements: Partial<Record<AdPlacement, ResolvedPlacement>>;
  lazy: boolean;
  /** Outlined boxes instead of real units. */
  preview: boolean;
  /** `data-adtest="on"`, so a developer's clicks are never billed. */
  testMode: boolean;
}

const PLACEMENT_BY_KEY = new Map(AD_PLACEMENTS.map((placement) => [placement.key as AdPlacement, placement]));
const FORMAT_KEYS = new Set<string>(AD_FORMATS.map((format) => format.key));

export function adPlacement(key: AdPlacement) {
  return PLACEMENT_BY_KEY.get(key);
}

export function placementsForPage(page: AdPage) {
  return AD_PLACEMENTS.filter((placement) => placement.page === page);
}

/**
 * The saved configuration for one placement, with every field filled in.
 *
 * `ad_placements` is the current store. `ad_slots` is the column this site used before placements
 * could be switched on and off individually, so a slot ID that only exists there still counts as
 * live — otherwise ads would silently stop the moment this code deploys.
 */
export function placementConfig(settings: SiteSettings, key: AdPlacement): AdPlacementConfig {
  const definition = PLACEMENT_BY_KEY.get(key);
  const saved = settings.ad_placements?.[key];
  const legacySlot = settings.ad_slots?.[key] ?? "";
  const slot = (saved?.slot ?? legacySlot ?? "").trim();
  const format = saved?.format && FORMAT_KEYS.has(saved.format) ? saved.format : (definition?.format ?? "display");

  return {
    enabled: saved?.enabled ?? Boolean(legacySlot),
    slot,
    format,
    ...(saved?.layout_key ? { layout_key: saved.layout_key } : {}),
  };
}

/** The placements that will actually render: switched on, and carrying a slot ID. */
export function resolveAdPlacements(settings: SiteSettings) {
  const resolved: Partial<Record<AdPlacement, ResolvedPlacement>> = {};
  for (const placement of AD_PLACEMENTS) {
    const key = placement.key as AdPlacement;
    const config = placementConfig(settings, key);
    if (!config.enabled || !config.slot) continue;
    // An in-feed unit without its layout key renders as an empty box, so fall back to a banner.
    const format = config.format === "in_feed" && !config.layout_key ? "display" : config.format;
    resolved[key] = {
      slot: config.slot,
      format,
      ...(config.layout_key ? { layoutKey: config.layout_key } : {}),
    };
  }
  return resolved;
}

export function adsConfigFromSettings(settings: SiteSettings, testMode: boolean): AdsConfig {
  return {
    // Ads only serve when the master switch is on and a publisher ID is saved.
    enabled: settings.adsense_enabled && Boolean(settings.adsense_client_id),
    clientId: settings.adsense_client_id,
    // Resolved even with ads off, so preview mode can name the unit behind each outlined box.
    placements: resolveAdPlacements(settings),
    lazy: settings.ads_lazy_load,
    preview: settings.ads_preview,
    testMode,
  };
}
