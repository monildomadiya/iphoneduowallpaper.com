import type { Metadata } from "next";
import { Suspense } from "react";
import { StaticSearch } from "@/components/wallpaper/static-search";
import { PageHeader } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/seo";
export const generateMetadata = (): Promise<Metadata> => buildMetadata({ title: "Search Wallpapers", description: "Search the wallpaper library by name, color, mood or style.", path: "/search", noIndex: true });
export default function SearchPage() {
  return <><PageHeader title="Search" /><section className="container-apple"><Suspense fallback={<p>Loading search…</p>}><StaticSearch /></Suspense></section></>;
}
