/* eslint-disable @next/next/no-img-element -- cover images are pre-optimized files served from Cloudflare R2 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Markdown } from "@/components/site/markdown";
import { PostCard } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { getPostBySlug, getPrerenderPostSlugs, getRelatedPosts } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";
import { getCategories } from "@/lib/data/taxonomy";
import { listWallpapers } from "@/lib/data/wallpapers";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { categoryGuide } from "@/lib/site";
import { formatDate, imageUrl, readingMinutes, slugify, stripMarkdown, truncate } from "@/lib/utils";

// Renders on the server before responding so unknown slugs return a real 404 status (better for SEO).
export const instant = false;

export async function generateStaticParams() {
  const slugs = await getPrerenderPostSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: true } };

  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || truncate(stripMarkdown(post.content), 155),
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    // Without a cover, ./opengraph-image draws the card. Its URL carries a hash Next adds inside
    // the (site) group, so Next has to fill it in rather than this hard-coding a path.
    image: post.cover_key ? { url: imageUrl(post.cover_key), alt: post.title } : false,
  });
}

/** The article's H2s, with the same ids the Markdown renderer gives them. */
function tableOfContents(markdown: string) {
  return [...markdown.matchAll(/^##\s+(.+?)\s*#*\s*$/gm)].map(([, heading]) => {
    const text = heading.replace(/\[([^\]]+)]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
    return { id: slugify(text), text };
  });
}

/** Wallpapers from the category this guide is about, or the newest ones when it isn't about one. */
async function wallpapersFor(postSlug: string) {
  const categories = await getCategories();
  const category = categories.find((item) => categoryGuide(item.slug)?.href === `/blog/${postSlug}`) ?? null;
  const { items } = await listWallpapers({ categoryId: category?.id, perPage: 5 });
  return { category, items };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [settings, more, wallpapers] = await Promise.all([
    getSiteSettings(),
    getRelatedPosts(post, 3),
    wallpapersFor(post.slug),
  ]);
  const toc = tableOfContents(post.content);

  return (
    <>
      <JsonLd data={articleJsonLd(post, settings)} />
      <article className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: "Guides", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />
        <header className="mx-auto max-w-3xl pt-10 text-center md:pt-14">
          {post.tags.length ? (
            <p className="text-[15px] font-semibold text-fg-2">{post.tags.slice(0, 2).join(" · ")}</p>
          ) : null}
          <h1 className="headline-page mt-3 text-balance">{post.title}</h1>
          {post.excerpt ? (
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-[18px] leading-7 text-fg-2 md:text-[21px] md:leading-8">{post.excerpt}</p>
          ) : null}
          <p className="mt-6 text-[14px] text-fg-3">
            By{" "}
            <Link href="/about#editorial-team" rel="author" className="hover:text-fg hover:underline">
              {post.author_name}
            </Link>{" "}
            · <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time> ·{" "}
            {readingMinutes(post.content)} min read
          </p>
        </header>

        {post.cover_key ? (
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[20px] bg-surface md:rounded-[32px]">
            <img src={imageUrl(post.cover_key)} alt="" className="aspect-[16/9] w-full object-cover" fetchPriority="high" />
          </div>
        ) : null}

        <div className="mx-auto mt-10 max-w-3xl">
          <AdSlot placement="post_top" className="mb-10" />
          {toc.length >= 4 ? (
            <nav aria-labelledby="toc-heading" className="mb-10 rounded-[24px] bg-surface p-5 md:p-6">
              <h2 id="toc-heading" className="text-[15px] font-semibold text-fg">
                In this guide
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
          <Markdown content={post.content} />
          <p className="mt-12 border-t border-line pt-6 text-[14px] text-fg-3">
            Last updated {formatDate(post.updated_at)}. Written and checked by the {settings.site_name}{" "}
            <Link href="/about#editorial-team" className="link-apple">
              editorial team
            </Link>
            . Spotted something out of date?{" "}
            <Link href="/contact" className="link-apple">
              Let us know
            </Link>
            .
          </p>
          <AdSlot placement="post_bottom" className="mt-12" />
        </div>
      </article>

      {wallpapers.items.length ? (
        <section className="container-apple mt-24">
          <SectionHeading
            title="Wallpapers to try."
            subtitle={wallpapers.category ? `From our ${wallpapers.category.name} category.` : "Fresh from the library."}
            href={wallpapers.category ? `/categories/${wallpapers.category.slug}` : "/wallpapers"}
          />
          <WallpaperGrid wallpapers={wallpapers.items} />
        </section>
      ) : null}

      {more.length ? (
        <section className="container-apple mt-24">
          <SectionHeading title="Keep reading." subtitle="More guides for your iPhone." href="/blog" />
          <ul className="grid gap-5 md:grid-cols-3">
            {more.map((item) => (
              <li key={item.id}>
                <PostCard post={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
