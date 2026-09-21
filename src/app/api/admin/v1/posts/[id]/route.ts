import type { NextRequest } from "next/server";
import { apiError, json, withAdmin } from "@/lib/api/admin";
import { getAdminPost } from "@/lib/admin/queries";

export async function GET(_request: NextRequest, context: RouteContext<"/api/admin/v1/posts/[id]">) {
  const { id } = await context.params;
  return withAdmin(null, async ({ supabase }) => {
    const post = await getAdminPost(supabase, id);
    if (!post) return apiError("That article no longer exists.", 404);
    return json({ ok: true, data: post });
  });
}
