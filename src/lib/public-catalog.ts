import type { WallpaperCardData } from "@/lib/types";
export interface PublicCatalogItem extends WallpaperCardData { description: string | null; tags: string[]; originalUrl: string; }
export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
