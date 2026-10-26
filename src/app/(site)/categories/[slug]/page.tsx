import { ResourceLinks } from "@/components/site/resource-links";
import { READABILITY_HELP, FIT_HELP } from "@/lib/guide-links";
import { CATEGORY_ADVICE } from "@/lib/category-advice";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { getCategories, getCategoryBySlug, getDarkCategory } from "@/lib/data/taxonomy";
import { languageAlternates } from "@/lib/i18n";
import { listingJsonLd } from "@/lib/listing-jsonld";
import { buildMetadata, listingPage } from "@/lib/seo";
import { categoryGuide } from "@/lib/site";
import { imageUrl, stockedFirst } from "@/lib/utils";

// Renders on the server before responding so unknown slugs return a real 404 status (better for SEO).

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.length ? categories.map((category) => ({ slug: category.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params, searchParams }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found", robots: { index: false, follow: true } };

  return buildMetadata({
    page: await listingPage(searchParams),
    title: category.seo_title || `${category.name} Wallpapers for iPhone Duo — Free HD Downloads`,
    description:
      category.seo_description ||
      category.description ||
      `Download free ${category.name.toLowerCase()} wallpapers in full resolution for iPhone Duo and iPhone 18 Pro.`,
    path: `/categories/${category.slug}`,
    languages: languageAlternates(`/categories/${category.slug}`),
    image: category.cover_thumb_key ? { url: imageUrl(category.cover_thumb_key), alt: category.name } : null,
    // An empty listing is thin content; it becomes indexable with its first wallpaper.
    noIndex: category.wallpaper_count === 0,
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const [category, categories, dark] = await Promise.all([getCategoryBySlug(slug), getCategories(), getDarkCategory()]);
  if (!category) notFound();

  // Lateral links are only worth following when there is something on the other end.
  const others = stockedFirst([dark, ...categories.filter((item) => item.id !== category.id)]).slice(0, 8);
  const guide = categoryGuide(category.slug);
  const advice = CATEGORY_ADVICE[category.slug];
  const path = `/categories/${category.slug}`;
  const jsonLd = await listingJsonLd({
    name: `${category.name} Wallpapers`,
    description: category.description ?? `${category.name} wallpapers for iPhone Duo.`,
    path,
    breadcrumb: [
      { name: "Categories", path: "/categories" },
      { name: category.name, path },
    ],
    query: { categoryId: category.id },
  });

  return (
    <>
      <JsonLd data={jsonLd} />
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
        {guide ? (
          <p className="mt-4 text-[17px]">
            <Link href={guide.href} className="link-apple">
              Guide: {guide.label}
              <ChevronRight className="ml-0.5 inline size-4 align-[-3px]" />
            </Link>
          </p>
        ) : null}
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
      {advice ? (
        <section className="container-apple mt-16">
          <div className="prose-apple max-w-3xl">
            <h2>{advice.title}</h2>
            {advice.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p>Use the <Link href="/maker">wallpaper maker</Link> to reposition the crop from your own image. Then use the checks below to compare fit and text contrast before applying it.</p>
          </div>
        </section>
      ) : null}
      <div className="container-apple"><ResourceLinks title="Check a design before you use it" links={[READABILITY_HELP, FIT_HELP]} /></div>
    </>
  );
}
