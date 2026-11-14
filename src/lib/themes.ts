/**
 * Styles people search for that cut across categories: a sunset can be filed under Car or Landscape.
 * Like Dark, each is a page at a category address that gathers matching wallpapers wherever they are
 * filed, chosen from Search Console, Google Trends and our own download counts (Nov 2026). A theme
 * goes live on its own once it holds `MIN_THEME_WALLPAPERS`, so a thin page is never published.
 */
export interface WallpaperTheme {
  slug: string;
  name: string;
  title: string;
  description: string;
  /** Tested against a wallpaper's lower-cased title and tags, not its description, which mentions things in passing. */
  match: RegExp;
  exclude?: RegExp;
  heading: string;
  paragraphs: string[];
  guide: { href: string; label: string };
}

export const MIN_THEME_WALLPAPERS = 6;

export const WALLPAPER_THEMES: WallpaperTheme[] = [
  {
    slug: "aesthetic",
    name: "Aesthetic",
    title: "Aesthetic iPhone Duo Wallpapers — Free HD Downloads",
    description:
      "Aesthetic iPhone Duo wallpapers: soft colour, moody light and calm compositions, each with a fit check for the outer and inner displays. Free, no sign-up.",
    match: /\baesthetic\b/,
    heading: "What makes a wallpaper feel aesthetic on two screens.",
    paragraphs: [
      "Aesthetic is less about the subject than about restraint: a limited palette, one source of light and space around whatever you look at first. That restraint matters more on iPhone Duo, because the same picture has to hold together as a tall cover image and as a wide scene once the phone opens.",
      "Pick a colour you are happy to see all day, then check the crops rather than the thumbnail. A soft gradient behind the subject usually survives both shapes, while a tightly framed picture can lose its balance on the inner display. Each page here previews both screens before you save.",
    ],
    guide: { href: "/blog/home-screen-wallpaper-readable-icons", label: "Keep app labels readable on a busy background" },
  },
  {
    slug: "sunset",
    name: "Sunset & Golden Hour",
    title: "Sunset & Golden Hour iPhone Duo Wallpapers — Free HD",
    description:
      "Sunset and golden hour wallpapers for iPhone Duo: warm skies, long shadows and glowing horizons, previewed on the outer and inner displays. Free downloads.",
    match: /\b(sunset|sunrise|golden hour)\b/,
    heading: "Warm light, and where to keep the sun.",
    paragraphs: [
      "These are the most downloaded wallpapers per design in the library, and the reason is easy to see: warm light looks rich on an OLED panel, and a dark foreground gives app icons something quiet to sit on.",
      "The one thing to watch is the sun itself. It is the brightest point in the picture, so if it lands behind the clock the digits wash out. On the inner display, also check that the fold does not run through the sun or a lone tree. The fit check on each page shows both before you download.",
    ],
    guide: { href: "/wallpaper-readability", label: "Test whether the clock stays readable over a bright sky" },
  },
  {
    slug: "desert",
    name: "Desert & Dunes",
    title: "Desert & Dunes iPhone Duo Wallpapers — Free HD",
    description:
      "Desert and sand dune wallpapers for iPhone Duo, from golden sunrise ridges to midnight blue dunes. Original artwork in the spirit of the phone's launch look.",
    match: /\b(desert|dunes?)\b/,
    heading: "Dunes suit a foldable better than most subjects.",
    paragraphs: [
      "Apple chose desert dunes for iPhone Duo's own wallpaper, and the subject suits the hardware: long diagonal ridges read clearly in a tall crop and open into a sweeping scene on the wide inner screen, with no single detail for the fold to cut through.",
      "These are original designs, not Apple's file, which is copyrighted and comes preinstalled on the phone. If you want the look with a different mood, try the dark dunes for the Lock Screen and a golden one for the Home Screen. Our guide explains the official wallpaper's versions and sizes.",
    ],
    guide: { href: "/blog/official-iphone-duo-wallpaper", label: "About the official iPhone Duo wallpaper" },
  },
  {
    slug: "mountain",
    name: "Mountain",
    title: "Mountain iPhone Duo Wallpapers — Misty Peaks, Free HD",
    description:
      "Mountain wallpapers for iPhone Duo: misty ridges, snowy peaks and quiet valleys, with outer and inner display previews and the real file size on every page.",
    match: /\bmountains?\b/,
    heading: "Give the peak room above it.",
    paragraphs: [
      "A mountain gives you what a Lock Screen needs: open sky at the top for the clock and solid shape lower down. Layers of mist also add depth without adding the fine detail that competes with small app labels.",
      "On the outer display a wide range gets cut down to its centre, so choose a picture whose main summit sits near the middle. On the inner display, look at where the fold falls: a ridge line crossing it is fine, while a single sharp peak directly on it can look bent when the screen is not fully flat.",
    ],
    guide: { href: "/wallpaper-help", label: "Check how an image fits each screen" },
  },
  {
    slug: "neon",
    name: "Neon & Cyberpunk",
    title: "Neon & Cyberpunk iPhone Duo Wallpapers — Free HD",
    description:
      "Neon and cyberpunk wallpapers for iPhone Duo: glowing cities, electric colour and light trails on deep black, previewed on both displays. Free, no sign-up.",
    match: /\b(neon|cyberpunk|synthwave)\b/,
    heading: "Neon needs black around it.",
    paragraphs: [
      "Neon looks its best on an OLED screen because the pixels around the glow switch off completely, so the colour seems to float. That also makes these designs easy on the eye at night, as long as the brightest line is not sitting behind your clock.",
      "Thin glowing lines can vanish at small sizes, so judge the picture on the outer display preview rather than the inner one. If a design is too busy behind your apps, keep it for the Lock Screen and use something calmer for the Home Screen.",
    ],
    guide: { href: "/blog/amoled-wallpapers-iphone-battery", label: "Do true-black wallpapers save battery?" },
  },
  {
    slug: "space",
    name: "Space & Moon",
    title: "Space & Moon iPhone Duo Wallpapers — Free HD",
    description:
      "Space and moon wallpapers for iPhone Duo: planets, cosmic orbits and moonlit skies on deep black backgrounds, with previews of the outer and inner displays.",
    match: /\b(space|galaxy|planets?|nebula|cosmic|moon|moonlit)\b/,
    exclude: /\b(halloween|pumpkin)\b/,
    heading: "A dark sky leaves room for everything else.",
    paragraphs: [
      "Space is one of the easiest subjects to live with: most of the picture is near-black, so the clock, widgets and app labels all stand out. A single moon or planet gives the screen a focal point without crowding it.",
      "Decide where that focal point should sit before you download. Low on the outer display it clears the clock, and on the inner display it works best to one side of the fold. Star fields can show banding if they are saved again at a lower quality, so keep the original file.",
    ],
    guide: { href: "/blog/why-is-my-iphone-wallpaper-blurry", label: "Why a wallpaper can look blurry or banded" },
  },
  {
    // Waiting for artwork: tag or title new uploads "christmas" and the page publishes itself at six.
    // Snowy mountains don't count, or the page would promise Christmas and show none.
    slug: "christmas",
    name: "Christmas",
    title: "Christmas iPhone Duo Wallpapers — Free HD Downloads",
    description:
      "Christmas wallpapers for iPhone Duo: festive lights, trees and snowy nights, each previewed on the outer and inner displays. Free downloads, no sign-up.",
    match: /\b(christmas|xmas|santa)\b/,
    heading: "Keep the lights away from the clock.",
    paragraphs: [
      "Fairy lights and bright snow are the two things most likely to fight with white clock digits. A night scene with its lights lower in the frame keeps the festive feel and leaves the top of the screen readable.",
      "For the Home Screen, try a plainer picture and save the detailed scene for the Lock Screen. Preview both crops first, because a tree or a doorway centred on the wide inner display may fall exactly on the fold.",
    ],
    guide: { href: "/wallpaper-readability", label: "Test the clock against your background" },
  },
];

