import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DuoMaker } from "@/components/maker/duo-maker";
import { FaqList } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { getWallpaperBySlug } from "@/lib/data/wallpapers";
import { buildMetadata, faqJsonLd, webApplicationJsonLd } from "@/lib/seo";
import { MAKER_DESCRIPTION, MAKER_FAQ, MAKER_TITLE } from "@/lib/site";
import { imageUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: MAKER_TITLE, description: MAKER_DESCRIPTION, path: "/maker" });
}

const STEPS = [
  {
    title: "Choose a photo",
    body: "Pick any picture from your phone or computer, or open one of our wallpapers in the maker from its page. Nothing is uploaded: the crop is made in your browser.",
  },
  {
    title: "Frame each screen",
    body: "Drag the picture inside each preview and use the zoom slider. The tall outer display and the wide inner display get their own framing, so the subject sits right on both.",
  },
  {
    title: "Check the sharpness",
    body: "Under each preview, the maker says whether the photo has enough pixels for that screen or has to be enlarged — the same check every wallpaper page shows.",
  },
  {
    title: "Download both files",
    body: "You get a 1398 × 2034 file for the outer display and a 2670 × 1878 file for the inner display, named so you can tell them apart in Photos.",
  },
];

async function MakerWithWallpaper({ searchParams }: { searchParams: PageProps<"/maker">["searchParams"] }) {
  const { wallpaper: slug } = await searchParams;
  const wallpaper = typeof slug === "string" ? await getWallpaperBySlug(slug) : null;
  return (
    <DuoMaker
      key={wallpaper?.id ?? "blank"}
      wallpaper={
        wallpaper ? { url: imageUrl(wallpaper.original_key), slug: wallpaper.slug, title: wallpaper.title } : null
      }
    />
  );
}

export default function MakerPage({ searchParams }: PageProps<"/maker">) {
  return (
    <>
      <JsonLd
        data={[
          webApplicationJsonLd({ name: MAKER_TITLE, description: MAKER_DESCRIPTION, path: "/maker" }),
          faqJsonLd(MAKER_FAQ),
        ]}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs items={[{ name: "Wallpaper Maker", path: "/maker" }]} />
      </div>
      <PageHeader
        eyebrow="Free tool"
        title="iPhone Duo Wallpaper Maker"
        description="Turn any photo into a matched pair for both iPhone Duo screens — a tall file for the outer display and a wide one for the inner display — in your browser, free."
      />

      <section className="container-apple" aria-label="Wallpaper maker">
        <Suspense fallback={<DuoMaker wallpaper={null} />}>
          <MakerWithWallpaper searchParams={searchParams} />
        </Suspense>
      </section>

      <section className="container-apple mt-24">
        <SectionHeading title="How it works." subtitle="Four steps, both screens." />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-[24px] bg-surface p-6">
              <p className="text-[13px] font-semibold text-fg-3">Step {index + 1}</p>
              <h3 className="mt-2 text-[19px] font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-fg-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-apple mt-24">
        <div className="max-w-3xl">
          <h2 className="headline-section">Why iPhone Duo needs two wallpaper files.</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-7 text-fg-2">
            <p>
              The 5.4-inch outer display is a tall portrait screen at 1398 × 2034. Unfold the phone and the 7.6-inch
              inner display is wider than it is tall, at 2670 × 1878. One picture can&apos;t fill both well: a portrait
              photo on the inner display keeps only a band across its middle, and a landscape photo on the outer display
              keeps only a narrow slice.
            </p>
            <p>
              The maker cuts one crop for each screen at its exact resolution, so iOS shows it pixel for pixel instead of
              zooming. For the best result, start with a photo at least 2670 pixels wide. Keep the subject in the middle
              of the outer crop, and on the inner display move it a little to one side of the centre line, where the
              phone folds. More tips are in{" "}
              <Link href="/blog/how-to-make-your-own-iphone-duo-wallpaper" className="link-apple">
                how to make your own iPhone Duo wallpaper
              </Link>{" "}
              and{" "}
              <Link href="/blog/iphone-duo-wallpaper-sizes-explained" className="link-apple">
                iPhone Duo wallpaper sizes explained
              </Link>
              .
            </p>
            <p>
              Done? Follow{" "}
              <Link href="/blog/how-to-set-wallpaper-on-iphone" className="link-apple">
                how to set a wallpaper on iPhone
              </Link>
              , or{" "}
              <Link href="/wallpapers" className="link-apple">
                browse wallpapers
              </Link>{" "}
              made for both screens.
            </p>
          </div>
        </div>
      </section>

      <section className="container-apple mt-24">
        <SectionHeading title="Questions?" subtitle="About the maker." />
        <FaqList faqs={MAKER_FAQ} />
      </section>
    </>
  );
}
