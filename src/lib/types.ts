import type { WallpaperVariants } from "@/lib/variants/types";

export type PublishStatus = "draft" | "published";
export type SourceType = "original" | "ai" | "licensed" | "public_domain";
export type WallpaperSort = "latest" | "popular";
export type AdminRole = "owner" | "admin" | "editor";

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  original: "Original artwork",
  ai: "AI-assisted artwork",
  licensed: "Licensed",
  public_domain: "Public domain / CC0",
};

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_key: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionRow extends CategoryRow {
  is_featured: boolean;
}

export interface DeviceRow {
  id: string;
  name: string;
  slug: string;
  family: string;
  screen_label: string | null;
  width: number;
  height: number;
  diagonal_in: number | null;
  ppi: number | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxonomyStats {
  wallpaper_count: number;
  cover_thumb_key: string | null;
}

export type Category = CategoryRow & TaxonomyStats;
export type Device = DeviceRow & TaxonomyStats;

export type DeviceSummary = Pick<
  DeviceRow,
  "id" | "name" | "slug" | "family" | "screen_label" | "width" | "height"
>;

export interface WallpaperCardData {
  id: string;
  title: string;
  slug: string;
  thumb_key: string;
  preview_key: string;
  width: number;
  height: number;
  dominant_color: string;
  downloads: number;
  views: number;
  is_featured: boolean;
  published_at: string | null;
  category: { name: string; slug: string } | null;
}

export interface WallpaperDetail extends WallpaperCardData {
  description: string | null;
  /** Markdown written by hand for this one image, shown under "About this wallpaper". */
  about: string | null;
  tags: string[];
  original_key: string;
  file_size: number;
  mime_type: string;
  source_type: SourceType;
  credit_name: string | null;
  credit_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  devices: DeviceSummary[];
  /** Where the subject sits, 0–1 from the left and top; every device crop is centred on it. */
  focal_x: number;
  focal_y: number;
  /** Per-device files; null until `scripts/build-variants.mjs` or the admin panel has built them. */
  variants: WallpaperVariants | null;
  lock_screen_friendly: boolean;
}

export interface WallpaperAdminRow extends WallpaperDetail {
  collections: { id: string; name: string; slug: string }[];
  status: PublishStatus;
  created_by: string | null;
}

export interface PostCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_key: string | null;
  tags: string[];
  author_name: string;
  published_at: string | null;
  updated_at: string;
}

export interface Post extends PostCardData {
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  status: PublishStatus;
  created_at: string;
}

/**
 * The four AdSense unit types. Each one is a different `<ins>` on the page, so the format a
 * placement uses decides how the ad looks and roughly what it earns — a block of text reads an
 * in-article unit as part of the article, a card grid reads an in-feed unit as another card.
 */
export const AD_FORMATS = [
  {
    key: "display",
    label: "Display",
    hint: "The all-purpose responsive banner. Safe anywhere.",
    adsenseType: "Display ads",
  },
  {
    key: "in_article",
    label: "In-article",
    hint: "Sits between paragraphs and inherits the page's typography. Best inside guides.",
    adsenseType: "In-article ads",
  },
  {
    key: "in_feed",
    label: "In-feed",
    hint: "Styled like one more card in a grid or list. Needs the layout key AdSense gives you.",
    adsenseType: "In-feed ads",
  },
  {
    key: "multiplex",
    label: "Multiplex",
    hint: "A grid of suggested content. Earns best at the very end of a page.",
    adsenseType: "Multiplex ads",
  },
] as const;

export type AdFormat = (typeof AD_FORMATS)[number]["key"];

/** The pages a placement can appear on, in the order the admin screen lists them. */
export const AD_PAGES = [
  { key: "home", label: "Home page", note: "Nearly every search visit lands here." },
  { key: "listing", label: "Listing pages", note: "Categories, devices, search and /wallpapers." },
  { key: "wallpaper", label: "Wallpaper pages", note: "One per wallpaper — the deepest pages." },
  { key: "post", label: "Guides & blog posts", note: "Long-form text, where in-article units shine." },
] as const;

export type AdPage = (typeof AD_PAGES)[number]["key"];

/**
 * Every spot on the site that can hold an ad. Adding an entry here is what makes it appear in
 * Admin → Ads; the page itself has to render `<AdSlot placement="…" />` at that spot.
 */
