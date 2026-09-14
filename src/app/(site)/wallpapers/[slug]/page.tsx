import { Check, CircleAlert, Download, Expand, Flag, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { ShareButton, ViewTracker } from "@/components/wallpaper/client-actions";
import { WallpaperGrid } from "@/components/wallpaper/wallpaper-card";
import { WallpaperPreview } from "@/components/wallpaper/wallpaper-preview";
import { getSiteSettings } from "@/lib/data/settings";
import { getDevices } from "@/lib/data/taxonomy";
import { getPrerenderWallpaperSlugs, getRelatedWallpapers, getWallpaperBySlug } from "@/lib/data/wallpapers";
import { buildMetadata, wallpaperJsonLd } from "@/lib/seo";
import { SOURCE_TYPE_LABELS } from "@/lib/types";
import {
  cn,
  formatBytes,
  formatDate,
  formatNumber,
  imageUrl,
  orientationLabel,
  qualityLabel,
  screenFit,
  truncate,
} from "@/lib/utils";

// Renders on the server before responding so unknown slugs return a real 404 status (better for SEO).
export const instant = false;

export async function generateStaticParams() {
  const slugs = await getPrerenderWallpaperSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "__placeholder__" }];
}

function formatLabel(mime: string) {
  return mime.replace("image/", "").replace("jpeg", "jpg").toUpperCase();
}

export async function generateMetadata({ params }: PageProps<"/wallpapers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);
  if (!wallpaper) return { title: "Wallpaper not found", robots: { index: false, follow: true } };

  const title = wallpaper.seo_title || `${wallpaper.title} Wallpaper — ${wallpaper.width} × ${wallpaper.height}`;
  const description =
    wallpaper.seo_description ||
    (wallpaper.description
      ? truncate(wallpaper.description, 155)
      : `Download the ${wallpaper.title} wallpaper free in full ${wallpaper.width} × ${wallpaper.height} resolution for iPhone Duo, iPhone 18 Pro and more.`);

  return buildMetadata({
    title,
    description,
    path: `/wallpapers/${wallpaper.slug}`,
    image: {
      url: imageUrl(wallpaper.preview_key),
      width: 1080,
      height: Math.round((1080 * wallpaper.height) / wallpaper.width),
      alt: `${wallpaper.title} wallpaper`,
    },
  });
}

const FIT_STYLES = {
  sharp: { label: "Pixel-perfect", icon: Check, className: "text-success" },
  good: { label: "Great fit", icon: Check, className: "text-success" },
  low: { label: "Slightly soft", icon: CircleAlert, className: "text-warning" },
} as const;

