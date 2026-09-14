import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { AdminHeader } from "@/components/admin/ui";
import { getTaxonomyCounts, listAllCollections } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Collections" };

export default async function AdminCollectionsPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const [rows, counts] = await Promise.all([
    listAllCollections(supabase),
    getTaxonomyCounts(supabase, "collection_stats", "collection_id"),
  ]);

  return (
    <>
      <AdminHeader
        title="Collections"
        description="Curated sets like “Night Sky Edition”. Add wallpapers to collections from the upload or edit screens."
      />
      <TaxonomyManager kind="collections" rows={rows.map((row) => ({ ...row, wallpaper_count: counts[row.id] ?? 0 }))} />
    </>
  );
}
