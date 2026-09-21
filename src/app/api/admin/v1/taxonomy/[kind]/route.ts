import type { NextRequest } from "next/server";
import { saveCategory, saveCollection, saveDevice } from "@/app/admin/actions/taxonomy";
import { apiError, fromResult, json, readJson, withAdmin } from "@/lib/api/admin";
import {
  getTaxonomyCounts,
  listAllCategories,
  listAllCollections,
  listAllDevices,
} from "@/lib/admin/queries";

type Kind = "categories" | "collections" | "devices";

const KINDS: Record<Kind, { view: string; idColumn: string }> = {
  categories: { view: "category_stats", idColumn: "category_id" },
  collections: { view: "collection_stats", idColumn: "collection_id" },
  devices: { view: "device_stats", idColumn: "device_id" },
};

function parseKind(value: string): Kind | null {
  return value in KINDS ? (value as Kind) : null;
}

export async function GET(_request: NextRequest, context: RouteContext<"/api/admin/v1/taxonomy/[kind]">) {
  const kind = parseKind((await context.params).kind);

  return withAdmin(null, async ({ supabase }) => {
    if (!kind) return apiError("Unknown list.", 404);

    const list =
      kind === "categories" ? listAllCategories : kind === "collections" ? listAllCollections : listAllDevices;
    const [rows, counts] = await Promise.all([
      list(supabase),
      getTaxonomyCounts(supabase, KINDS[kind].view, KINDS[kind].idColumn),
    ]);

    return json({
      ok: true,
      data: { items: rows.map((row) => ({ ...row, wallpaper_count: counts[row.id] ?? 0 })) },
    });
  });
}

export async function POST(request: NextRequest, context: RouteContext<"/api/admin/v1/taxonomy/[kind]">) {
  const kind = parseKind((await context.params).kind);
  const body = await readJson(request);

  return withAdmin(null, async () => {
    if (!kind) return apiError("Unknown list.", 404);
    if (!body) return apiError("Invalid request body.", 400);

    // Each action parses the body with its own Zod schema, so the cast is checked at runtime.
    if (kind === "categories") return fromResult(await saveCategory(body as Parameters<typeof saveCategory>[0]));
    if (kind === "collections") return fromResult(await saveCollection(body as Parameters<typeof saveCollection>[0]));
    return fromResult(await saveDevice(body as Parameters<typeof saveDevice>[0]));
  });
}
