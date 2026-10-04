import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";

const TITLE = "All iPhone Duo Wallpapers — Free HD Downloads";
const DESCRIPTION =
  "Every wallpaper in the library, in full resolution for iPhone Duo's inner and outer displays, iPhone 18 Pro and Pro Max. Sort by newest or most downloaded.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/wallpapers",
  });
}

export default function WallpapersPage({ searchParams }: PageProps<"/wallpapers">) {
  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/wallpapers",
          breadcrumb: [{ name: "Wallpapers", path: "/wallpapers" }],
        })}
      />
      <PageHeader
        eyebrow="Wallpapers"
        title="Every wallpaper. Every screen."
        description="Explore the full library — from bold abstracts to calm landscapes — all available in full resolution for iPhone Duo and iPhone 18 Pro."
      />
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing basePath="/wallpapers" searchParams={searchParams} />
      </section>
    </>
  );
}
