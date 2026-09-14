import type { Metadata } from "next";
import { CollectionTiles } from "@/components/site/tiles";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { getCollections } from "@/lib/data/taxonomy";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Wallpaper Collections",
    description:
      "Curated wallpaper sets for iPhone Duo — Night Sky and Star White editions, wide designs made for unfolding, depth-effect-ready picks and more.",
    path: "/collections",
  });
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title="Curated sets. Perfectly paired."
        description="Themed collections picked by our editors — ideal when you want your Lock Screen and Home Screen to match."
      />
      <section className="container-apple">
        {collections.length ? (
          <CollectionTiles collections={collections} />
        ) : (
          <EmptyState title="Collections are coming soon" description="Our editors are putting the first sets together." />
        )}
      </section>
    </>
  );
}
