import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/site/tiles";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { guideCard, isForeignLocale, localeContent, localizedPath } from "@/lib/i18n";
import { buildMetadata, localizedPageJsonLd } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const { blog, ogLocale } = localeContent(lang);
  // The English guides index lists twenty guides and this one two, so they are not paired with hreflang.
  return buildMetadata({ title: blog.title, description: blog.description, path: `/${lang}/blog`, locale: ogLocale });
}

export default async function LocalizedBlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const { blog, guides, chrome } = localeContent(lang);
  const path = `/${lang}/blog`;

  return (
    <>
      <JsonLd data={localizedPageJsonLd({ name: blog.title, description: blog.description, path, inLanguage: lang })} />
      <div className="container-apple pt-6">
        <Breadcrumbs items={[{ name: blog.breadcrumb, path }]} home={{ name: chrome.homeLabel, path: chrome.homeHref }} />
      </div>
      <PageHeader eyebrow={blog.breadcrumb} title={blog.h1} description={blog.lead} className="pt-6 md:pt-10" />
      <section className="container-apple">
        <ul className="grid gap-5 md:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <PostCard post={guideCard(guide)} href={localizedPath(lang, `/blog/${guide.slug}`)} locale={lang} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
