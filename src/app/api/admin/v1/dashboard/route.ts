import { json, withAdmin } from "@/lib/api/admin";
import { buildAdSenseChecklist } from "@/lib/admin/checklist";
import {
  getAdminSettings,
  getDashboardStats,
  getRecentWallpapers,
  getTopWallpapers,
} from "@/lib/admin/queries";

export async function GET() {
  return withAdmin(null, async ({ supabase }) => {
    const [stats, top, recent, settings] = await Promise.all([
      getDashboardStats(supabase, 30),
      getTopWallpapers(supabase, 6),
      getRecentWallpapers(supabase, 6),
      getAdminSettings(supabase),
    ]);

    return json({
      ok: true,
      data: {
        stats,
        top,
        recent,
        checklist: buildAdSenseChecklist(stats, settings),
      },
    });
  });
}
