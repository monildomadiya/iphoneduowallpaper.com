export type ResourceLink = { href: string; label: string; description: string };

export const FIT_HELP: ResourceLink = { href: "/wallpaper-help", label: "Check cropping and download quality", description: "Calculate how much of a photo fits and troubleshoot a soft or missing download." };
export const READABILITY_HELP: ResourceLink = { href: "/wallpaper-readability", label: "Test clock and app-label contrast", description: "Compare light and dark text on your photo, then export a dimmer background." };
export const MAKER_HELP: ResourceLink = { href: "/maker", label: "Make a crop for each screen", description: "Reframe your photo separately for the outer and inner displays." };
export const SIZE_GUIDE: ResourceLink = { href: "/blog/iphone-duo-wallpaper-sizes-explained", label: "Understand outer and inner wallpaper sizes", description: "Compare the two screen shapes before choosing a file." };
export const SETUP_GUIDE: ResourceLink = { href: "/blog/how-to-set-wallpaper-on-iphone", label: "Set your Lock Screen and Home Screen", description: "Apply the saved image and adjust each screen's appearance." };
export const BLUR_GUIDE: ResourceLink = { href: "/blog/why-is-my-iphone-wallpaper-blurry", label: "Fix a blurry or zoomed-in wallpaper", description: "Work out whether the problem is the source file, crop or a display setting." };
export const RESOLUTION_GUIDE: ResourceLink = { href: "/blog/how-to-check-image-resolution-ppi-iphone", label: "Check your photo's pixel dimensions", description: "Find the actual resolution before enlarging or exporting a wallpaper." };
export const ICON_GUIDE: ResourceLink = { href: "/blog/home-screen-wallpaper-readable-icons", label: "Choose a background for readable icons", description: "Leave calm areas behind app names and widgets." };
export const SAVE_GUIDE: ResourceLink = { href: "/blog/how-to-save-wallpapers-to-iphone-photos", label: "Save a download to iPhone Photos", description: "Move the image from your download into Photos before applying it." };

export const GUIDE_STARTERS = [SIZE_GUIDE, SETUP_GUIDE, BLUR_GUIDE, SAVE_GUIDE, ICON_GUIDE, RESOLUTION_GUIDE];

/** Editorial topic groups take priority over broad tags such as “guides”. */
const TOPIC_GROUPS = [
  ["iphone-duo-wallpaper-sizes-explained", "how-to-check-image-resolution-ppi-iphone", "iphone-wallpaper-resolution-4k-retina-ppi", "why-is-my-iphone-wallpaper-blurry", "iphone-duo-wallpaper-for-mac-ipad-pc", "iphone-duo-wallpaper-on-iphone-17-android"],
  ["how-to-set-wallpaper-on-iphone", "how-to-save-wallpapers-to-iphone-photos", "change-iphone-wallpaper-automatically", "iphone-lock-screen-focus-mode-wallpapers"],
  ["home-screen-wallpaper-readable-icons", "minimal-iphone-wallpapers-guide", "amoled-wallpapers-iphone-battery", "iphone-lock-screen-depth-effect-wallpapers", "how-to-make-your-own-iphone-duo-wallpaper"],
  ["anime-wallpapers-iphone-lock-screen", "iphone-lock-screen-depth-effect-wallpapers", "home-screen-wallpaper-readable-icons"],
  ["car-wallpapers-iphone-framing", "how-to-make-your-own-iphone-duo-wallpaper", "iphone-duo-wallpaper-sizes-explained"],
  ["ios-style-wallpapers-glass-gradients", "official-iphone-duo-wallpaper", "minimal-iphone-wallpapers-guide"],
];

export function guideTopicScore(slug: string, candidate: string) {
  return TOPIC_GROUPS.reduce((score, group) => score + (group.includes(slug) && group.includes(candidate) ? 1 : 0), 0);
}

export function resourcesForGuide(slug: string): ResourceLink[] {
  if (slug === "amoled-wallpapers-iphone-battery") return [
    { href: "/categories/dark", label: "Browse dark and AMOLED wallpapers", description: "Compare subdued backgrounds from across the library." }, READABILITY_HELP, FIT_HELP,
  ];
  const category = ({ "anime-wallpapers-iphone-lock-screen": "anime-4k", "minimal-iphone-wallpapers-guide": "minimal", "car-wallpapers-iphone-framing": "car", "ios-style-wallpapers-glass-gradients": "ios-inspired-wallpapers", "official-iphone-duo-wallpaper": "landscape" } as Record<string, string>)[slug];
  if (category) return [
    { href: `/categories/${category}`, label: "Try wallpapers in this style", description: "Open a design to inspect its framing and available download sizes." }, READABILITY_HELP, MAKER_HELP,
  ];
  if (/resolution|sizes|blurry|mac-ipad|iphone-17/.test(slug)) return [FIT_HELP, MAKER_HELP,
    { href: "/devices", label: "Compare supported screen sizes", description: "Choose the display you want to fit before downloading." },
  ];
  if (/make-your-own|readable|depth-effect|focus/.test(slug)) return [READABILITY_HELP, MAKER_HELP, FIT_HELP];
  return [FIT_HELP, READABILITY_HELP,
    { href: "/wallpapers", label: "Choose a wallpaper to apply", description: "Open the artwork page and save its full-resolution file." },
  ];
}
