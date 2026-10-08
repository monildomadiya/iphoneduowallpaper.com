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
  /** Where the header's search box sends a query. */
  searchPath: string;
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

/** Everything a wallpaper page says around the picture. Placeholders: `{n}`, `{p}`, `{x}`, `{title}`, `{color}`, `{category}`, `{name}`. */
export interface WallpaperStrings {
  /** Appended to the title in the <title> tag when it fits; `shortSuffix` when only that fits. */
  suffix: string;
  shortSuffix: string;
  kicker: string;
  breadcrumb: string;
  download: string;
  viewFull: string;
  share: string;
  copied: string;
  copyFailed: string;
  downloadsOne: string;
  downloadsMany: string;
  saveTip: string;
  saveTipLink: string;
  maker: string;
  about: string;
  fit: string;
  details: string;
  labels: { resolution: string; orientation: string; file: string; published: string; downloads: string; source: string; credit: string };
  orientation: { portrait: string; landscape: string; square: string };
  source: { original: string; ai: string; licensed: string; public_domain: string };
  levels: { sharp: string; good: string; low: string; crop: string };
  fitNothing: string;
  fitTrimmed: string;
  fitSides: string;
  fitTopBottom: string;
  fitEnlarged: string;
  percent: string;
  lessThanOne: string;
  intro: string;
  introCategory: string;
  dark: string;
  light: string;
  colors: Record<string, string>;
  deep: string;
  pale: string;
  /** "{color}" plus "deep"/"pale" in the language's word order. */
  shade: string;
  howTo: string;
  steps: string[];
  guide: string;
  free: string;
  terms: string;
  report: string;
  more: string;
  moreCategory: string;
  moreOther: string;
  featured: string;
  fallbackCategory: string;
  preview: { device: string; screen: string; lock: string; home: string; clean: string; outer: string; inner: string };
  categories: Record<string, string>;
  devices: Record<string, string>;
}

/** The sortable grid on listing pages. */
export interface ListingStrings {
  countOne: string;
  countMany: string;
  page: string;
  latest: string;
  popular: string;
  sortLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  endTitle: string;
  endDescription: string;
  back: string;
  browseAll: string;
  previous: string;
  next: string;
  pagination: string;
}

export interface HubStrings {
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
}

export interface CategoryCopy {
  name: string;
  h1: string;
  title: string;
  description: string;
  guide?: LinkItem;
}

export interface DeviceCopy {
  name: string;
  /** The device as the subject of a sentence ("la pantalla exterior del iPhone Duo"). */
  faqName: string;
  h1: string;
  title: string;
  description: string;
}

export interface TaxonomyStrings {
  wallpapersHub: HubStrings;
  categoriesHub: HubStrings;
  devicesHub: HubStrings & { caption: string; columns: [string, string, string, string]; more: string };
  categoryEyebrow: string;
  categories: Record<string, CategoryCopy>;
  darkWhyTitle: string;
  /** Markdown. */
  darkWhy: string;
  deviceSeoDescription: string;
  specs: { display: string; resolution: string; ratio: string; density: string; orientation: string; inch: string };
  sizesTitle: string;
  sizesSubtitle: string;
  devices: Record<string, DeviceCopy>;
  faq: {
    sizeQ: string;
    sizeA: string;
    fitQ: string;
    fitInner: string;
    fitDuoOuter: string;
    fitNormal: string;
    setQ: string;
    setA: string;
  };
}

export interface SearchStrings {
  title: string;
  description: string;
  h1: string;
  placeholder: string;
  label: string;
  popular: string;
  resultsOne: string;
  resultsMany: string;
  emptyTitle: string;
  emptyDescription: string;
  browse: string;
  /** Words too common to narrow a search ("fondo", "duvar kağıdı"), dropped before matching. */
  stopWords: string[];
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
  wallpaper: WallpaperStrings;
  listing: ListingStrings;
  taxonomy: TaxonomyStrings;
  search: SearchStrings;
}
