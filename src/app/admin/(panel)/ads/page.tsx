import type { Metadata } from "next";
import { AdsSettingsForm } from "@/components/admin/settings-forms";
import { AdminHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/admin/queries";
import { MANAGER_ROLES, requireAdmin } from "@/lib/auth";
import { siteUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Ads & AdSense" };

export default async function AdsPage() {
  await requireAdmin(MANAGER_ROLES);
  const supabase = await createSupabaseServerClient();
  const settings = await getAdminSettings(supabase);

  return (
    <>
      <AdminHeader
        title="Ads & AdSense"
        description="Connect Google AdSense, choose where ads appear and manage ads.txt — no code changes needed."
      />
      <AdsSettingsForm settings={settings} siteHost={siteUrl.replace(/^https?:\/\//, "")} />
    </>
  );
}
