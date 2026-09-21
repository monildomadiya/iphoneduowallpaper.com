import type { NextRequest } from "next/server";
import { updateDisplayName } from "@/app/admin/actions/settings";
import { fromResult, json, readJson, withAdmin } from "@/lib/api/admin";
import { getInboxCounts, listAdminUsers } from "@/lib/admin/queries";
import { r2PublicUrl, siteUrl } from "@/lib/env";

export async function GET() {
  return withAdmin(null, async ({ admin, supabase }) => {
    const [counts, team] = await Promise.all([getInboxCounts(supabase), listAdminUsers(supabase)]);
    return json({
      ok: true,
      data: {
        admin,
        inbox: counts,
        team: team.map((member) => ({
          id: member.user_id,
          email: member.email,
          displayName: member.display_name,
          role: member.role,
          createdAt: member.created_at,
        })),
        config: { imageBaseUrl: r2PublicUrl, siteUrl },
      },
    });
  });
}

export async function PATCH(request: NextRequest) {
  const body = await readJson<{ displayName?: unknown }>(request);
  return withAdmin(null, async () => fromResult(await updateDisplayName(String(body?.displayName ?? ""))));
}
