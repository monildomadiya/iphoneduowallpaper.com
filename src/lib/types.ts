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
export type Collection = CollectionRow & TaxonomyStats;
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
  collections: { id: string; name: string; slug: string }[];
}

export interface WallpaperAdminRow extends WallpaperDetail {
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

export const AD_PLACEMENTS = [
  { key: "home_top", label: "Home — below hero" },
  { key: "home_middle", label: "Home — between sections" },
  { key: "list_top", label: "Listing pages — above grid" },
  { key: "list_bottom", label: "Listing pages — below grid" },
  { key: "wallpaper_sidebar", label: "Wallpaper page — details column" },
  { key: "wallpaper_bottom", label: "Wallpaper page — above related" },
  { key: "post_top", label: "Blog post — below title" },
  { key: "post_bottom", label: "Blog post — end of article" },
] as const;

export type AdPlacement = (typeof AD_PLACEMENTS)[number]["key"];

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
  adsense_enabled: boolean;
  adsense_client_id: string | null;
  adsense_auto_ads: boolean;
  ad_slots: Partial<Record<AdPlacement, string>>;
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
