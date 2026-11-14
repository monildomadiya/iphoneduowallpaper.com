import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { FaqList } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { WallpaperCard, WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { getCategories, getDarkCategory, getThemeCategories } from "@/lib/data/taxonomy";
import { getDarkWallpapers, getThemeWallpapers, listWallpapers } from "@/lib/data/wallpapers";
import { buildMetadata, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";
import { formatNumber, imageUrl } from "@/lib/utils";

const PATH = "/wallpapers/best";
const TITLE = "Best iPhone Duo Wallpapers — Most Downloaded, Free HD";
const DESCRIPTION =
  "The best iPhone Duo wallpapers, ranked by real downloads rather than our opinion, plus the top picks by style. Preview both screens and download free.";
const BREADCRUMB = [
  { name: "Wallpapers", path: "/wallpapers" },
  { name: "Best wallpapers", path: PATH },
];
const TOP_COUNT = 20;
const PICKS_PER_STYLE = 5;
const MIN_PICKS = 3;
/** The styles with the most downloads per wallpaper in Nov 2026, so the picks open on what people want. */
const PICK_ORDER = ["sunset", "desert", "landscape", "car", "dark", "aesthetic", "minimal", "anime"];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
}

/**
 * "best iphone duo wallpapers" and its variants earned about 100 clicks a month for the home page,
 * from position 8–10, with no page of their own. Ranking by download count keeps the list honest
 * and lets it change as people's choices do.
 */
export default async function BestWallpapersPage() {
  const [top, categories, dark, themes, darkWallpapers, themeWallpapers] = await Promise.all([
    listWallpapers({ sort: "popular", perPage: TOP_COUNT }),
    getCategories(),
    getDarkCategory(),
    getThemeCategories(),
    getDarkWallpapers(),
    getThemeWallpapers(),
  ]);
  const styles = [...categories, dark, ...themes];
  const candidates = await Promise.all(
    PICK_ORDER.flatMap((slug) => styles.find((item) => item.slug === slug && item.wallpaper_count > 0) ?? []).map(
      async (style) => {
        const query =
          style.slug === dark.slug
            ? { ids: darkWallpapers.ids }
            : themeWallpapers[style.slug] && style.id.startsWith("virtual:")
              ? { ids: themeWallpapers[style.slug].ids }
              : { categoryId: style.id };
        const { items } = await listWallpapers({ ...query, sort: "popular", perPage: 60 });
        return { style, items };
      },
    ),
  );
  // The overall winners top most styles too, so each wallpaper appears once: the picks go deeper
  // into the library instead of repeating the list above them.
  const seen = new Set(top.items.map((item) => item.id));
  const picks = candidates.map(({ style, items }) => {
    const fresh = items.filter((item) => !seen.has(item.id)).slice(0, PICKS_PER_STYLE);
    for (const item of fresh) seen.add(item.id);
    return { style, items: fresh };
  });
  const leader = top.items[0];
  const faqs = [
    ...(leader
      ? [
          {
            question: "What is the best iPhone Duo wallpaper?",
            answer: `By downloads on this site, it is currently ${leader.title}, saved ${formatNumber(leader.downloads)} times. The right one for you depends on your apps and your taste, so compare the outer and inner previews on each page before you download.`,
          },
        ]
      : []),
    {
      question: "How are these wallpapers ranked?",
      answer:
        "By how many times each one has been downloaded from this site. Nobody pays for a place on the list, and it updates as downloads come in, so a newer wallpaper can climb it.",
    },
    {
      question: "Which kind of wallpaper looks best on iPhone Duo?",
      answer:
        "Designs with a clear subject and calm space around it. Each of the two screens has its own shape, so a wide scene with room at the edges survives both crops better than a tight close-up. Dark designs also suit the OLED panels and keep the clock easy to read.",
    },
    {
      question: "Are the best iPhone Duo wallpapers free and in 4K?",
      answer:
        "They are all free for personal use with no sign-up. The library is HD for now rather than 4K: each page shows the file's exact pixel size and how sharp it will be on each screen, so you can judge before you download.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: PATH,
            breadcrumb: BREADCRUMB,
            items: top.items.map((item) => ({ name: item.title, path: `/wallpapers/${item.slug}`, image: imageUrl(item.thumb_key) })),
          }),
          faqJsonLd(faqs),
        ]}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs items={BREADCRUMB} />
      </div>
      <PageHeader
        eyebrow="Top picks"
        title="The best iPhone Duo wallpapers."
        description="Ranked by what people actually download, not by what we like. Every page previews the outer and inner displays and shows the real file size."
        className="pt-6 md:pt-10"
      />

      <section className="container-apple" aria-labelledby="best-top">
        <h2 id="best-top" className="headline-section">
          Top {top.items.length}, most downloaded.
        </h2>
        <ol className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
          {top.items.map((wallpaper, index) => (
            <li key={wallpaper.id} className="relative">
              <span className="absolute left-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/70 text-[14px] font-semibold tabular-nums text-white backdrop-blur">
                {index + 1}
              </span>
              <WallpaperCard wallpaper={wallpaper} priority={index < 4} />
            </li>
          ))}
        </ol>
      </section>

      <div className="container-apple">
        <AdSlot placement="list_top" className="mt-16" />
      </div>

      {picks.map(({ style, items }) =>
        items.length >= MIN_PICKS ? (
          <section key={style.id} className="container-apple mt-20">
            <SectionHeading
              title={`Best ${style.name} wallpapers.`}
              href={`/categories/${style.slug}`}
              linkLabel={`All ${formatNumber(style.wallpaper_count)}`}
            />
            <WallpaperGrid wallpapers={items} />
          </section>
        ) : null,
      )}

      <section className="container-apple mt-24">
        <div className="max-w-3xl">
          <h2 className="headline-section">How to choose between them.</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-7 text-fg-2">
            <p>
              Popular is a good starting point, but your Home Screen is not anyone else&apos;s. Start with the screen you see
              most. The closed phone shows a tall crop at 1398 × 2034, and the open phone shows a wide one at 2670 × 1878, so a
              picture can be perfect on one and ordinary on the other.
            </p>
            <p>
              Then check the top of the picture behind the clock and the area behind your most-used apps. Our{" "}
              <Link href="/wallpaper-readability" className="link-apple">
                readability lab
              </Link>{" "}
              tests both, the{" "}
              <Link href="/wallpaper-help" className="link-apple">
                fit calculator
              </Link>{" "}
              shows how much gets cropped, and the{" "}
              <Link href="/maker" className="link-apple">
                wallpaper maker
              </Link>{" "}
              turns your own photo into a matched pair if nothing here is quite right.
            </p>
          </div>
        </div>
      </section>

      <section className="container-apple mt-24">
        <SectionHeading title="Questions?" subtitle="About the ranking and the files." />
        <FaqList faqs={faqs} />
      </section>
    </>
  );
}
