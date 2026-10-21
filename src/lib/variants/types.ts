export type VariantName = "outer" | "inner" | "pro-max" | "pro" | "4k";

export interface VariantFile {
  key: string;
  width: number;
  height: number;
  bytes: number;
  /** Half-size WebP of the same crop, for the preview mockups. */
  preview?: string;
}

/** What `scripts/build-variants.mjs` writes to `wallpapers.variants`. */
export interface WallpaperVariants {
  version: 1;
  /** The original the files were cut from; a replaced image makes them stale. */
  source: string;
  focal: [number, number];
  /** Cut from an AI-upscaled master rather than the original upload. */
  upscaled: boolean;
  /** Size of the image the files were cut from (the master when upscaled). */
  sourceWidth: number;
  sourceHeight: number;
  files: Partial<Record<VariantName | "zip", VariantFile>>;
}
