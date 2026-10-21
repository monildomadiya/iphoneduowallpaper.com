import { notFound } from "next/navigation";
import CategoryPage, { generateMetadata as categoryMetadata } from "@/app/(site)/categories/[slug]/page";
import DarkPage, { generateMetadata as darkMetadata } from "@/app/(site)/categories/dark/page";
import DevicePage, { generateMetadata as deviceMetadata } from "@/app/(site)/devices/[slug]/page";
import WallpapersPage, { generateMetadata as wallpapersMetadata } from "@/app/(site)/wallpapers/page";
import BlogPage, { generateMetadata as blogMetadata } from "@/app/(site)/blog/page";
import { staticListing, staticListingParams } from "@/lib/data/static-listings";

// Query strings are supplied as plain build-time values, never the request-time searchParams API.
// New page combinations can be generated on demand after an admin upload.
export function generateStaticParams() { return staticListingParams(); }
type Props = { params: Promise<{ parts: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { kind, slug, searchParams } = staticListing((await params).parts);
  const props = { params: Promise.resolve({ slug }), searchParams };
  if (kind === "category") return slug === "dark" ? darkMetadata(props) : categoryMetadata(props);
  if (kind === "device") return deviceMetadata(props);
  if (kind === "wallpapers") return wallpapersMetadata(props);
  if (kind === "blog") return blogMetadata();
  notFound();
}

export default async function CachedListingPage({ params }: Props) {
  const { kind, slug, searchParams } = staticListing((await params).parts);
  const props = { params: Promise.resolve({ slug }), searchParams };
  if (kind === "category") return slug === "dark" ? <DarkPage {...props} /> : <CategoryPage {...props} />;
  if (kind === "device") return <DevicePage {...props} />;
  if (kind === "wallpapers") return <WallpapersPage {...props} />;
  if (kind === "blog") return <BlogPage {...props} />;
  notFound();
}
