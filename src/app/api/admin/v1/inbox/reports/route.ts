import type { NextRequest } from "next/server";
import { deleteReports, setReportStatus } from "@/app/admin/actions/inbox";
import { apiError, fromResult, readJson, withAdmin } from "@/lib/api/admin";
import { MANAGER_ROLES } from "@/lib/auth";

interface Body {
  action?: "status" | "delete";
  id?: string;
  status?: "open" | "resolved" | "dismissed";
  ids?: string[];
  unpublishWallpaperId?: string | null;
}

export async function POST(request: NextRequest) {
  const body = await readJson<Body>(request);
  return withAdmin(MANAGER_ROLES, async () => {
    if (body?.action === "delete") {
      const ids = Array.isArray(body.ids) ? body.ids : [];
      if (!ids.length) return apiError("Select at least one report.", 400);
      return fromResult(await deleteReports(ids));
    }
    if (!body?.id || !body.status) return apiError("Invalid request body.", 400);
    return fromResult(
      await setReportStatus(body.id, body.status, { unpublishWallpaperId: body.unpublishWallpaperId ?? null }),
    );
  });
}
