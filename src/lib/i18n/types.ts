/** The languages the site has pages in. English lives at the root; the others under /es and /tr. */
export type Locale = "en" | "es" | "tr";
export type ForeignLocale = Exclude<Locale, "en">;

export type NavIcon = "wallpapers" | "categories" | "devices" | "maker" | "guides";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

export interface LinkItem {
  href: string;
  label: string;
}

/** Everything the header says, passed to its client half as plain data. */
export interface HeaderStrings {
  skip: string;
  home: string;
  search: string;
  searchLabel: string;
  searchPlaceholder: string;
  openMenu: string;
  closeMenu: string;
  close: string;
  closeSearch: string;
  quickLinks: string;
  menuLinks: LinkItem[];
}

export interface Chrome {
  locale: Locale;
  homeHref: string;
  /** First breadcrumb. */
  homeLabel: string;
  nav: NavItem[];
  header: HeaderStrings;
  quickLinks: LinkItem[];
  footer: {
    /** `{site}` is replaced with the site name. */
    disclaimer: string;
    groups: { title: string; links: LinkItem[] }[];
    rights: string;
    languages: string;
  };
}

export interface CookieStrings {
  label: string;
  /** Text before the Cookie Policy link, between the two links, and after. */
  before: string;
  between: string;
  after: string;
  cookiePolicy: string;
  privacyPolicy: string;
  accept: string;
}

export interface Faq {
  question: string;
  answer: string;
}

/** Labels for the wallpaper maker. `{n}`, `{screen}`, `{w}`, `{h}`, `{outer}` and `{inner}` are filled in. */
export interface MakerStrings {
  outerName: string;
  outerHint: string;
  innerName: string;
  innerHint: string;
  previewLabel: string;
  formatLabel: string;
  modeLock: string;
  modeHome: string;
  modeClean: string;
  pixelPerfect: string;
  pixelPerfectNote: string;
  greatFit: string;
  slightlySoft: string;
  soft: string;
  enlarged: string;
  fixZoomOut: string;
  fixLarger: string;
  zoom: string;
  reset: string;
  dragHint: string;
  emptyHint: string;
  downloadOuter: string;
  downloadInner: string;
  choose: string;
  change: string;
  loading: string;
  dropHint: string;
  pixels: string;
  downloadBoth: string;
  preparing: string;
  exportNote: string;
  loadFailed: string;
  notImage: string;
  tooLarge: string;
  cantOpen: string;
  exportFailed: string;
}

export interface LocalGuide {
  /** The English guide's slug; the translation lives at /{locale}/blog/{slug}. */
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  tags: string[];
  content: string;
  published: string;
}

export interface LocaleContent {
  locale: ForeignLocale;
  /** Shown in the language switcher, in the language itself. */
  name: string;
  ogLocale: string;
  chrome: Chrome;
  cookies: CookieStrings;
  home: {
    title: string;
    description: string;
    badgeNew: string;
    badge: string;
    h1: string;
    h1Accent: string;
    intro: string;
    browse: string;
    explore: string;
    stats: { wallpapers: string; fullResolution: string; free: string; original: string };
    featured: [string, string];
    latest: [string, string];
    categories: [string, string];
    guides: [string, string];
    viewAll: string;
    makerTitle: string;
    makerBody: string;
    makerCta: string;
    aboutTitle: string;
    /** Markdown, so the paragraphs can link. */
    about: string;
    faqTitle: [string, string];
    faq: Faq[];
  };
  maker: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    lead: string;
    breadcrumb: string;
    stepsTitle: [string, string];
    step: string;
    steps: { title: string; body: string }[];
    whyTitle: string;
    /** Markdown. */
    why: string;
    faqTitle: [string, string];
    faq: Faq[];
    ui: MakerStrings;
  };
  blog: {
    title: string;
    description: string;
    breadcrumb: string;
    h1: string;
    lead: string;
    by: string;
    team: string;
    minRead: string;
    toc: string;
    english: string;
    more: [string, string];
    wallpapers: [string, string];
  };
  guides: LocalGuide[];
}
