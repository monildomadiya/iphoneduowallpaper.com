/** Cover-style fit estimate; excludes any extra zoom or effects applied by the OS. */
export function estimateWallpaperFit(width: number, height: number, targetWidth: number, targetHeight: number) {
  if (![width, height, targetWidth, targetHeight].every((value) => Number.isInteger(value) && value > 0 && value <= 100000)) {
    return null;
  }
  const scale = Math.max(targetWidth / width, targetHeight / height);
  const visibleWidth = targetWidth / scale;
  const visibleHeight = targetHeight / scale;
  return {
    scale,
    removedPercent: Math.max(0, (1 - (visibleWidth * visibleHeight) / (width * height)) * 100),
    edges: width / height > targetWidth / targetHeight ? "left and right" : "top and bottom",
    visibleWidth: Math.round(visibleWidth),
    visibleHeight: Math.round(visibleHeight),
  };
}
