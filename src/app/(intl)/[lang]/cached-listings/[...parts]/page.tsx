import { notFound } from "next/navigation";
import CategoryPage, { generateMetadata as categoryMetadata } from "@/app/(intl)/[lang]/categories/[slug]/page";
import DarkPage, { generateMetadata as darkMetadata } from "@/app/(intl)/[lang]/categories/dark/page";
import DevicePage, { generateMetadata as deviceMetadata } from "@/app/(intl)/[lang]/devices/[slug]/page";
import WallpapersPage, { generateMetadata as wallpapersMetadata } from "@/app/(intl)/[lang]/wallpapers/page";
import { staticListing, staticListingParams } from "@/lib/data/static-listings";
import { isForeignLocale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; parts: string[] }> };
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return isForeignLocale(params.lang) ? staticListingParams(params.lang) : [];
}

export async function generateMetadata({ params }: Props) {
  const { lang, parts } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { kind, slug, searchParams } = staticListing(parts);
  const props = { params: Promise.resolve({ lang, slug }), searchParams };
  if (kind === "category") return slug === "dark" ? darkMetadata(props) : categoryMetadata(props);
  if (kind === "device") return deviceMetadata(props);
  if (kind === "wallpapers") return wallpapersMetadata(props);
  notFound();
}

export default async function CachedLocalizedListingPage({ params }: Props) {
  const { lang, parts } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { kind, slug, searchParams } = staticListing(parts);
  const props = { params: Promise.resolve({ lang, slug }), searchParams };
  if (kind === "category") return slug === "dark" ? <DarkPage {...props} /> : <CategoryPage {...props} />;
  if (kind === "device") return <DevicePage {...props} />;
  if (kind === "wallpapers") return <WallpapersPage {...props} />;
  notFound();
}
