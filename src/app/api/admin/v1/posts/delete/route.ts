import type { NextRequest } from "next/server";
import { deletePosts } from "@/app/admin/actions/posts";
import { apiError, fromResult, readJson, withAdmin } from "@/lib/api/admin";

export async function POST(request: NextRequest) {
  const body = await readJson<{ ids?: string[] }>(request);
  return withAdmin(null, async () => {
    const ids = Array.isArray(body?.ids) ? body.ids : [];
    if (!ids.length) return apiError("Select at least one article.", 400);
    return fromResult(await deletePosts(ids));
  });
}
