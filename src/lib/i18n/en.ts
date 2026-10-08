import type { HeaderStrings, MakerStrings } from "@/lib/i18n/types";

export const EN_HEADER: HeaderStrings = {
  skip: "Skip to content",
  home: "{site} home",
  search: "Search…",
  searchLabel: "Search wallpapers",
  searchPlaceholder: "Search wallpapers…",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  close: "Close",
  closeSearch: "Close search",
  quickLinks: "Quick links",
  menuLinks: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export const EN_MAKER: MakerStrings = {
  outerName: "Outer display",
  outerHint: "Folded · 5.4-inch",
  innerName: "Inner display",
  innerHint: "Unfolded · 7.6-inch",
  previewLabel: "Preview",
  formatLabel: "File format",
  modeLock: "Lock Screen",
  modeHome: "Home Screen",
  modeClean: "Clean",
  pixelPerfect: "Pixel-perfect",
  pixelPerfectNote: "Downscaled to fit — stays sharp.",
  greatFit: "Great fit",
  slightlySoft: "Slightly soft",
  soft: "Soft",
  enlarged: "Enlarged {n}% to fill the screen.",
  fixZoomOut: "Zoom out or use a larger photo.",
  fixLarger: "A larger photo will look sharper.",
  zoom: "Zoom",
  reset: "Reset {screen} framing",
  dragHint: "{screen} preview. Drag or use the arrow keys to move the picture.",
  emptyHint: "Choose a photo to see how sharp it will be on this screen.",
  downloadOuter: "Download outer display",
  downloadInner: "Download inner display",
  choose: "Choose a photo",
  change: "Change photo",
  loading: "Loading wallpaper…",
  dropHint: "Or drop an image here. It stays on your device.",
  pixels: "{w} × {h} pixels",
  downloadBoth: "Download both",
  preparing: "Preparing…",
  exportNote: "Exports exactly {outer} and {inner}. Your photo is never uploaded.",
  loadFailed: "Could not load this wallpaper. Choose a photo instead.",
  notImage: "That file is not an image.",
  tooLarge: "That photo is over 40 MB. Choose a smaller one.",
  cantOpen: "This browser can't open that image. Try a JPG, PNG or WebP.",
  exportFailed: "Could not create the wallpaper. Try again or choose another photo.",
};

/** Fills `{key}` placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
