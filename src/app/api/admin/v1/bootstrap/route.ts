import { json, withAdmin } from "@/lib/api/admin";
import { listAllCategories, listAllCollections, listAllDevices } from "@/lib/admin/queries";

/**
 * The pickers every editor screen needs.
 *
 * Responses across this API mirror the database rows (snake_case); request
 * bodies mirror the Server Action schemas (camelCase).
 */
export async function GET() {
  return withAdmin(null, async ({ supabase }) => {
    const [categories, collections, devices] = await Promise.all([
      listAllCategories(supabase),
      listAllCollections(supabase),
      listAllDevices(supabase),
    ]);

    return json({
      ok: true,
      data: {
        categories: categories.map((row) => ({ id: row.id, name: row.name, is_active: row.is_active })),
        collections: collections.map((row) => ({ id: row.id, name: row.name, is_active: row.is_active })),
        devices: devices.map((row) => ({
          id: row.id,
          name: row.name,
          family: row.family,
          screen_label: row.screen_label,
          width: row.width,
          height: row.height,
          is_active: row.is_active,
        })),
      },
    });
  });
}
