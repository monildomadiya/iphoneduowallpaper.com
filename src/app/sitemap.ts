import type { MetadataRoute } from "next";
import { getPostSitemapEntries } from "@/lib/data/posts";
import { getCategories, getCollections, getDevices } from "@/lib/data/taxonomy";
import { getWallpaperSitemapEntries } from "@/lib/data/wallpapers";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [wallpapers, posts, categories, collections, devices] = await Promise.all([
    getWallpaperSitemapEntries(),
    getPostSitemapEntries(),
    getCategories(),
    getCollections(),
    getDevices(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/wallpapers"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categories"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/collections"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/devices"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy-policy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/cookie-policy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/disclaimer"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/dmca"), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...categories.map((item) => ({
      url: absoluteUrl(`/categories/${item.slug}`),
      lastModified: item.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...collections.map((item) => ({
      url: absoluteUrl(`/collections/${item.slug}`),
      lastModified: item.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...devices.map((item) => ({
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
    })),
  ];
}
