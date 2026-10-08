import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, PageHeader } from "@/components/ui/primitives";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { getCategories, getDarkCategory } from "@/lib/data/taxonomy";
import { getDarkWallpapers } from "@/lib/data/wallpapers";
import { buildMetadata } from "@/lib/seo";
import { DARK_CATEGORY } from "@/lib/site";
import { imageUrl, stockedFirst } from "@/lib/utils";

const PATH = `/categories/${DARK_CATEGORY.slug}`;

export async function generateMetadata(): Promise<Metadata> {
  const dark = await getDarkCategory();
  return buildMetadata({
    title: DARK_CATEGORY.title,
    description: DARK_CATEGORY.description,
    path: PATH,
    image: dark.cover_thumb_key ? { url: imageUrl(dark.cover_thumb_key), alt: DARK_CATEGORY.name } : null,
    noIndex: dark.wallpaper_count === 0,
  });
}

export default async function DarkCategoryPage({ searchParams }: PageProps<"/categories/dark">) {
  const [{ ids }, categories] = await Promise.all([getDarkWallpapers(), getCategories()]);
  const others = stockedFirst(categories).slice(0, 8);

  return (
    <>
      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: "Categories", path: "/categories" },
            { name: DARK_CATEGORY.name, path: PATH },
          ]}
        />
      </div>
      <PageHeader
        eyebrow="Category"
        title={`${DARK_CATEGORY.name} Wallpapers`}
        description={DARK_CATEGORY.description}
        className="pt-6 md:pt-10"
      >
        <p className="mt-4 text-[17px]">
          <Link href={DARK_CATEGORY.guide.href} className="link-apple">
            Guide: {DARK_CATEGORY.guide.label}
            <ChevronRight className="ml-0.5 inline size-4 align-[-3px]" />
          </Link>
        </p>
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
        <WallpaperListing basePath={PATH} searchParams={searchParams} ids={ids} emptyTitle="No dark wallpapers yet" />
      </section>

      {/* The grid is all pictures; this says in words what the page is and who it is for. */}
      <section className="container-apple mt-24">
        <div className="max-w-3xl">
          <h2 className="headline-section">Why dark wallpapers suit iPhone Duo.</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-7 text-fg-2">
            <p>
              Both iPhone Duo screens are OLED: a black pixel is switched off, so true-black areas melt into the bezel
              and colors glow against them. Dark designs also keep the clock and widgets easy to read, and are easier on
              the eyes at night.
            </p>
            <p>
              This page gathers every dark wallpaper in the library — dark anime, night drives, AMOLED abstracts and
              landscapes after sunset — wherever it is filed. Each one shows how it fits the outer and inner displays
              before you download. Want to know whether black really saves battery? Read{" "}
              <Link href={DARK_CATEGORY.guide.href} className="link-apple">
                do true-black AMOLED wallpapers save battery
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
