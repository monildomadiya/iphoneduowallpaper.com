import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StaticSearch } from "@/components/wallpaper/static-search";
import { PageHeader } from "@/components/ui/primitives";
import { isForeignLocale, localeContent } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
export async function generateMetadata({ params }: PageProps<"/[lang]/search">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { search, ogLocale } = localeContent(lang);
  return buildMetadata({ title: search.title, description: search.description, path: `/${lang}/search`, locale: ogLocale, noIndex: true });
}
export default async function SearchPage({ params }: PageProps<"/[lang]/search">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  return <><PageHeader title={localeContent(lang).search.h1} /><section className="container-apple"><Suspense fallback={<p>Loading search…</p>}><StaticSearch locale={lang} /></Suspense></section></>;
}
