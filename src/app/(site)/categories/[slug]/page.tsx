import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { getCategories, getCategoryBySlug } from "@/lib/data/taxonomy";
import { buildMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/utils";

// Renders on the server before responding so unknown slugs return a real 404 status (better for SEO).
export const instant = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.length ? categories.map((category) => ({ slug: category.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found", robots: { index: false, follow: true } };

  return buildMetadata({
    title: category.seo_title || `${category.name} Wallpapers for iPhone Duo — Free 4K & HD`,
    description:
      category.seo_description ||
      category.description ||
      `Download free ${category.name.toLowerCase()} wallpapers in full resolution for iPhone Duo and iPhone 18 Pro.`,
    path: `/categories/${category.slug}`,
    image: category.cover_thumb_key ? { url: imageUrl(category.cover_thumb_key), alt: category.name } : null,
    // An empty listing is thin content; it becomes indexable with its first wallpaper.
    noIndex: category.wallpaper_count === 0,
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getCategories()]);
  if (!category) notFound();

  const others = categories.filter((item) => item.id !== category.id).slice(0, 8);

  return (
    <>
      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: "Categories", path: "/categories" },
            { name: category.name, path: `/categories/${category.slug}` },
          ]}
        />
      </div>
      <PageHeader
        eyebrow="Category"
        title={`${category.name} Wallpapers`}
        description={category.description}
        className="pt-6 md:pt-10"
      >
        {others.length ? (
          <nav aria-label="Other categories" className="no-scrollbar -mx-1 mt-7 flex gap-2 overflow-x-auto px-1 pb-1">
            {others.map((item) => (
              <Link
                key={item.id}
                href={`/categories/${item.slug}`}
                className="shrink-0 rounded-full bg-surface px-4 py-2 text-[14px] font-medium text-fg-2 transition hover:bg-surface-hover hover:text-fg"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </PageHeader>
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing
          basePath={`/categories/${category.slug}`}
          searchParams={searchParams}
          categoryId={category.id}
          emptyTitle={`No ${category.name.toLowerCase()} wallpapers yet`}
        />
      </section>
    </>
  );
}
