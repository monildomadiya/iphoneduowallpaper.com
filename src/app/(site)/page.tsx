import { ChevronRight, Download, Layers, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { CategoryTiles, DeviceTiles, FaqList, PostCard } from "@/components/site/tiles";
import { JsonLd, SectionHeading } from "@/components/ui/primitives";
import { DeviceFrame } from "@/components/wallpaper/device-frame";
import { WallpaperCard, WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { listPosts } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";
import { getCategories, getDarkCategory, getDevices } from "@/lib/data/taxonomy";
import { listWallpapers } from "@/lib/data/wallpapers";
import { languageAlternates } from "@/lib/i18n";
import { buildMetadata, faqJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { HOME_DESCRIPTION, HOME_FAQ, homeTitle } from "@/lib/site";
import type { WallpaperCardData } from "@/lib/types";
import { formatNumber, imageUrl, stockedFirst } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: homeTitle(settings.site_name),
    absoluteTitle: true,
    description: HOME_DESCRIPTION,
    path: "/",
    languages: languageAlternates("/"),
  });
}

function pickHeroWallpapers(items: WallpaperCardData[]) {
  const outer = items.find((item) => item.height > item.width) ?? items[0] ?? null;
  const inner =
    items.find((item) => item.width >= item.height && item.id !== outer?.id) ??
    items.find((item) => item.id !== outer?.id) ??
    outer;
  return { outer, inner };
}

