import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { AdminHeader } from "@/components/admin/ui";
import { getTaxonomyCounts, listAllDevices } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Devices" };

export default async function AdminDevicesPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const [rows, counts] = await Promise.all([
    listAllDevices(supabase),
    getTaxonomyCounts(supabase, "device_stats", "device_id"),
  ]);

  return (
    <>
      <AdminHeader
        title="Devices"
        description="Screen sizes power the “Screen fit” checks and device pages. Use the orientation people normally use the screen in."
      />
      <TaxonomyManager kind="devices" rows={rows.map((row) => ({ ...row, wallpaper_count: counts[row.id] ?? 0 }))} />
    </>
  );
}
