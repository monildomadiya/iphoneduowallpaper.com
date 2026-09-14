export const LEGAL_LAST_UPDATED = "September 14, 2026";

/** Lock Screen mockup shows iPhone Duo's launch day. */
export const MOCKUP_TIME = "9:41";
export const MOCKUP_DATE = "Friday, October 23";

export const MAIN_NAV = [
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/categories", label: "Categories" },
  { href: "/collections", label: "Collections" },
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
      { href: "/collections", label: "Collections" },
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
      { href: "/blog/iphone-duo-wallpaper-sizes-explained", label: "Wallpaper Sizes" },
      { href: "/blog/how-to-set-wallpaper-on-iphone", label: "How to Set a Wallpaper" },
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
    question: "What resolution are the wallpapers?",
    answer:
      "We publish full-resolution originals, most of them 4K-class or higher. The exact resolution and file size are listed on every wallpaper page.",
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
