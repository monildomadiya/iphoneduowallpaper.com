import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { AdminHeader } from "@/components/admin/ui";
import { getTaxonomyCounts, listAllCategories } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const [rows, counts] = await Promise.all([
    listAllCategories(supabase),
    getTaxonomyCounts(supabase, "category_stats", "category_id"),
  ]);

  return (
    <>
      <AdminHeader
        title="Categories"
        description="Group wallpapers by style. Each category gets its own SEO-friendly page."
      />
      <TaxonomyManager kind="categories" rows={rows.map((row) => ({ ...row, wallpaper_count: counts[row.id] ?? 0 }))} />
    </>
  );
}
