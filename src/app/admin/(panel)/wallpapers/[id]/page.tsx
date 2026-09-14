import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/ui";
import { WallpaperEditor } from "@/components/admin/wallpaper-editor";
import { UUID_PATTERN } from "@/lib/data/downloads";
import { getAdminWallpaper, listAllCategories, listAllCollections, listAllDevices } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Edit wallpaper" };

export default async function EditWallpaperPage({ params }: PageProps<"/admin/wallpapers/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  const [wallpaper, categories, collections, devices] = await Promise.all([
    getAdminWallpaper(supabase, id),
    listAllCategories(supabase),
    listAllCollections(supabase),
    listAllDevices(supabase),
  ]);
  if (!wallpaper) notFound();

  return (
    <>
      <AdminHeader title={wallpaper.title} back={{ href: "/admin/wallpapers", label: "Wallpapers" }} />
      <WallpaperEditor
        key={wallpaper.updated_at}
        wallpaper={wallpaper}
        categories={categories.map((item) => ({ id: item.id, name: item.name }))}
        collections={collections.map((item) => ({ id: item.id, name: item.name }))}
        devices={devices.map((item) => ({ id: item.id, name: item.name, hint: `${item.width} × ${item.height}` }))}
      />
    </>
  );
}
