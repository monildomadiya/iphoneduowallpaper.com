import { Clock, Flag, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/site/forms";
import { Breadcrumbs, JsonLd } from "@/components/ui/primitives";
import { getSiteSettings } from "@/lib/data/settings";
import { isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { buildMetadata, localizedPageJsonLd } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const settings = await getSiteSettings();
  const { contact, ogLocale } = localeContent(lang);
  return buildMetadata({
    title: contact.title,
    description: fill(contact.description, { site: settings.site_name }),
    path: `/${lang}/contact`,
    languages: languageAlternates("/contact"),
    locale: ogLocale,
  });
}

export default async function LocalizedContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const settings = await getSiteSettings();
  const { contact, chrome } = localeContent(lang);
  const path = `/${lang}/contact`;

  return (
    <div className="container-apple">
      <JsonLd
        data={{
          ...localizedPageJsonLd({
            name: contact.title,
            description: fill(contact.description, { site: settings.site_name }),
            path,
            inLanguage: lang,
          }),
          "@type": "ContactPage",
        }}
      />
      <div className="pt-6">
        <Breadcrumbs items={[{ name: contact.eyebrow, path }]} home={{ name: chrome.homeLabel, path: chrome.homeHref }} />
      </div>
      <header className="pb-10 pt-6 md:pt-10">
        <p className="text-[15px] font-semibold text-fg-2">{contact.eyebrow}</p>
        <h1 className="headline-page mt-2">{contact.h1}</h1>
        <p className="mt-4 max-w-2xl text-[19px] leading-8 text-fg-2">{contact.lead}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        <section className="rounded-[28px] border border-line bg-elevated p-6 shadow-card md:p-8">
          <ContactForm strings={contact.form} locale={lang} />
        </section>

        <aside className="space-y-4">
          <div className="rounded-[24px] bg-surface p-6">
            <Mail className="size-6 text-accent" strokeWidth={1.7} />
            <h2 className="mt-3 text-[19px] font-semibold tracking-tight">{contact.emailTitle}</h2>
            <a href={`mailto:${settings.contact_email}`} className="link-apple mt-1 block break-all text-[15px]">
              {settings.contact_email}
            </a>
          </div>
          <div className="rounded-[24px] bg-surface p-6">
            <Clock className="size-6 text-accent" strokeWidth={1.7} />
            <h2 className="mt-3 text-[19px] font-semibold tracking-tight">{contact.responseTitle}</h2>
            <p className="mt-1 text-[15px] leading-6 text-fg-2">{contact.responseBody}</p>
          </div>
          <div className="rounded-[24px] bg-surface p-6">
            <Flag className="size-6 text-accent" strokeWidth={1.7} />
            <h2 className="mt-3 text-[19px] font-semibold tracking-tight">{contact.copyrightTitle}</h2>
            <p className="mt-1 text-[15px] leading-6 text-fg-2">
              {contact.copyrightBefore}
              <Link href="/dmca" hrefLang="en" className="link-apple">
                {contact.dmcaLink}
              </Link>
              {contact.copyrightAfter}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
