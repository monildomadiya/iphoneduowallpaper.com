import type { NextRequest } from "next/server";
import { saveAdsSettings, saveGeneralSettings } from "@/app/admin/actions/settings";
import { apiError, fromResult, json, readJson, withAdmin } from "@/lib/api/admin";
import { getAdminSettings } from "@/lib/admin/queries";
import { MANAGER_ROLES } from "@/lib/auth";
import { AD_PLACEMENTS } from "@/lib/types";

export async function GET() {
  return withAdmin(MANAGER_ROLES, async ({ supabase }) => {
    return json({
      ok: true,
      data: { settings: await getAdminSettings(supabase), placements: AD_PLACEMENTS },
    });
  });
}

export async function PUT(request: NextRequest) {
  const body = await readJson<{ section?: string; payload?: unknown }>(request);

  return withAdmin(MANAGER_ROLES, async () => {
    if (!body?.payload) return apiError("Invalid request body.", 400);

    // Both actions parse the payload with their own Zod schema.
    if (body.section === "ads") {
      return fromResult(await saveAdsSettings(body.payload as Parameters<typeof saveAdsSettings>[0]));
    }
    if (body.section === "general") {
      return fromResult(await saveGeneralSettings(body.payload as Parameters<typeof saveGeneralSettings>[0]));
    }
    return apiError("Unknown settings section.", 400);
  });
}
