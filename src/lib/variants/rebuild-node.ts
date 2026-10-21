import "server-only";
import { revalidateTag } from "next/cache";
import { deleteObjects, putObject } from "@/lib/r2";
import { isR2Configured } from "@/lib/server-env";
import { getServiceSupabase } from "@/lib/supabase/service";
import { imageUrl } from "@/lib/utils";
import { buildVariantFiles, isStale, variantKeyBase } from "./render";
import type { WallpaperVariants } from "./types";

function allKeys(variants: WallpaperVariants | null): string[] {
  return Object.values(variants?.files ?? {}).flatMap((file) => (file ? [file.key, file.preview].filter(Boolean) : [])) as string[];
}

/**
 * Cuts a wallpaper's per-device files on the server after it is saved, when its image or focal
 * point changed. The AI upscaler only runs on a workstation (`npm run variants -- upscale`), so a new
 * upload under 3840 px gets its crops here but no 4K file — and keeps its HD label — until then.
 * Moving the focal point of an upscaled wallpaper re-cuts from its 4K file, so it stays 4K.
 */
export async function rebuildVariants(wallpaperId: string): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase || !isR2Configured) return;

  const { data: row, error } = await supabase
    .from("wallpapers")
    .select("id,slug,original_key,focal_x,focal_y,variants")
    .eq("id", wallpaperId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || !isStale(row)) return;

  const previous = (row.variants as WallpaperVariants | null)?.version === 1 ? (row.variants as WallpaperVariants) : null;
  const master = previous && previous.source === row.original_key ? previous.files["4k"] : undefined;
  const response = await fetch(imageUrl(master?.key ?? row.original_key));
  if (!response.ok) throw new Error(`Could not fetch the image (HTTP ${response.status}).`);

  const result = await buildVariantFiles(Buffer.from(await response.arrayBuffer()), {
    slug: row.slug,
    keyBase: variantKeyBase(row.original_key),
    originalKey: row.original_key,
    focalX: row.focal_x,
    focalY: row.focal_y,
    upscaled: Boolean(master && previous?.upscaled),
  });
  for (const file of result.uploads) await putObject(file.key, file.body, file.contentType);

  const { error: saveError } = await supabase.from("wallpapers").update({ variants: result.variants }).eq("id", wallpaperId);
  if (saveError) throw new Error(saveError.message);

  const kept = new Set(allKeys(result.variants));
  await deleteObjects(allKeys(previous).filter((key) => !kept.has(key)));
  revalidateTag("wallpapers", { expire: 0 });
}

