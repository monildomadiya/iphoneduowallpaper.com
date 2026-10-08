import { Layers, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/site/markdown";
import { Breadcrumbs, JsonLd } from "@/components/ui/primitives";
import { getSiteSettings } from "@/lib/data/settings";
import { isForeignLocale, languageAlternates, localeContent } from "@/lib/i18n";
import { fill } from "@/lib/i18n/en";
import { buildMetadata, localizedPageJsonLd } from "@/lib/seo";

export const instant = false;

const ICONS = [Ruler, Sparkles, ShieldCheck, Layers];

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const settings = await getSiteSettings();
  const { about, ogLocale } = localeContent(lang);
  return buildMetadata({
    title: about.title,
    description: fill(about.description, { site: settings.site_name }),
    path: `/${lang}/about`,
    languages: languageAlternates("/about"),
    locale: ogLocale,
  });
}

export default async function LocalizedAboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const settings = await getSiteSettings();
  const { about, chrome } = localeContent(lang);
  const values = { site: settings.site_name, email: settings.contact_email };
  const path = `/${lang}/about`;

  return (
    <>
      <JsonLd
        data={{
          ...localizedPageJsonLd({
            name: about.title,
            description: fill(about.description, values),
            path,
            inLanguage: lang,
          }),
          "@type": "AboutPage",
        }}
      />
      <div className="container-apple pt-6">
        <Breadcrumbs items={[{ name: about.eyebrow, path }]} home={{ name: chrome.homeLabel, path: chrome.homeHref }} />
      </div>
      <header className="container-apple pb-12 pt-6 text-center md:pb-16 md:pt-14">
        <p className="text-[15px] font-semibold text-fg-2">{about.eyebrow}</p>
        <h1 className="headline-hero mx-auto mt-3 max-w-4xl text-balance">
          {about.h1} <span className="text-gradient-duo">{about.h1Accent}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-[19px] leading-8 text-fg-2 md:text-[21px]">
          {fill(about.lead, values)}
        </p>
      </header>

      <section className="container-apple">
        <ul className="grid gap-5 md:grid-cols-2">
          {about.principles.map(({ title, body }, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <li key={title} className="rounded-[28px] bg-surface p-8">
                <Icon className="size-8 text-accent" strokeWidth={1.6} />
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-2 text-[17px] leading-7 text-fg-2">{body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container-apple mt-20">
        <div className="mx-auto max-w-3xl">
          {about.sections.map((section) => (
            <div key={section.title} className="prose-apple">
              {/* Guides link their byline to #editorial-team, so that heading keeps the same id in every language. */}
              <h2 id={section.id}>{section.title}</h2>
              <Markdown content={fill(section.body, values)} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
