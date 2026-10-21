/**
 * Cuts a wallpaper into the files each screen needs. Shared by `scripts/build-variants.mjs`, which
 * Node runs directly, and the admin panel — so local imports carry their `.ts` extension, and types
 * come in with `import type`, which Node's type stripping can erase.
 */
import { createHash } from "node:crypto";
import { zipSync } from "fflate";
import sharp, { type Sharp } from "sharp";
import { DEVICE_VARIANTS, MASTER_LONG_EDGE, focalCrop } from "./geometry.ts";
import type { VariantFile, VariantName, WallpaperVariants } from "./types.ts";

export { DEVICE_VARIANTS, MASTER_LONG_EDGE, focalCrop } from "./geometry.ts";

/** Screens the preview switcher shows; each gets a lighter WebP at half size. */
const PREVIEWED: VariantName[] = ["outer", "inner", "pro-max"];

/** The folder a wallpaper's files live in: the one its original was uploaded to. */
export function variantKeyBase(originalKey: string): string {
  return originalKey.slice(0, originalKey.lastIndexOf("/"));
}

/** Files are immutable on the CDN, so a new focal point or image is written under a new folder. */
function buildId(originalKey: string, focalX: number, focalY: number, upscaled: boolean): string {
  return createHash("sha1").update(`${originalKey}:${focalX}:${focalY}:${upscaled}`).digest("hex").slice(0, 8);
}

export function isStale(row: {
  original_key: string;
  focal_x: number;
  focal_y: number;
  variants: WallpaperVariants | Record<string, never> | null;
}): boolean {
  const variants = row.variants as WallpaperVariants | null;
  return (
    !variants?.files?.outer ||
    variants.source !== row.original_key ||
    variants.focal[0] !== row.focal_x ||
    variants.focal[1] !== row.focal_y
  );
}

export interface Upload {
  key: string;
  body: Buffer;
  contentType: string;
}

export interface BuildInput {
  slug: string;
  keyBase: string;
  originalKey: string;
  focalX: number;
  focalY: number;
  /** The source is an AI-upscaled master rather than the uploaded original. */
  upscaled: boolean;
}

const jpeg = (image: Sharp) => image.jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" });

export async function buildVariantFiles(
  source: Buffer,
  input: BuildInput,
): Promise<{ uploads: Upload[]; variants: WallpaperVariants }> {
  // Wide-gamut sources keep their profile; everything else is written as sRGB.
  const base = sharp(source, { limitInputPixels: 80_000_000 }).rotate().keepIccProfile();
  const meta = await base.metadata();
  const width = meta.autoOrient?.width ?? meta.width ?? 0;
  const height = meta.autoOrient?.height ?? meta.height ?? 0;
  if (!width || !height) throw new Error(`${input.slug}: could not read the image size`);

  const id = buildId(input.originalKey, input.focalX, input.focalY, input.upscaled);
  const folder = `${input.keyBase}/v-${id}`;
  const uploads: Upload[] = [];
  const files: WallpaperVariants["files"] = {};

  const add = (name: VariantName, key: string, body: Buffer, size: { width: number; height: number }, preview?: string) => {
    uploads.push({ key, body, contentType: "image/jpeg" });
    const file: VariantFile = { key, width: size.width, height: size.height, bytes: body.length };
    if (preview) file.preview = preview;
    files[name] = file;
  };

  for (const [name, size] of Object.entries(DEVICE_VARIANTS) as [Exclude<VariantName, "4k">, { width: number; height: number }][]) {
    const crop = focalCrop(width, height, size.width, size.height, input.focalX, input.focalY);
    const cropped = base.clone().extract(crop).resize(size.width, size.height, { kernel: "lanczos3" });
    const body = await jpeg(cropped.clone()).toBuffer();
    let preview: string | undefined;
    if (PREVIEWED.includes(name)) {
      preview = `${folder}/${name}-preview.webp`;
      const previewBody = await cropped
        .clone()
        .resize(Math.round(size.width / 2), Math.round(size.height / 2))
        .webp({ quality: 80 })
        .toBuffer();
      uploads.push({ key: preview, body: previewBody, contentType: "image/webp" });
    }
    add(name, `${folder}/${name}-${size.width}x${size.height}.jpg`, body, size, preview);
  }

  // Only a source that really is 3840 px or more on the long edge becomes the 4K file.
  if (Math.max(width, height) >= MASTER_LONG_EDGE) {
    const scale = MASTER_LONG_EDGE / Math.max(width, height);
    const size = { width: Math.round(width * scale), height: Math.round(height * scale) };
    const body = await jpeg(base.clone().resize(size.width, size.height, { kernel: "lanczos3" })).toBuffer();
    add("4k", `${folder}/4k-${size.width}x${size.height}.jpg`, body, size);
  }

  const outer = uploads.find((file) => file.key === files.outer?.key)!;
  const inner = uploads.find((file) => file.key === files.inner?.key)!;
  // JPEGs are already compressed; storing them avoids burning CPU for no gain.
  const zip = Buffer.from(
    zipSync(
      {
        [`${input.slug}-iphone-duo-outer-1398x2034.jpg`]: [outer.body, { level: 0 }],
        [`${input.slug}-iphone-duo-inner-2670x1878.jpg`]: [inner.body, { level: 0 }],
      },
      { mtime: new Date("2026-10-23T00:00:00Z") },
    ),
  );
  const zipKey = `${folder}/iphone-duo-pair.zip`;
  uploads.push({ key: zipKey, body: zip, contentType: "application/zip" });
  files.zip = { key: zipKey, width: 0, height: 0, bytes: zip.length };

  return {
    uploads,
    variants: {
      version: 1,
      source: input.originalKey,
      focal: [input.focalX, input.focalY],
      upscaled: input.upscaled,
      sourceWidth: width,
      sourceHeight: height,
      files,
    },
  };
}
