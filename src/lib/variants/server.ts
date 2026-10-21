import "server-only";
import type { WallpaperVariants } from "./types";

export async function rebuildVariants(wallpaperId: string): Promise<void> {
  // A build-time constant keeps native Sharp out of the Workers bundle.
  if (process.env.NEXT_PUBLIC_VARIANTS_MODE === "workstation") return;
  const renderer = await import("./rebuild-node");
  await renderer.rebuildVariants(wallpaperId);
}

/** Every file key a stored variant set points at — for deleting a wallpaper's files. */
export function variantKeys(variants: unknown): string[] {
  const parsed = variants as WallpaperVariants | null;
  if (parsed?.version !== 1) return [];
  return Object.values(parsed.files).flatMap((file) =>
    file ? [file.key, file.preview].filter((key): key is string => Boolean(key)) : [],
  );
}
