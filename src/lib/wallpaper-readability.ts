export type Rgb = readonly [number, number, number];
export const LIGHT_TEXT: Rgb = [255, 255, 255];
export const DARK_TEXT: Rgb = [17, 24, 39];

export function relativeLuminance(rgb: Rgb): number {
  const channels = rgb.map((value) => {
    const channel = Math.max(0, Math.min(255, value)) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

/** Samples the background before preview text is drawn; never rounds a pass/fail threshold. */
export function assessReadability(pixels: Uint8ClampedArray, text: Rgb, threshold: number) {
  if (!pixels.length || pixels.length % 4 !== 0) throw new Error("Expected nonempty RGBA pixels");
  const ratios: number[] = [];
  let above = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const ratio = contrastRatio(text, [pixels[index], pixels[index + 1], pixels[index + 2]]);
    ratios.push(ratio);
    if (ratio >= threshold) above++;
  }
  ratios.sort((a, b) => a - b);
  return {
    coverage: (above / ratios.length) * 100,
    minimum: ratios[0],
    lowerDecile: ratios[Math.floor((ratios.length - 1) * 0.1)],
    samples: ratios.length,
  };
}
