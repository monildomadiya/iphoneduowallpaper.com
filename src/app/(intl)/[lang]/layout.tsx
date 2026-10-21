import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { RootDocument, rootMetadata, rootViewport } from "@/components/site/root-document";
import { SiteChrome } from "@/components/site/site-chrome";
import { FOREIGN_LOCALES, isForeignLocale, localeContent } from "@/lib/i18n";

// Renders on the server before responding so an unknown first segment returns a real 404 status.

export const generateMetadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export function generateStaticParams() {
  return FOREIGN_LOCALES.map((lang) => ({ lang }));
}

/** Spanish and Turkish pages: a root layout of their own, so <html lang> names the language. */
export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const content = localeContent(lang);

  return (
    <RootDocument lang={lang}>
      <SiteChrome chrome={content.chrome} cookies={content.cookies}>
        {children}
      </SiteChrome>
    </RootDocument>
  );
}