export const AD_PLACEMENTS = [
  {
    key: "home_top",
    page: "home",
    label: "Below the hero",
    note: "First thing after the phone mockups. The highest-viewed spot on the site.",
    format: "display",
  },
  {
    key: "home_grid",
    page: "home",
    label: "Inside the “Latest” grid",
    note: "Breaks the grid after the sixth wallpaper, so it is seen while scrolling.",
    format: "display",
  },
  {
    key: "home_middle",
    page: "home",
    label: "Between sections",
    note: "After “Latest”, before “Categories”.",
    format: "display",
  },
  {
    key: "home_bottom",
    page: "home",
    label: "End of the page",
    note: "Above the FAQ. A multiplex unit does well this far down.",
    format: "multiplex",
  },
  {
    key: "list_top",
    page: "listing",
    label: "Above the grid",
    note: "Under the page heading, before the first row of wallpapers.",
    format: "display",
  },
  {
    key: "list_grid",
    page: "listing",
    label: "Inside the grid",
    note: "Breaks the grid after the tenth wallpaper.",
    format: "display",
  },
  {
    key: "list_bottom",
    page: "listing",
    label: "Below the grid",
    note: "Above the pagination links.",
    format: "display",
  },
  {
    key: "wallpaper_sidebar",
    page: "wallpaper",
    label: "Below the description",
    note: "After “About this wallpaper”, well clear of the download buttons.",
    format: "display",
  },
  {
    key: "wallpaper_bottom",
    page: "wallpaper",
    label: "Above “More like this”",
    note: "Full width, after the article column ends.",
    format: "display",
  },
  {
    key: "wallpaper_related",
    page: "wallpaper",
    label: "End of the page",
    note: "After the related wallpapers. Built for a multiplex unit.",
    format: "multiplex",
  },
  {
    key: "post_top",
    page: "post",
    label: "Below the title",
    note: "Before the table of contents.",
    format: "display",
  },
  {
    key: "post_middle",
    page: "post",
    label: "Mid-article",
    note: "At a heading near the middle of the text. The best-earning spot in a guide.",
    format: "in_article",
  },
  {
    key: "post_bottom",
    page: "post",
    label: "End of the article",
    note: "After the last paragraph.",
    format: "in_article",
  },
] as const satisfies readonly {
  key: string;
  page: AdPage;
  label: string;
  note: string;
  format: AdFormat;
}[];

export type AdPlacement = (typeof AD_PLACEMENTS)[number]["key"];

/** What Admin → Ads stores for one placement. */
export interface AdPlacementConfig {
  /** Off hides the unit without losing its slot ID. */
  enabled: boolean;
  /** The numeric ad unit ID from AdSense → Ads → By ad unit. */
  slot: string;
  format: AdFormat;
  /** In-feed units only: the `data-ad-layout-key` AdSense generates with the unit. */
  layout_key?: string;
}

export interface SocialLinks {
  instagram?: string;
  pinterest?: string;
  x?: string;
  youtube?: string;
  threads?: string;
  facebook?: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  contact_email: string;
  announcement: string | null;
  /** The master switch: off means no AdSense script and no ad units anywhere. */
  adsense_enabled: boolean;
  adsense_client_id: string | null;
  /** Auto ads are switched on inside AdSense; this tells the site to expect them. */
  adsense_auto_ads: boolean;
  /** Auto ads density, e.g. "30s". Empty leaves it to Google. */
  adsense_frequency_hint: string | null;
  /** Legacy slot-ID map, kept so an older deploy still finds its units. */
  ad_slots: Partial<Record<AdPlacement, string>>;
  /** The live per-placement configuration written by Admin → Ads. */
  ad_placements: Partial<Record<AdPlacement, AdPlacementConfig>>;
  /** Request each unit only as it nears the viewport: fewer wasted impressions, better viewability. */
  ads_lazy_load: boolean;
  /** How many units one page may show. The admin screen refuses to save more than this. */
  ads_max_per_page: number;
  /** Draws outlined boxes where ads would go instead of loading them. Visible to everyone. */
  ads_preview: boolean;
  ads_txt: string | null;
  ga_measurement_id: string | null;
  cookie_banner_enabled: boolean;
  social_links: SocialLinks;
  legal_entity: string | null;
  legal_jurisdiction: string;
  updated_at: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
}

export interface ContentReport {
  id: string;
  kind: "copyright" | "broken" | "inappropriate" | "other";
  wallpaper_id: string | null;
  page_url: string | null;
  name: string;
  email: string;
  original_url: string | null;
  details: string;
  status: "open" | "resolved" | "dismissed";
  created_at: string;
}
