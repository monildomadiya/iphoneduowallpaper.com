import type { Metadata } from "next";
import { CategoryTiles } from "@/components/site/tiles";
import { EmptyState, JsonLd, PageHeader } from "@/components/ui/primitives";
import { getCategories, getDarkCategory } from "@/lib/data/taxonomy";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { stockedFirst } from "@/lib/utils";

const DESCRIPTION =
  "Find the perfect iPhone Duo wallpaper by style — abstract, gradients, nature, space, minimal, dark AMOLED, architecture and more.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Wallpaper Categories",
    description: DESCRIPTION,
    path: "/categories",
    noIndex: (await getCategories()).length === 0,
  });
}

export default async function CategoriesPage() {
  const [stored, dark] = await Promise.all([getCategories(), getDarkCategory()]);
  // Dark lists wallpapers from every category, so it goes first.
  const categories = stockedFirst([dark, ...stored]);

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: "Wallpaper Categories",
          description: DESCRIPTION,
          path: "/categories",
          breadcrumb: [{ name: "Categories", path: "/categories" }],
          items: categories
            .filter((item) => item.wallpaper_count > 0)
            .map((item) => ({ name: `${item.name} Wallpapers`, path: `/categories/${item.slug}` })),
        })}
      />
      <PageHeader
        eyebrow="Categories"
        title="Find your style."
        description="Every wallpaper is sorted into a category, so you can jump straight to the look you love."
      />
      <section className="container-apple">
        {categories.length ? (
          <CategoryTiles categories={categories} />
        ) : (
          <EmptyState title="Categories are coming soon" description="We are organizing the library. Check back shortly." />
        )}
      </section>
    </>
  );
}
