import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "All iPhone Duo Wallpapers — Free 4K Downloads",
    description:
      "Browse every wallpaper in our library. Full-resolution designs for iPhone Duo's inner and outer displays, iPhone 18 Pro and Pro Max — sorted by newest or most downloaded.",
    path: "/wallpapers",
  });
}

export default function WallpapersPage({ searchParams }: PageProps<"/wallpapers">) {
  return (
    <>
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
