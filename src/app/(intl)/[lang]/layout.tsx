import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/site/site-chrome";
import { FOREIGN_LOCALES, isForeignLocale, localeContent } from "@/lib/i18n";

// Renders on the server before responding so an unknown first segment returns a real 404 status.
export const instant = false;

export function generateStaticParams() {
  return FOREIGN_LOCALES.map((lang) => ({ lang }));
}

/**
 * Spanish and Turkish pages. The root layout's <html lang="en"> is shared, so the language is set
 * on this wrapper; Google reads the language from the content and the hreflang links either way.
 */
export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const content = localeContent(lang);

  return (
    <div lang={lang}>
      <SiteChrome chrome={content.chrome} cookies={content.cookies}>
        {children}
      </SiteChrome>
    </div>
  );
}
