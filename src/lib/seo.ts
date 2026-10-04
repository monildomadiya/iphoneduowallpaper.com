import "server-only";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";
import type { Post, SiteSettings, WallpaperDetail } from "@/lib/types";
import { absoluteUrl, imageUrl, stripMarkdown, truncate } from "@/lib/utils";
import { wallpaperOverview } from "@/lib/wallpaper-copy";

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  /** `false`: the route segment has its own opengraph-image file, so leave og:image to Next. */
  image?: { url: string; width?: number; height?: number; alt?: string } | null | false;
  type?: "website" | "article";
  noIndex?: boolean;
  absoluteTitle?: boolean;
  publishedTime?: string | null;
  modifiedTime?: string | null;
}

export async function buildMetadata(input: MetadataInput): Promise<Metadata> {
  const settings = await getSiteSettings();
  const url = absoluteUrl(input.path);
  // Google cuts snippets at roughly 160 characters; anything past that never shows.
  const description = truncate(input.description, MAX_DESCRIPTION);
  // The "| Site Name" suffix pushed most titles past what Google shows (~60 characters) and cut
  // the page's own words off instead. When there is no room for it, the title stands alone.
  const suffix = ` | ${settings.site_name}`;
  const absoluteTitle =
    input.absoluteTitle || input.title.includes(settings.site_name) || input.title.length + suffix.length > MAX_TITLE;
  // Setting openGraph here replaces the inherited one wholesale, image included, so a page without
  // its own picture used to be shared with no preview at all. The site card is the fallback.
  const image =
    input.image === false
      ? null
      : (input.image ?? { url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: settings.site_name });
  const images = image
    ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt ?? input.title }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: input.title } : input.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      url,
      title: input.title,
      description,
      siteName: settings.site_name,
      locale: "en_US",
      ...(images ? { images } : {}),
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime ?? undefined,
            modifiedTime: input.modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      ...(images ? { images: images.map((item) => item.url) } : {}),
    },
    ...(input.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

type JsonLd = Record<string, unknown>;

// Stable ids let every page point back at one WebSite and one Organization, so Google reads the
// site as a single entity with a single name — what it groups sitelinks and the site name under.
const WEBSITE_ID = `${siteUrl}/#website`;
const ORGANIZATION_ID = `${siteUrl}/#organization`;

// Names people may search the brand by; Google falls back to these when choosing the site name.
const SITE_ALTERNATE_NAMES = ["Duo Wallpapers", "iphoneduowallpaper.com"];

export function organizationJsonLd(settings: SiteSettings): JsonLd {
  const sameAs = Object.values(settings.social_links ?? {}).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: settings.site_name,
    alternateName: SITE_ALTERNATE_NAMES,
    url: siteUrl,
    description: settings.tagline,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteUrl}/#logo`,
      url: absoluteUrl("/apple-icon"),
      width: 180,
      height: 180,
      caption: settings.site_name,
    },
    email: settings.contact_email,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(settings: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: settings.site_name,
    alternateName: SITE_ALTERNATE_NAMES,
    url: siteUrl,
    description: settings.tagline,
    inLanguage: "en-US",
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function wallpaperJsonLd(wallpaper: WallpaperDetail, settings: SiteSettings): JsonLd {
  const credit = wallpaper.credit_name || settings.site_name;
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: wallpaper.title,
    description: wallpaper.description || wallpaperOverview(wallpaper)[0],
    contentUrl: imageUrl(wallpaper.original_key),
    thumbnailUrl: imageUrl(wallpaper.thumb_key),
    url: absoluteUrl(`/wallpapers/${wallpaper.slug}`),
    width: { "@type": "QuantitativeValue", value: wallpaper.width, unitCode: "E37" },
    height: { "@type": "QuantitativeValue", value: wallpaper.height, unitCode: "E37" },
    encodingFormat: wallpaper.mime_type,
    uploadDate: wallpaper.published_at ?? wallpaper.created_at,
    keywords: wallpaper.tags.join(", ") || undefined,
    creditText: credit,
    creator: { "@type": "Organization", name: credit },
    copyrightNotice: credit,
    license: absoluteUrl("/terms"),
    acquireLicensePage: absoluteUrl("/terms"),
  };
}

export function articleJsonLd(post: Post, settings: SiteSettings): JsonLd {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const text = stripMarkdown(post.content);
  // "Editorial Team" alone names nobody; tie the byline to the site and to the page that says who we are.
  const authorName =
    !post.author_name || post.author_name === "Editorial Team"
      ? `${settings.site_name} Editorial Team`
      : post.author_name;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt ?? truncate(text, 200),
    // Article rich results want an image. The guide's own card lives at a URL with a build hash in it,
    // so posts without a cover point at the site card, which has a stable address.
    image: [post.cover_key ? imageUrl(post.cover_key) : absoluteUrl("/opengraph-image")],
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    inLanguage: "en-US",
    wordCount: text.split(/\s+/).filter(Boolean).length,
    articleSection: "Guides",
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    author: {
      "@type": /\b(team|staff|editors?)\b/i.test(authorName) ? "Organization" : "Person",
      name: authorName,
      url: absoluteUrl("/about#editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: settings.site_name,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: absoluteUrl("/apple-icon"), width: 180, height: 180 },
    },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * A listing page (a hub or a taxonomy page), tied to the WebSite entity and carrying its own
 * breadcrumb, so Google sees where it sits in the site — the structure it picks sitelinks from.
 */
export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  breadcrumb: { name: string; path: string }[];
  items?: { name: string; path: string }[];
}): JsonLd {
  const items = input.items ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(input.path)}#webpage`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: breadcrumbJsonLd([{ name: "Home", path: "/" }, ...input.breadcrumb]),
    ...(items.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: items.length,
            itemListElement: items.slice(0, 30).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(item.path),
              name: item.name,
            })),
          },
        }
      : {}),
  };
}
