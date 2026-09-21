import type { NextRequest } from "next/server";
import { deleteTaxonomy } from "@/app/admin/actions/taxonomy";
import { apiError, fromResult, readJson, withAdmin } from "@/lib/api/admin";

const KINDS = ["categories", "collections", "devices"] as const;
type Kind = (typeof KINDS)[number];

export async function POST(request: NextRequest, context: RouteContext<"/api/admin/v1/taxonomy/[kind]/delete">) {
  const { kind } = await context.params;
  const body = await readJson<{ ids?: string[] }>(request);

  return withAdmin(null, async () => {
    if (!KINDS.includes(kind as Kind)) return apiError("Unknown list.", 404);
    const ids = Array.isArray(body?.ids) ? body.ids : [];
    if (!ids.length) return apiError("Select at least one item.", 400);
    return fromResult(await deleteTaxonomy(kind as Kind, ids));
  });
}
