import type { Metadata } from "next";
import { CollectionTiles } from "@/components/site/tiles";
import { EmptyState, JsonLd, PageHeader } from "@/components/ui/primitives";
import { getCollections } from "@/lib/data/taxonomy";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { stockedFirst } from "@/lib/utils";

const DESCRIPTION =
  "Curated wallpaper sets for iPhone Duo — Night Sky and Star White editions, wide designs made for unfolding, depth-effect-ready picks and more.";

export async function generateMetadata(): Promise<Metadata> {
  const collections = await getCollections();
  return buildMetadata({
    title: "Wallpaper Collections",
    description: DESCRIPTION,
    path: "/collections",
    // Nothing curated yet means nothing worth indexing, the same rule the individual hubs follow.
    noIndex: collections.length === 0,
  });
}

export default async function CollectionsPage() {
  const collections = stockedFirst(await getCollections());

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: "Wallpaper Collections",
          description: DESCRIPTION,
          path: "/collections",
          breadcrumb: [{ name: "Collections", path: "/collections" }],
          items: collections
            .filter((item) => item.wallpaper_count > 0)
            .map((item) => ({ name: item.name, path: `/collections/${item.slug}` })),
        })}
      />
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
