import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { getCollectionBySlug, getCollections } from "@/lib/data/taxonomy";
import { buildMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/utils";

// Renders on the server before responding so unknown slugs return a real 404 status (better for SEO).
export const instant = false;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.length
    ? collections.map((collection) => ({ slug: collection.slug }))
    : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found", robots: { index: false, follow: true } };

  return buildMetadata({
    title: collection.seo_title || `${collection.name} — iPhone Duo Wallpaper Collection`,
    description:
      collection.seo_description ||
      collection.description ||
      `A curated set of ${collection.name} wallpapers for iPhone Duo and iPhone 18 Pro.`,
    path: `/collections/${collection.slug}`,
    image: collection.cover_thumb_key ? { url: imageUrl(collection.cover_thumb_key), alt: collection.name } : null,
  });
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <>
      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: "Collections", path: "/collections" },
            { name: collection.name, path: `/collections/${collection.slug}` },
          ]}
        />
      </div>
      <PageHeader
        eyebrow="Collection"
        title={collection.name}
        description={collection.description}
        className="pt-6 md:pt-10"
      />
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing
          basePath={`/collections/${collection.slug}`}
          searchParams={searchParams}
          collectionId={collection.id}
          emptyTitle="This collection is being curated"
        />
      </section>
    </>
  );
}