export default async function WallpaperPage({ params }: PageProps<"/wallpapers/[slug]">) {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);
  if (!wallpaper) notFound();

  const [settings, devices, related] = await Promise.all([
    getSiteSettings(),
    getDevices(),
    getRelatedWallpapers(wallpaper.id, wallpaper.category_id, 10),
  ]);

  const path = `/wallpapers/${wallpaper.slug}`;
  const details = [
    { label: "Resolution", value: `${wallpaper.width} × ${wallpaper.height} px (${qualityLabel(wallpaper.width, wallpaper.height)})` },
    { label: "Orientation", value: orientationLabel(wallpaper.width, wallpaper.height) },
    { label: "File", value: `${formatLabel(wallpaper.mime_type)} · ${formatBytes(wallpaper.file_size)}` },
    { label: "Published", value: formatDate(wallpaper.published_at ?? wallpaper.created_at) },
    { label: "Downloads", value: formatNumber(wallpaper.downloads) },
    { label: "Source", value: SOURCE_TYPE_LABELS[wallpaper.source_type] },
  ];

  return (
    <>
      <JsonLd data={wallpaperJsonLd(wallpaper, settings)} />
      <ViewTracker id={wallpaper.id} />

      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: "Wallpapers", path: "/wallpapers" },
            ...(wallpaper.category
              ? [{ name: wallpaper.category.name, path: `/categories/${wallpaper.category.slug}` }]
              : []),
            { name: wallpaper.title, path },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <WallpaperPreview
              src={imageUrl(wallpaper.preview_key)}
              alt={`${wallpaper.title} wallpaper preview`}
              color={wallpaper.dominant_color}
              width={wallpaper.width}
              height={wallpaper.height}
            />
          </div>

          <article>
            {wallpaper.category ? (
              <Link
                href={`/categories/${wallpaper.category.slug}`}
                className="text-[15px] font-semibold text-fg-2 hover:text-link"
              >
                {wallpaper.category.name}
              </Link>
            ) : null}
            <h1 className="headline-page mt-2 text-balance">{wallpaper.title}</h1>
            <p className="mt-3 text-[17px] text-fg-2">
              {wallpaper.width} × {wallpaper.height} · {formatBytes(wallpaper.file_size)} ·{" "}
              {formatNumber(wallpaper.downloads)} downloads
            </p>
            {wallpaper.description ? (
              <p className="mt-5 whitespace-pre-line text-[17px] leading-7 text-fg-2">{wallpaper.description}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`/api/download/${wallpaper.id}`} rel="nofollow" className="btn-primary h-12 min-w-[220px] flex-1">
                <Download className="size-[18px]" />
                Download
                <span className="font-normal opacity-80">· {formatBytes(wallpaper.file_size)}</span>
              </a>
              <a
                href={`/api/download/${wallpaper.id}?mode=view`}
                rel="nofollow noopener"
                target="_blank"
                className="btn-secondary h-12"
              >
                <Expand className="size-[18px]" />
                View full size
              </a>
              <ShareButton title={wallpaper.title} path={path} />
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[13px] leading-5 text-fg-3">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                On iPhone, downloads are saved to Files → Downloads.{" "}
                <Link href="/blog/how-to-save-wallpapers-to-iphone-photos" className="link-apple">
                  Move it to Photos in two taps
                </Link>
                .
              </span>
            </p>

            {devices.length ? (
              <section className="mt-10 rounded-[24px] bg-surface p-5 md:p-6">
                <h2 className="text-[19px] font-semibold tracking-tight">Screen fit</h2>
                <ul className="mt-3 divide-y divide-line">
                  {devices.map((device) => {
                    const fit = screenFit(wallpaper.width, wallpaper.height, device.width, device.height);
                    const style = FIT_STYLES[fit.level];
                    const Icon = style.icon;
                    return (
                      <li key={device.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <Link href={`/devices/${device.slug}`} className="block truncate text-[15px] font-medium hover:text-link">
                            {device.name}
                          </Link>
                          <p className="text-[13px] text-fg-3">
                            {device.width} × {device.height} px
                          </p>
                        </div>
                        <span className={cn("inline-flex shrink-0 items-center gap-1 text-[13px] font-medium", style.className)}>
                          <Icon className="size-4" />
                          {style.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            <section className="mt-6 rounded-[24px] bg-surface p-5 md:p-6">
              <h2 className="text-[19px] font-semibold tracking-tight">Details</h2>
              <dl className="mt-3 divide-y divide-line">
                {details.map((item) => (
                  <div key={item.label} className="flex justify-between gap-6 py-3 text-[15px]">
                    <dt className="text-fg-2">{item.label}</dt>
                    <dd className="text-right font-medium">{item.value}</dd>
                  </div>
                ))}
                {wallpaper.credit_name ? (
                  <div className="flex justify-between gap-6 py-3 text-[15px]">
                    <dt className="text-fg-2">Credit</dt>
                    <dd className="text-right font-medium">
                      {wallpaper.credit_url ? (
                        <a href={wallpaper.credit_url} target="_blank" rel="noopener noreferrer nofollow" className="link-apple">
                          {wallpaper.credit_name}
                        </a>
                      ) : (
                        wallpaper.credit_name
                      )}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            {wallpaper.devices.length || wallpaper.collections.length || wallpaper.tags.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {wallpaper.devices.map((device) => (
                  <Link
                    key={device.id}
                    href={`/devices/${device.slug}`}
                    className="rounded-full bg-accent/10 px-3.5 py-1.5 text-[13px] font-medium text-link transition hover:bg-accent/15"
                  >
                    {device.name}
                  </Link>
                ))}
                {wallpaper.collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="rounded-full bg-surface px-3.5 py-1.5 text-[13px] font-medium transition hover:bg-surface-hover"
                  >
                    {collection.name}
                  </Link>
                ))}
                {wallpaper.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-fg-2 transition hover:border-line-strong hover:text-fg"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}

            <AdSlot placement="wallpaper_sidebar" className="mt-10" />

            <details className="group mt-10 border-y border-line py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                How to set this wallpaper
                <span className="text-fg-3 transition group-open:rotate-45">+</span>
              </summary>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-6 text-fg-2">
                <li>Tap Download and save the image to your Photos library.</li>
                <li>Open Settings → Wallpaper → Add New Wallpaper, then choose Photos.</li>
                <li>Pick this wallpaper, adjust the framing and tap Add.</li>
                <li>
                  Choose Set as Wallpaper Pair.{" "}
                  <Link href="/blog/how-to-set-wallpaper-on-iphone" className="link-apple">
                    Read the full guide
                  </Link>
                  .
                </li>
              </ol>
            </details>

            <p className="mt-6 text-[13px] text-fg-3">
              Free for personal use. See our{" "}
              <Link href="/terms" className="link-apple">
                Terms of Use
              </Link>
              .{" "}
              <Link
                href={`/dmca?wallpaper=${wallpaper.slug}`}
                rel="nofollow"
                className="inline-flex items-center gap-1 hover:text-fg hover:underline"
              >
                <Flag className="size-3" />
                Report this wallpaper
              </Link>
            </p>
          </article>
        </div>

        <AdSlot placement="wallpaper_bottom" className="mt-20" />

        {related.length ? (
          <section className="mt-20">
            <SectionHeading
              title="More like this."
              subtitle={wallpaper.category ? `More ${wallpaper.category.name.toLowerCase()} picks.` : "You might also like."}
              href={wallpaper.category ? `/categories/${wallpaper.category.slug}` : "/wallpapers"}
            />
            <WallpaperGrid wallpapers={related} />
          </section>
        ) : null}
      </div>
    </>
  );
}
