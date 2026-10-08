import type { MetadataRoute } from "next";
import { getPostSitemapEntries } from "@/lib/data/posts";
import { getCategories, getDarkCategory, getDevices } from "@/lib/data/taxonomy";
import { getWallpaperSitemapEntries } from "@/lib/data/wallpapers";
import { absoluteUrl, imageUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [wallpapers, posts, stored, dark, devices] = await Promise.all([
    getWallpaperSitemapEntries(),
    getPostSitemapEntries(),
    getCategories(),
    getDarkCategory(),
    getDevices(),
  ]);
  const categories = [...stored, dark];

  // The newest wallpaper dates the hub pages that list it, so crawlers see them change.
  const libraryUpdated =
    [...wallpapers, ...posts].map((item) => item.updated_at).sort().at(-1) ?? new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: libraryUpdated, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/wallpapers"), lastModified: libraryUpdated, changeFrequency: "daily", priority: 0.9 },
    // A hub with nothing in it is noindex, so it stays out of the sitemap until it has something.
    ...(categories.length
      ? [{ url: absoluteUrl("/categories"), lastModified: libraryUpdated, changeFrequency: "weekly" as const, priority: 0.7 }]
      : []),
    ...(devices.length
      ? [{ url: absoluteUrl("/devices"), lastModified: libraryUpdated, changeFrequency: "weekly" as const, priority: 0.7 }]
      : []),
    ...(posts.length
      ? [{ url: absoluteUrl("/blog"), lastModified: libraryUpdated, changeFrequency: "weekly" as const, priority: 0.6 }]
      : []),
    { url: absoluteUrl("/maker"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy-policy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/cookie-policy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/disclaimer"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/dmca"), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Empty taxonomy pages are noindex (thin content), so they join the sitemap once they have wallpapers.
  const hasWallpapers = (item: { wallpaper_count: number }) => item.wallpaper_count > 0;

  return [
    ...staticPages,
    ...categories.filter(hasWallpapers).map((item) => ({
      url: absoluteUrl(`/categories/${item.slug}`),
      // Dark has no row of its own, so it is dated by the newest wallpaper like the other hubs.
      lastModified: item.updated_at || libraryUpdated,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...devices.filter(hasWallpapers).map((item) => ({
      url: absoluteUrl(`/devices/${item.slug}`),
      lastModified: item.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...wallpapers.map((item) => ({
      url: absoluteUrl(`/wallpapers/${item.slug}`),
      lastModified: item.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      // Only the preview: it is the image the page actually renders, so it is the one Google Images
      // can tie to this URL. Listing the original too just offered a second copy of the same picture.
      images: [imageUrl(item.preview_key)].filter(Boolean),
    })),
  ];
}
