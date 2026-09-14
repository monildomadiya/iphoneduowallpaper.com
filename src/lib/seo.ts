import "server-only";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";
import type { Post, SiteSettings, WallpaperDetail } from "@/lib/types";
import { absoluteUrl, imageUrl, stripMarkdown, truncate } from "@/lib/utils";

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  type?: "website" | "article";
  noIndex?: boolean;
  absoluteTitle?: boolean;
  publishedTime?: string | null;
  modifiedTime?: string | null;
}

export async function buildMetadata(input: MetadataInput): Promise<Metadata> {
  const settings = await getSiteSettings();
  const url = absoluteUrl(input.path);
  const description = truncate(input.description, 300);
  const images = input.image
    ? [
        {
          url: input.image.url,
          width: input.image.width,
          height: input.image.height,
          alt: input.image.alt ?? input.title,
        },
      ]
    : undefined;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
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
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
    ...(input.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(settings: SiteSettings): JsonLd {
  const sameAs = Object.values(settings.social_links ?? {}).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: siteUrl,
    logo: absoluteUrl("/apple-icon"),
    email: settings.contact_email,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(settings: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name,
    url: siteUrl,
    description: settings.tagline,
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
    description: wallpaper.description ?? undefined,
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
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? truncate(stripMarkdown(post.content), 200),
    image: post.cover_key ? [imageUrl(post.cover_key)] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author_name || settings.site_name },
    publisher: {
      "@type": "Organization",
      name: settings.site_name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/apple-icon") },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
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

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  items: { title: string; slug: string }[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.slice(0, 30).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/wallpapers/${item.slug}`),
        name: item.title,
      })),
    },
  };
}
