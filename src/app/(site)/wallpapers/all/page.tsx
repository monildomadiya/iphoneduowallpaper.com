/* eslint-disable @next/next/no-img-element -- thumbnails are already sized WebP on the image CDN */
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { getAllWallpaperCards } from "@/lib/data/wallpapers";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import type { WallpaperCardData } from "@/lib/types";
import { imageUrl } from "@/lib/utils";

const PATH = "/wallpapers/all";
const TITLE = "Every iPhone Duo Wallpaper — A to Z Index";
const DESCRIPTION =
  "The complete list of iPhone Duo wallpapers on one page, grouped by category, with a link to each wallpaper's outer and inner display downloads.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
}

/**
 * Paginated listings reach the older wallpapers only through page 2, 3, 4… This page links every
 * wallpaper from one URL, a single hop from the footer of every page, so none of them is left for
 * crawlers to find on their own.
 */
export default async function AllWallpapersPage() {
  const wallpapers = await getAllWallpaperCards();
  const groups = new Map<string, { name: string; slug: string | null; items: WallpaperCardData[] }>();
  for (const wallpaper of wallpapers) {
    const key = wallpaper.category?.slug ?? "";
    const group = groups.get(key) ?? {
      name: wallpaper.category?.name ?? "Other",
      slug: wallpaper.category?.slug ?? null,
      items: [],
    };
    group.items.push(wallpaper);
    groups.set(key, group);
  }
  const sections = [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: PATH,
          breadcrumb: [
            { name: "Wallpapers", path: "/wallpapers" },
            { name: "All wallpapers", path: PATH },
          ],
          items: wallpapers.map((item) => ({ name: item.title, path: `/wallpapers/${item.slug}` })),
        })}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: "Wallpapers", path: "/wallpapers" },
            { name: "All wallpapers", path: PATH },
          ]}
        />
      </div>
      <PageHeader
        eyebrow="Index"
        title="Every wallpaper, A to Z."
        description={`All ${wallpapers.length} iPhone Duo wallpapers on one page, grouped by category.`}
        className="pt-6 md:pt-10"
      />
      <div className="container-apple space-y-14">
        {sections.map((section) => (
          <section key={section.name} aria-labelledby={`all-${section.slug ?? "other"}`}>
            <h2 id={`all-${section.slug ?? "other"}`} className="text-[23px] font-semibold tracking-tight">
              {section.slug ? (
                <Link href={`/categories/${section.slug}`} className="hover:text-link">
                  {section.name}
                </Link>
              ) : (
                section.name
              )}{" "}
              <span className="text-[17px] font-normal text-fg-3">{section.items.length}</span>
            </h2>
            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((wallpaper) => (
                <li key={wallpaper.id}>
                  <Link
                    href={`/wallpapers/${wallpaper.slug}`}
                    className="group flex items-center gap-3 rounded-2xl p-1.5 transition hover:bg-surface"
                  >
                    <img
                      src={imageUrl(wallpaper.thumb_key)}
                      alt=""
                      width={36}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-9 shrink-0 rounded-lg object-cover ring-1 ring-line"
                      style={{ backgroundColor: wallpaper.dominant_color }}
                    />
                    <span className="text-[15px] leading-5 text-fg group-hover:text-link">{wallpaper.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
