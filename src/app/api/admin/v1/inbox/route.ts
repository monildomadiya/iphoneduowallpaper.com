import type { NextRequest } from "next/server";
import { json, numberParam, withAdmin } from "@/lib/api/admin";
import { getInboxCounts, listMessages, listReports } from "@/lib/admin/queries";
import type { ContactMessage, ContentReport } from "@/lib/types";
import { MANAGER_ROLES } from "@/lib/auth";

const MESSAGE_STATUSES = new Set(["inbox", "new", "read", "archived", "all"]);
const REPORT_STATUSES = new Set(["open", "resolved", "dismissed", "all"]);

export async function GET(request: NextRequest) {
  return withAdmin(MANAGER_ROLES, async ({ supabase }) => {
    const params = request.nextUrl.searchParams;
    const page = numberParam(params.get("page"), 1, 10_000);
    const status = params.get("status") ?? "";

    if (params.get("type") === "reports") {
      const filter = (REPORT_STATUSES.has(status) ? status : "open") as ContentReport["status"] | "all";
      const [items, counts] = await Promise.all([
        listReports(supabase, filter, page, 20),
        getInboxCounts(supabase),
      ]);
      return json({ ok: true, data: { ...items, counts } });
    }

    const filter = (MESSAGE_STATUSES.has(status) ? status : "inbox") as ContactMessage["status"] | "inbox" | "all";
    const [items, counts] = await Promise.all([
      listMessages(supabase, filter, page, 20),
      getInboxCounts(supabase),
    ]);
    return json({ ok: true, data: { ...items, counts } });
  });
}