export default async function HomePage() {
  const [settings, featured, latest, popular, categories, dark, devices, posts] = await Promise.all([
    getSiteSettings(),
    listWallpapers({ featured: true, perPage: 12 }),
    listWallpapers({ perPage: 15 }),
    listWallpapers({ sort: "popular", perPage: 10 }),
    getCategories(),
    getDarkCategory(),
    getDevices(),
    listPosts(1, 3),
  ]);

  const showcase = featured.items.length ? featured.items : latest.items;
  const hero = pickHeroWallpapers(showcase);
  const hasWallpapers = latest.total > 0;

  return (
    <>
      <JsonLd data={[websiteJsonLd(settings), organizationJsonLd(settings), faqJsonLd(HOME_FAQ)]} />

      {/* ------------------------------------------------------------ Hero */}
      {/* Slides up under the floating header so the glow runs to the top edge instead of starting below it. */}
      <section className="relative -mt-[4.25rem] overflow-hidden pt-[4.25rem] md:-mt-20 md:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-18%] h-[720px] w-[1200px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(10,132,255,0.28), rgba(110,91,255,0.18) 45%, rgba(216,91,176,0.1) 70%, transparent)",
            }}
          />
        </div>

        <div className="container-apple pt-14 text-center md:pt-24">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-line bg-elevated/70 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-fg-2 backdrop-blur">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">New</span>
            Made for iPhone Duo
          </p>
          <h1 className="headline-hero mx-auto mt-6 max-w-4xl text-balance">
            iPhone Duo wallpapers, <span className="text-gradient-duo">unfolded.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[19px] leading-7 text-fg-2 md:text-[23px] md:leading-8">
            {settings.tagline} Full-resolution designs for the 5.4-inch outer display, the 7.6-inch inner display and
            iPhone 18 Pro.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href="/wallpapers" className="btn-primary">
              Browse wallpapers
            </Link>
            <Link href="/categories" className="link-apple inline-flex items-center gap-0.5 text-[17px]">
              Explore categories
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="container-apple relative mt-14 md:mt-20">
          <div className="mx-auto flex max-w-5xl items-end justify-center gap-4 sm:gap-8">
            <Link
              href={hero.outer ? `/wallpapers/${hero.outer.slug}` : "/wallpapers"}
              aria-label={hero.outer ? `${hero.outer.title} on iPhone Duo outer display` : "Browse wallpapers"}
              className="block w-[31%] max-w-[250px] animate-float"
            >
              <DeviceFrame
                variant="duo-outer"
                src={hero.outer ? imageUrl(hero.outer.preview_key) : null}
                color={hero.outer?.dominant_color}
                alt=""
                priority
                artwork={0}
              />
            </Link>
            <Link
              href={hero.inner ? `/wallpapers/${hero.inner.slug}` : "/wallpapers"}
              aria-label={hero.inner ? `${hero.inner.title} on iPhone Duo inner display` : "Browse wallpapers"}
              className="block w-[64%] max-w-[640px] animate-float-delayed"
            >
              <DeviceFrame
                variant="duo-inner"
                src={hero.inner ? imageUrl(hero.inner.preview_key) : null}
                color={hero.inner?.dominant_color}
                alt=""
                priority
                artwork={2}
              />
            </Link>
          </div>
        </div>

        <div className="container-apple mt-14">
          <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { icon: Layers, label: hasWallpapers ? `${formatNumber(latest.total)} wallpapers` : "Growing library" },
              { icon: Sparkles, label: "Full resolution" },
              { icon: Download, label: "Free, no sign-up" },
              { icon: ShieldCheck, label: "Original & licensed" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 text-[15px] font-medium text-fg-2">
                <Icon className="size-6 text-fg" strokeWidth={1.6} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-apple">
        <AdSlot placement="home_top" className="mt-16" />
      </div>

      {!hasWallpapers ? (
        <section className="container-apple mt-24">
          <div className="rounded-[32px] bg-surface px-6 py-16 text-center">
            <h2 className="headline-section">The first drop is on its way.</h2>
            <p className="mx-auto mt-3 max-w-xl text-[17px] text-fg-2">
              We are preparing a launch collection for iPhone Duo. Meanwhile, read our guide to wallpaper sizes for the
              inner and outer displays.
            </p>
            <Link href="/blog" className="btn-primary mt-7">
              Read the guides
            </Link>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Featured */}
      {featured.items.length ? (
        <section className="mt-24">
          <div className="container-apple">
            <SectionHeading title="Featured." subtitle="Hand-picked for launch." href="/wallpapers" />
          </div>
          <ul className="no-scrollbar container-apple flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {featured.items.map((wallpaper, index) => (
              <li key={wallpaper.id} className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[19%]">
                <WallpaperCard wallpaper={wallpaper} sizes="large" priority={index < 2} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Devices */}
      {devices.length ? (
        <section className="container-apple mt-24">
          <SectionHeading title="Made for every screen." subtitle="Fold, unfold, or go Pro." href="/devices" linkLabel="All devices" />
          <DeviceTiles devices={devices.slice(0, 4)} />
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Latest */}
      {latest.items.length ? (
        <section className="container-apple mt-24">
          <SectionHeading title="Latest." subtitle="Fresh from the studio." href="/wallpapers" />
          <WallpaperGrid wallpapers={latest.items} />
        </section>
      ) : null}

      <div className="container-apple">
        <AdSlot placement="home_middle" className="mt-20" />
      </div>

      {/* ------------------------------------------------------------ Categories */}
      {categories.length ? (
        <section className="container-apple mt-24">
          <SectionHeading title="Categories." subtitle="Find your vibe." href="/categories" />
          <CategoryTiles categories={stockedFirst([dark, ...categories]).slice(0, 10)} />
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Popular */}
      {popular.items.length && popular.items.some((item) => item.downloads > 0) ? (
        <section className="container-apple mt-24">
          <SectionHeading title="Popular." subtitle="The most downloaded right now." href="/wallpapers?sort=popular" />
          <WallpaperGrid wallpapers={popular.items} />
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Guides */}
      {posts.items.length ? (
        <section className="container-apple mt-24">
          <SectionHeading title="Guides." subtitle="Get the most out of your wallpapers." href="/blog" />
          <ul className="grid gap-5 md:grid-cols-3">
            {posts.items.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ About */}
      {/* The page was almost all pictures, so Google had little text to tie it to "iphone duo wallpaper"
          or to the other names people search the phone by. This says what the site is in plain words. */}
      <section className="container-apple mt-24">
        <div className="max-w-3xl">
          <h2 className="headline-section">Wallpapers for both iPhone Duo screens.</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-7 text-fg-2">
            <p>
              iPhone Duo — also searched as iPhone 18 Duo or the iPhone Fold — has two displays with very different
              shapes: a tall 5.4-inch outer screen at 1398 × 2034 and a wide 7.6-inch inner screen at 2670 × 1878
              that opens like a small tablet. A wallpaper cut for a regular iPhone loses a band from the top and
              bottom on the outer screen and much more on the inner one.
            </p>
            <p>
              Every wallpaper here is free to download in HD at its original resolution, and each page shows how it
              fits the{" "}
              <Link href="/devices/iphone-duo-outer-display" className="link-apple">
                outer display
              </Link>{" "}
              and the{" "}
              <Link href="/devices/iphone-duo-inner-display" className="link-apple">
                inner display
              </Link>{" "}
              before you save it. Not sure which size you need? Read{" "}
              <Link href="/blog/iphone-duo-wallpaper-sizes-explained" className="link-apple">
                iPhone Duo wallpaper sizes explained
              </Link>
              .
            </p>
            <p>
              Looking for Apple&apos;s own desert dunes wallpaper? Our guide to the{" "}
              <Link href="/blog/official-iphone-duo-wallpaper" className="link-apple">
                official iPhone Duo wallpaper
              </Link>{" "}
              covers the light and dark versions, their exact sizes and how to set them.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Maker */}
      <section className="container-apple mt-24">
        <div className="flex flex-col items-start gap-6 rounded-[32px] bg-surface px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <div className="max-w-2xl">
            <h2 className="headline-section">Make your own.</h2>
            <p className="mt-3 text-[17px] leading-7 text-fg-2">
              Turn any photo into a matched pair: 1398 × 2034 for the outer display and 2670 × 1878 for the inner
              display, framed for each screen. Free, and your photo never leaves your device.
            </p>
          </div>
          <Link href="/maker" className="btn-primary shrink-0">
            Open the wallpaper maker
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className="container-apple mt-24">
        <SectionHeading title="Questions?" subtitle="We have answers." />
        <FaqList faqs={HOME_FAQ} />
      </section>
    </>
  );
}
