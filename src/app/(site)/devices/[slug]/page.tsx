import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, PageHeader } from "@/components/ui/primitives";
import { DeviceFrame, bestVariantFor } from "@/components/wallpaper/device-frame";
import { WallpaperListing } from "@/components/wallpaper/wallpaper-listing";
import { getDeviceBySlug, getDevices } from "@/lib/data/taxonomy";
import { buildMetadata } from "@/lib/seo";
import { imageUrl, orientationLabel } from "@/lib/utils";

// Renders on the server before responding so unknown slugs return a real 404 status (better for SEO).
export const instant = false;

export async function generateStaticParams() {
  const devices = await getDevices();
  return devices.length ? devices.map((device) => ({ slug: device.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/devices/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const device = await getDeviceBySlug(slug);
  if (!device) return { title: "Device not found", robots: { index: false, follow: true } };

  return buildMetadata({
    // "1320x2868" is how people type resolutions into search.
    title: device.seo_title || `${device.name} Wallpapers ${device.width}x${device.height} — Free HD & 4K`,
    description:
      device.seo_description ||
      `Free ${device.name} wallpapers made for the ${device.width}x${device.height} screen. Full-resolution HD and 4K downloads that fit pixel for pixel, no sign-up.`,
    path: `/devices/${device.slug}`,
    noIndex: device.wallpaper_count === 0,
  });
}

export default async function DevicePage({ params, searchParams }: PageProps<"/devices/[slug]">) {
  const { slug } = await params;
  const device = await getDeviceBySlug(slug);
  if (!device) notFound();

  const variant = device.width > device.height ? "duo-inner" : bestVariantFor(device.width, device.height);
  const specs = [
    { label: "Display", value: device.diagonal_in ? `${device.diagonal_in}-inch` : "—" },
    { label: "Resolution", value: `${device.width} × ${device.height} px` },
    { label: "Pixel density", value: device.ppi ? `${device.ppi} ppi` : "—" },
    { label: "Orientation", value: orientationLabel(device.width, device.height) },
  ];

  return (
    <>
      <div className="container-apple pt-6">
        <Breadcrumbs
          items={[
            { name: "Devices", path: "/devices" },
            { name: device.name, path: `/devices/${device.slug}` },
          ]}
        />
      </div>
      <div className="container-apple grid items-center gap-10 pb-12 pt-6 md:grid-cols-[1.2fr_1fr] md:pt-10">
        <PageHeader
          eyebrow={device.family}
          title={`${device.name} Wallpapers`}
          description={device.description}
          className="px-0 pb-0 pt-0 md:pb-0 md:pt-0"
        >
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-2xl bg-surface p-4">
                <dt className="text-[12px] font-medium text-fg-3">{spec.label}</dt>
                <dd className="mt-1 text-[15px] font-semibold tracking-tight">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </PageHeader>
        <div className="flex justify-center">
          <DeviceFrame
            variant={variant}
            src={device.cover_thumb_key ? imageUrl(device.cover_thumb_key) : null}
            artwork={2}
            className={variant === "duo-inner" ? "w-full max-w-[460px]" : "w-[52%] max-w-[250px]"}
            priority
          />
        </div>
      </div>
      <section className="container-apple">
        <AdSlot placement="list_top" className="mb-10" />
        <WallpaperListing
          basePath={`/devices/${device.slug}`}
          searchParams={searchParams}
          deviceId={device.id}
          emptyTitle={`No ${device.name} wallpapers yet`}
        />
      </section>
    </>
  );
}
