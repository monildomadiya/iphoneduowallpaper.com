import type { Metadata } from "next";
import { Suspense } from "react";
import { PostCard } from "@/components/site/tiles";
import { EmptyState, JsonLd, PageHeader, Pagination } from "@/components/ui/primitives";
import { listPosts } from "@/lib/data/posts";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { clampPage } from "@/lib/utils";

const TITLE = "Guides & Tips for iPhone Wallpapers";
const DESCRIPTION =
  "Practical guides for iPhone Duo and iPhone 18 Pro: wallpaper sizes for the inner and outer displays, how to set a wallpaper, depth effect tips and more.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/blog",
  });
}

async function PostList({ searchParams }: { searchParams: PageProps<"/blog">["searchParams"] }) {
  const raw = (await searchParams).page;
  const page = clampPage(Array.isArray(raw) ? raw[0] : raw);
  const posts = await listPosts(page, 12);

  if (!posts.items.length) {
    return <EmptyState title="No guides yet" description="Our first articles are being written. Check back soon." />;
  }

  return (
    <>
      {/* Lives with the list so the structured data names the guides on this page, not just the hub. */}
      <JsonLd
        data={collectionPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/blog",
          breadcrumb: [{ name: "Guides", path: "/blog" }],
          items: posts.items.map((post) => ({ name: post.title, path: `/blog/${post.slug}` })),
        })}
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.items.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <Pagination basePath="/blog" page={page} totalPages={posts.totalPages} />
    </>
  );
}

export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <>
      <PageHeader
        eyebrow="Guides"
        title="Tips, tricks and the details that matter."
        description="Everything you need to make your iPhone Duo look its best — from exact screen sizes to Lock Screen customization."
      />
      <section className="container-apple">
        <Suspense
          fallback={
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <li key={index} className="skeleton aspect-[4/5] rounded-[28px]" />
              ))}
            </ul>
          }
        >
          <PostList searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
