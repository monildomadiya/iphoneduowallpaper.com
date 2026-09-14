/* eslint-disable @next/next/no-img-element -- cover images are pre-optimized files served from Cloudflare R2 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Markdown } from "@/components/site/markdown";
import { PostCard } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { getPostBySlug, getPrerenderPostSlugs, listPosts } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { formatDate, imageUrl, readingMinutes, stripMarkdown, truncate } from "@/lib/utils";

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
    image: post.cover_key ? { url: imageUrl(post.cover_key), alt: post.title } : null,
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [settings, recent] = await Promise.all([getSiteSettings(), listPosts(1, 4)]);
  const more = recent.items.filter((item) => item.id !== post.id).slice(0, 3);

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
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-[21px] leading-8 text-fg-2">{post.excerpt}</p>
          ) : null}
          <p className="mt-6 text-[14px] text-fg-3">
            By {post.author_name} · <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time> ·{" "}
            {readingMinutes(post.content)} min read
          </p>
        </header>

        {post.cover_key ? (
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[32px] bg-surface">
            <img src={imageUrl(post.cover_key)} alt="" className="aspect-[16/9] w-full object-cover" fetchPriority="high" />
          </div>
        ) : null}

        <div className="mx-auto mt-10 max-w-3xl">
          <AdSlot placement="post_top" className="mb-10" />
          <Markdown content={post.content} />
          <p className="mt-12 border-t border-line pt-6 text-[14px] text-fg-3">
            Last updated {formatDate(post.updated_at)}. Spotted something out of date?{" "}
            <Link href="/contact" className="link-apple">
              Let us know
            </Link>
            .
          </p>
          <AdSlot placement="post_bottom" className="mt-12" />
        </div>
      </article>

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
