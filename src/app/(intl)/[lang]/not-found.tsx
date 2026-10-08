import type { Metadata } from "next";
import { Suspense } from "react";
import { LocalizedNotFound } from "@/components/site/localized-not-found";
import { NotFoundContent } from "@/components/site/not-found-content";
import { FOREIGN_LOCALES, localeContent } from "@/lib/i18n";
import { mockupDate } from "@/lib/site";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

const variants = Object.fromEntries(
  FOREIGN_LOCALES.map((locale) => [locale, { strings: localeContent(locale).notFound, date: mockupDate(locale) }]),
) as Parameters<typeof LocalizedNotFound>[0]["variants"];

export default function LocalizedNotFoundPage() {
  return (
    <Suspense fallback={<NotFoundContent strings={variants.es.strings} date={variants.es.date} homeHref="/es" />}>
      <LocalizedNotFound variants={variants} />
    </Suspense>
  );
}
