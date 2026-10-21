import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { languageAlternates } from "@/lib/i18n";
import { listingJsonLd } from "@/lib/listing-jsonld";
import { buildMetadata, listingPage } from "@/lib/seo";

const TITLE = "All iPhone Duo Wallpapers — Free HD Downloads";
const DESCRIPTION =
  "Every wallpaper in the library, in full resolution for iPhone Duo's inner and outer displays, iPhone 18 Pro and Pro Max. Sort by newest or most downloaded.";

export async function generateMetadata({ searchParams }: PageProps<"/wallpapers">): Promise<Metadata> {
  return buildMetadata({
    page: await listingPage(searchParams),
    title: TITLE,
    description: DESCRIPTION,
    path: "/wallpapers",
    languages: languageAlternates("/wallpapers"),
  });
}

export default async function WallpapersPage({ searchParams }: PageProps<"/wallpapers">) {
  const jsonLd = await listingJsonLd({
    name: TITLE,
    description: DESCRIPTION,
    path: "/wallpapers",
    breadcrumb: [{ name: "Wallpapers", path: "/wallpapers" }],
    query: {},
  });
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Wallpapers"
        title="Every wallpaper. Every screen."
        description="Explore the full library — from bold abstracts to calm landscapes — all available in full resolution for iPhone Duo and iPhone 18 Pro."
      />
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing basePath="/wallpapers" searchParams={searchParams} />
      </section>
      <section className="container-apple mt-20">
        <div className="prose-apple max-w-3xl">
          <h2>Choose an iPhone Duo wallpaper for each screen</h2>
          <p>Not sure whether an image will stay sharp after cropping? Use our <Link href="/wallpaper-help">wallpaper fit calculator and download guide</Link> to check your image’s dimensions before choosing a file.</p>
          <p>
            The outer display needs a portrait crop, while the inner display needs a wider composition. Open a
            wallpaper to preview the framing and check its available files. Where a screen pair is available, the ZIP
            contains separate outer and inner images. For a different crop, use the <Link href="/maker">wallpaper maker</Link>.
          </p>
          <h2>HD, 4K and original resolution</h2>
          <p>
            Check the pixel dimensions on each wallpaper page before downloading. A 4K master, where available, has
            3840 pixels on its longer edge; it can still need cropping to fit your screen. An enlarged image has more
            pixels than its source, but does not guarantee more original detail. The file details identify upscaled
            masters so you can choose with that in mind.
          </p>
          <p>
            Start with <Link href="/categories/dark">dark and AMOLED wallpapers</Link> for a subdued background, or
            explore <Link href="/categories">categories</Link> to find a composition you like. Read the{" "}
            <Link href="/blog/iphone-duo-wallpaper-sizes-explained">wallpaper size guide</Link> for dimensions and
            cropping advice, and the <Link href="/blog/how-to-set-wallpaper-on-iphone">setup guide</Link> when you are
            ready to apply your download.
          </p>
        </div>
      </section>
    </>
  );
}
