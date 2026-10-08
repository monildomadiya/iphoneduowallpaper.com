import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Markdown } from "@/components/site/markdown";
import { PostCard } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { getSiteSettings } from "@/lib/data/settings";
import { getCategoryBySlug } from "@/lib/data/taxonomy";
import { listWallpapers } from "@/lib/data/wallpapers";
import { FOREIGN_LOCALES, guideCard, isForeignLocale, languageAlternates, localeContent, localizedPath } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { buildMetadata, localizedArticleJsonLd } from "@/lib/seo";
import { formatDate, readingMinutes, slugify } from "@/lib/utils";

export const instant = false;

export function generateStaticParams() {
  return FOREIGN_LOCALES.flatMap((lang) => localeContent(lang).guides.map((guide) => ({ lang, slug: guide.slug })));
}

function findGuide(lang: string, slug: string) {
  if (!isForeignLocale(lang)) return null;
  const content = localeContent(lang);
  const guide = content.guides.find((item) => item.slug === slug);
  return guide ? { content, guide, lang } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = findGuide(lang, slug);
  if (!found) return { title: "Not found", robots: { index: false, follow: true } };
  const { guide, content } = found;
  return buildMetadata({
    title: guide.seoTitle,
    description: guide.description,
    path: localizedPath(found.lang, `/blog/${guide.slug}`),
    type: "article",
    publishedTime: guide.published,
    modifiedTime: guide.published,
    languages: languageAlternates(`/blog/${guide.slug}`),
    locale: content.ogLocale,
  });
}

/** Same ids as the Markdown renderer gives the H2s. */
function tableOfContents(markdown: string) {
  return [...markdown.matchAll(/^##\s+(.+?)\s*#*\s*$/gm)].map(([, heading]) => {
    const text = heading.replace(/\[([^\]]+)]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
    return { id: slugify(text), text };
  });
}

export default async function LocalizedGuidePage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  const found = findGuide(lang, slug);
  if (!found) notFound();
  const { guide, content } = found;
  const { blog, chrome } = content;
  const path = localizedPath(found.lang, `/blog/${guide.slug}`);
  const englishPath = `/blog/${guide.slug}`;

  // The official wallpaper guide is the Landscape category's guide, so it shows landscapes.
  const [settings, landscape] = await Promise.all([getSiteSettings(), getCategoryBySlug("landscape")]);
  const wallpapers = await listWallpapers({
    categoryId: guide.slug === "official-iphone-duo-wallpaper" ? landscape?.id : undefined,
    perPage: 5,
  });
  const toc = tableOfContents(guide.content);
  const others = content.guides.filter((item) => item.slug !== guide.slug);
  const author = fill(blog.team, { site: settings.site_name });

  return (
    <>
      <JsonLd
        data={localizedArticleJsonLd({
          headline: guide.title,
          description: guide.description,
          path,
          englishPath,
          inLanguage: found.lang,
          published: guide.published,
          content: guide.content,
          authorName: author,
        })}
      />
      <article className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: blog.breadcrumb, path: `/${found.lang}/blog` },
            { name: guide.title, path },
          ]}
          home={{ name: chrome.homeLabel, path: chrome.homeHref }}
        />
        <header className="mx-auto max-w-3xl pt-10 text-center md:pt-14">
          <p className="text-[15px] font-semibold text-fg-2">{guide.tags.join(" · ")}</p>
          <h1 className="headline-page mt-3 text-balance">{guide.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[18px] leading-7 text-fg-2 md:text-[21px] md:leading-8">
            {guide.excerpt}
          </p>
          <p className="mt-6 text-[14px] text-fg-3">
            {blog.by}{" "}
            <Link href="/about#editorial-team" rel="author" className="hover:text-fg hover:underline">
              {author}
            </Link>{" "}
            · <time dateTime={guide.published}>{formatDate(guide.published, undefined, found.lang)}</time> ·{" "}
            {fill(blog.minRead, { n: readingMinutes(guide.content) })} ·{" "}
            <Link href={englishPath} hrefLang="en" lang="en" className="link-apple">
              {blog.english}
            </Link>
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl">
          <AdSlot placement="post_top" className="mb-10" />
          {toc.length >= 4 ? (
            <nav aria-labelledby="toc-heading" className="mb-10 rounded-[24px] bg-surface p-5 md:p-6">
              <h2 id="toc-heading" className="text-[15px] font-semibold text-fg">
                {blog.toc}
              </h2>
              <ol className="mt-3 space-y-2 text-[15px] leading-6">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-fg-2 hover:text-link hover:underline">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <Markdown content={guide.content} />
          <AdSlot placement="post_bottom" className="mt-12" />
        </div>
      </article>

      {wallpapers.items.length ? (
        <section className="container-apple mt-24">
          <SectionHeading
            title={blog.wallpapers[0]}
            subtitle={blog.wallpapers[1]}
            href={guide.slug === "official-iphone-duo-wallpaper" && landscape ? `/${found.lang}/categories/landscape` : `/${found.lang}/wallpapers`}
          />
          <WallpaperGrid wallpapers={wallpapers.items} locale={found.lang} />
        </section>
      ) : null}

      {others.length ? (
        <section className="container-apple mt-24">
          <SectionHeading title={blog.more[0]} subtitle={blog.more[1]} href={`/${found.lang}/blog`} />
          <ul className="grid gap-5 md:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <PostCard post={guideCard(item)} href={localizedPath(found.lang, `/blog/${item.slug}`)} locale={found.lang} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
