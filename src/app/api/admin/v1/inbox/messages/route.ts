import type { NextRequest } from "next/server";
import { deleteMessages, setMessageStatus } from "@/app/admin/actions/inbox";
import { apiError, fromResult, readJson, withAdmin } from "@/lib/api/admin";
import { MANAGER_ROLES } from "@/lib/auth";

interface Body {
  action?: "status" | "delete";
  id?: string;
  status?: "new" | "read" | "archived";
  ids?: string[];
}

export async function POST(request: NextRequest) {
  const body = await readJson<Body>(request);
  return withAdmin(MANAGER_ROLES, async () => {
    if (body?.action === "delete") {
      const ids = Array.isArray(body.ids) ? body.ids : [];
      if (!ids.length) return apiError("Select at least one message.", 400);
      return fromResult(await deleteMessages(ids));
    }
    if (!body?.id || !body.status) return apiError("Invalid request body.", 400);
    return fromResult(await setMessageStatus(body.id, body.status));
  });
}
