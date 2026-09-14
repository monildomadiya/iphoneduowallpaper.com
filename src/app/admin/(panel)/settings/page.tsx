import type { Metadata } from "next";
import { GeneralSettingsForm } from "@/components/admin/settings-forms";
import { AdminHeader } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/admin/queries";
import { MANAGER_ROLES, requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireAdmin(MANAGER_ROLES);
  const supabase = await createSupabaseServerClient();
  const settings = await getAdminSettings(supabase);

  return (
    <>
      <AdminHeader title="Site settings" description="Brand details, analytics, legal information and social links." />
      <div className="max-w-3xl">
        <GeneralSettingsForm settings={settings} />
      </div>
    </>
  );
}
