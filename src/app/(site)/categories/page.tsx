import type { Metadata } from "next";
import { CategoryTiles } from "@/components/site/tiles";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { getCategories } from "@/lib/data/taxonomy";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Wallpaper Categories",
    description:
      "Find the perfect iPhone Duo wallpaper by style — abstract, gradients, nature, space, minimal, dark AMOLED, architecture and more.",
    path: "/categories",
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
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
