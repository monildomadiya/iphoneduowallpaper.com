import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/ui";
import { Uploader } from "@/components/admin/uploader";
import { listAllCategories, listAllCollections, listAllDevices } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { r2PublicUrl } from "@/lib/env";
import { isR2Configured } from "@/lib/server-env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Upload wallpapers" };

export default async function UploadPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const [categories, collections, devices] = await Promise.all([
    listAllCategories(supabase),
    listAllCollections(supabase),
    listAllDevices(supabase),
  ]);

  return (
    <>
      <AdminHeader
        title="Upload wallpapers"
        description="Files go straight to Cloudflare R2. We create a sharp preview and thumbnail for each one in your browser."
        back={{ href: "/admin/wallpapers", label: "Wallpapers" }}
      />
      {!isR2Configured || !r2PublicUrl ? (
        <p className="mb-6 rounded-xl bg-warning/10 px-4 py-3 text-[14px] text-warning">
          Cloudflare R2 is not fully configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET and
          NEXT_PUBLIC_R2_PUBLIC_URL, then restart the server.
        </p>
      ) : null}
      <Uploader
        categories={categories.map((item) => ({ id: item.id, name: item.name }))}
        collections={collections.map((item) => ({ id: item.id, name: item.name }))}
        devices={devices.map((item) => ({ id: item.id, name: item.name, width: item.width, height: item.height }))}
      />
    </>
  );
}
