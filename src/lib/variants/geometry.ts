/**
 * Crop geometry shared by the file builder (server, script) and the admin focal-point picker (browser).
 */
import type { VariantName } from "./types.ts";

export const MASTER_LONG_EDGE = 3840;

/** Native panel sizes. iOS shows a wallpaper at exactly these sizes pixel for pixel. */
export const DEVICE_VARIANTS: Record<Exclude<VariantName, "4k">, { width: number; height: number }> = {
  outer: { width: 1398, height: 2034 },
  inner: { width: 2670, height: 1878 },
  "pro-max": { width: 1320, height: 2868 },
  pro: { width: 1206, height: 2622 },
};

export interface Crop {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** The largest region of the target's shape, centred on the focal point and kept inside the image. */
export function focalCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  focalX = 0.5,
  focalY = 0.5,
): Crop {
  const ratio = targetWidth / targetHeight;
  let width = sourceWidth;
  let height = sourceHeight;
  if (sourceWidth / sourceHeight > ratio) width = Math.round(sourceHeight * ratio);
  else height = Math.round(sourceWidth / ratio);
  const clamp = (value: number, max: number) => Math.min(Math.max(Math.round(value), 0), max);
  return {
    left: clamp(focalX * sourceWidth - width / 2, sourceWidth - width),
    top: clamp(focalY * sourceHeight - height / 2, sourceHeight - height),
    width,
    height,
  };
}
