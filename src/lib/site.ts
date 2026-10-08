import { aspectRatioLabel } from "@/lib/utils";

export const LEGAL_LAST_UPDATED = "September 14, 2026";

/** Lock Screen mockup shows iPhone Duo's launch day. */
export const MOCKUP_TIME = "9:41";
export const MOCKUP_DATE = "Friday, October 23";

export const MAIN_NAV = [
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/categories", label: "Categories" },
  { href: "/devices", label: "Devices" },
  { href: "/blog", label: "Guides" },
] as const;

export const FOOTER_NAV: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/wallpapers", label: "All Wallpapers" },
      { href: "/wallpapers?sort=popular", label: "Most Downloaded" },
      { href: "/categories", label: "Categories" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Devices",
    links: [
      { href: "/devices/iphone-duo-outer-display", label: "iPhone Duo Outer Display" },
      { href: "/devices/iphone-duo-inner-display", label: "iPhone Duo Inner Display" },
      { href: "/devices/iphone-18-pro-max", label: "iPhone 18 Pro Max" },
      { href: "/devices/iphone-18-pro", label: "iPhone 18 Pro" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Guides & Tips" },
      { href: "/blog/official-iphone-duo-wallpaper", label: "Official iPhone Duo Wallpaper" },
      { href: "/blog/iphone-duo-wallpaper-sizes-explained", label: "Wallpaper Sizes" },
      { href: "/blog/how-to-set-wallpaper-on-iphone", label: "How to Set a Wallpaper" },
      { href: "/blog/why-is-my-iphone-wallpaper-blurry", label: "Fix a Blurry Wallpaper" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/dmca", label: "DMCA & Copyright" },
    ],
  },
];

type GuideLink = { href: string; label: string };

/** The guide that goes deepest on each category, linked from the category and its wallpapers. */
const CATEGORY_GUIDES: Record<string, GuideLink> = {
  "anime-4k": {
    href: "/blog/anime-wallpapers-iphone-lock-screen",
    label: "How to pick anime art that works on a Lock Screen",
  },
  minimal: {
    href: "/blog/minimal-iphone-wallpapers-guide",
    label: "Why minimal wallpapers make your iPhone easier to use",
  },
  car: {
    href: "/blog/car-wallpapers-iphone-framing",
    label: "How to fit a wide car on a tall screen",
  },
  "ios-inspired-wallpapers": {
    href: "/blog/ios-style-wallpapers-glass-gradients",
    label: "Glass, gradients and orbs: what makes a wallpaper feel like iOS",
  },
};

const AMOLED_GUIDE: GuideLink = {
  href: "/blog/amoled-wallpapers-iphone-battery",
  label: "Do true-black AMOLED wallpapers save battery?",
};

export function categoryGuide(categorySlug: string | null | undefined): GuideLink | null {
  return (categorySlug && CATEGORY_GUIDES[categorySlug]) || null;
}

/** A wallpaper's category guide, or the AMOLED explainer for dark designs that have no category guide. */
export function wallpaperGuide(categorySlug: string | null | undefined, tags: string[]): GuideLink | null {
  return categoryGuide(categorySlug) ?? (tags.some((tag) => /\b(a?moled)\b/i.test(tag)) ? AMOLED_GUIDE : null);
}

/**
 * Search Console shows "iphone duo wallpaper" bringing most impressions, "iphone duo wallpaper 4k"
 * the best click-through, and "iPhone 18 Duo" as the next way people name the phone — and no
 * searches at all for the iPhone 18 Pro angle the title used to lead with. The site name already is
 * the main phrase, so "4K" lands right after it in the order people type it. 60 characters.
 */
export function homeTitle(siteName: string): string {
  return `${siteName} 4K & HD — Free iPhone 18 Duo Downloads`;
}

export const HOME_DESCRIPTION =
  "Download free 4K & HD iPhone Duo wallpapers for the 7.6-inch inner and 5.4-inch outer displays of the foldable iPhone 18 Duo. No app, no sign-up.";

export const HOME_FAQ = [
  {
    question: "Are the wallpapers free to download?",
    answer:
      "Yes. Every wallpaper can be downloaded for free for personal use on your own devices — no account or app required. Commercial use and redistribution are not permitted.",
  },
  {
    question: "Will these wallpapers fit the iPhone Duo inner and outer displays?",
    answer:
      "Each wallpaper page shows how the image fits the iPhone Duo outer display (1398 × 2034), the unfolded inner display (2670 × 1878) and iPhone 18 Pro models, so you can pick the right one before downloading.",
  },
  {
    question: "Is iPhone Duo the same as iPhone 18 Duo or the iPhone Fold?",
    answer:
      "Yes — they are names for the same foldable iPhone. It has a 5.4-inch outer display (1398 × 2034) you use when it is closed and a 7.6-inch inner display (2670 × 1878) that opens like a small tablet. Every wallpaper here is checked against both screens.",
  },
  {
    question: "Where can I get the official iPhone Duo wallpaper?",
    answer:
      "Apple's official iPhone Duo wallpaper — desert dunes in front of a mountain range, in light and dark versions — comes preinstalled on iPhone Duo. It is Apple's copyrighted artwork, so we don't host it; our guide to the official wallpaper explains its sizes and how to set it. Every wallpaper on this site is original artwork made for the same two screens.",
  },
  {
    question: "Are these iPhone Duo wallpapers 4K?",
    answer:
      "Look for the 4K label. Every wallpaper is published at its original resolution, and its page shows the exact pixel size with a quality label — 4K for files 3840 pixels or more on the long edge, QHD+ or HD below that. The largest iPhone Duo screen, the 7.6-inch inner display, is 2670 × 1878, so a 4K or QHD+ file stays pixel-sharp on it.",
  },
  {
    question: "What resolution are the wallpapers?",
    answer:
      "Every wallpaper is published at its original resolution, never re-compressed. The exact pixel size, the file size and a screen-by-screen fit check — iPhone Duo outer, iPhone Duo inner, iPhone 18 Pro and Pro Max — are on the page before you download, so you always know what you are getting.",
  },
  {
    question: "How do I set a wallpaper on my iPhone?",
    answer:
      "Save the image to Photos, then open Settings → Wallpaper → Add New Wallpaper, or touch and hold your Lock Screen and tap the + button. Our step-by-step guide covers every method.",
  },
  {
    question: "Are you affiliated with Apple?",
    answer:
      "No. This is an independent fan and design website. iPhone and iPhone Duo are trademarks of Apple Inc., used here only to describe device compatibility.",
  },
];

/**
 * Device pages used to be the same template with a different name in it, which gave Google nothing
 * to tell them apart. This builds copy from the device's own measurements so each page answers the
 * questions people actually search ("what size wallpaper for iPhone 18 Pro Max", "1320x2868").
 */
export function deviceFaq(device: {
  name: string;
  family: string;
  width: number;
  height: number;
}): { question: string; answer: string }[] {
  const { name, width, height } = device;
  const portrait = height >= width;
  const megapixels = ((width * height) / 1_000_000).toFixed(1);
  const ratio = aspectRatioLabel(width, height);
  const isDuo = /duo/i.test(device.family) || /duo/i.test(name);
  const inner = isDuo && !portrait;

  const shapeAnswer = inner
    ? `The unfolded inner display is ${ratio} and wider than it is tall, so a normal portrait phone wallpaper will be cropped hard at the top and bottom. Use a landscape image and keep the subject away from the middle, where the hinge runs.`
    : isDuo
      ? `The cover display is ${ratio}, squarer than the 2.17:1 screen on an iPhone 18 Pro Max, so a wallpaper cut for a normal iPhone is filled to the width and loses a band from the top and the bottom. Pick an image made for ${width} × ${height} and the framing stays as intended.`
      : `${name} is ${ratio}, the usual tall iPhone shape. Landscape images are cropped to a narrow vertical slice, so portrait artwork is what you want.`;

  return [
    {
      question: `What size wallpaper does the ${name} need?`,
      answer: `Exactly ${width} × ${height} pixels — ${megapixels} megapixels, ${portrait ? "portrait" : "landscape"}. iOS scales any image to fill the screen, so a smaller file is enlarged and looks soft. A bigger file at the same shape is safe: it is scaled down and stays sharp.`,
    },
    { question: `Will a wallpaper from another iPhone fit the ${name}?`, answer: shapeAnswer },
    {
      question: `How do I set one of these as my ${name} wallpaper?`,
      answer: `Download the image, save it to Photos, then open Settings → Wallpaper → Add New Wallpaper and choose Photos. You can also touch and hold the Lock Screen and tap +. On iPhone, downloads land in Files → Downloads first, so move the image to Photos before you look for it.`,
    },
  ];
}
