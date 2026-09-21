import type { NextRequest } from "next/server";
import { savePost } from "@/app/admin/actions/posts";
import { apiError, fromResult, json, readJson, withAdmin } from "@/lib/api/admin";
import { listAdminPosts } from "@/lib/admin/queries";

export async function GET() {
  return withAdmin(null, async ({ supabase }) => {
    return json({ ok: true, data: { items: await listAdminPosts(supabase) } });
  });
}

export async function POST(request: NextRequest) {
  const body = await readJson<Parameters<typeof savePost>[0]>(request);
  return withAdmin(null, async () => {
    if (!body) return apiError("Invalid request body.", 400);
    return fromResult(await savePost(body));
  });
}
