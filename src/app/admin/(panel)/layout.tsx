import { ConfirmProvider } from "@/components/admin/client";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getInboxCounts } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const counts = await getInboxCounts(supabase);

  return (
    <ConfirmProvider>
      <div className="min-h-dvh bg-surface/50 lg:flex">
        <AdminSidebar admin={{ email: admin.email, displayName: admin.displayName, role: admin.role }} counts={counts} />
        <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </ConfirmProvider>
  );
}
