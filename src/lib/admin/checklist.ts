import "server-only";
import { r2PublicUrl, siteUrl } from "@/lib/env";
import { isR2Configured, supabaseSecretKey } from "@/lib/server-env";
import type { SiteSettings } from "@/lib/types";

export interface ChecklistItem {
  label: string;
  done: boolean;
  href?: string;
}

interface ChecklistCounts {
  wallpapers_published: number;
  posts_published: number;
  categories_total: number;
}

/** The AdSense readiness list, shared by the dashboard page and the admin app. */
export function buildAdSenseChecklist(counts: ChecklistCounts, settings: SiteSettings): ChecklistItem[] {
  return [
    { label: "Database connected", done: true },
    { label: "Server secret key configured (forms & counters)", done: Boolean(supabaseSecretKey) },
    { label: "Cloudflare R2 storage configured", done: isR2Configured && Boolean(r2PublicUrl) },
    { label: "Custom domain set in NEXT_PUBLIC_SITE_URL", done: !/localhost|onrender\.com/.test(siteUrl) },
    { label: "Privacy, Terms, Cookie, DMCA & Contact pages live", done: true },
    {
      label: `At least 30 published wallpapers (${counts.wallpapers_published})`,
      done: counts.wallpapers_published >= 30,
      href: "/admin/wallpapers/new",
    },
    {
      label: `At least 5 helpful blog posts (${counts.posts_published})`,
      done: counts.posts_published >= 5,
      href: "/admin/posts/new",
    },
    {
      label: `Categories created (${counts.categories_total})`,
      done: counts.categories_total > 0,
      href: "/admin/categories",
    },
    { label: "AdSense publisher ID added", done: Boolean(settings.adsense_client_id), href: "/admin/ads" },
    { label: "Ads switched on after approval", done: settings.adsense_enabled, href: "/admin/ads" },
  ];
}