export function themeBySlug(slug: string): WallpaperTheme | undefined {
  return WALLPAPER_THEMES.find((theme) => theme.slug === slug);
}

export function matchesTheme(theme: WallpaperTheme, title: string, tags: string[]): boolean {
  const text = [title, ...tags].join(" ").toLowerCase();
  return theme.match.test(text) && !theme.exclude?.test(text);
}

/** Where a tag leads, first match wins. Pages that aren't stocked are skipped, so a tag never links to a 404. */
const TAG_PAGES: { pattern: RegExp; slug: string }[] = [
  { pattern: /halloween|pumpkin|spooky/, slug: "halloween-wallpaper" },
  { pattern: /anime/, slug: "anime" },
  { pattern: /\b(car|cars|automotive)\b/, slug: "car" },
  { pattern: /neon|cyberpunk|synthwave/, slug: "neon" },
  { pattern: /sunset|sunrise|golden hour/, slug: "sunset" },
  { pattern: /desert|dunes?/, slug: "desert" },
  { pattern: /mountain/, slug: "mountain" },
  { pattern: /space|galaxy|planet|cosmic|moon/, slug: "space" },
  { pattern: /christmas|xmas|santa/, slug: "christmas" },
  { pattern: /\b(a?moled|oled|dark|black)\b/, slug: "dark" },
  { pattern: /aesthetic/, slug: "aesthetic" },
  { pattern: /minimal/, slug: "minimal" },
  { pattern: /nature|landscape/, slug: "landscape" },
  { pattern: /\b(abstract|gradient|geometric|ios)\b/, slug: "ios-inspired-wallpapers" },
];

/**
 * Tag links used to open the search page, which is noindex: Google crawled 100+ of those URLs and
 * dropped them all. A tag with a page of its own now links there, and one that only names the phone
 * links to the library. The rest still search, marked nofollow, so visitors keep the shortcut.
 */
export function tagLink(tag: string, stockedSlugs: ReadonlySet<string>): { href: string; rel?: string } {
  const text = tag.toLowerCase();
  const page = TAG_PAGES.find((item) => item.pattern.test(text) && stockedSlugs.has(item.slug));
  if (page) return { href: `/categories/${page.slug}` };
  if (/^(iphone|dual|duo|foldable|phone|wallpaper)/.test(text)) return { href: "/wallpapers" };
  return { href: `/search?q=${encodeURIComponent(tag)}`, rel: "nofollow" };
}
