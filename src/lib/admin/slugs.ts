import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/utils";

/** Returns a slug that is not used by another row: "aurora", "aurora-2", "aurora-3"… */
export async function uniqueSlug(
  supabase: SupabaseClient,
  table: "wallpapers" | "posts" | "categories" | "collections" | "devices",
  source: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(source) || `item-${Date.now().toString(36)}`;
  const { data, error } = await supabase.from(table).select("id,slug").like("slug", `${base}%`).limit(500);
  if (error) throw error;

  const taken = new Set(
    ((data ?? []) as { id: string; slug: string }[]).filter((row) => row.id !== excludeId).map((row) => row.slug),
  );
  if (!taken.has(base)) return base;
  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${base.slice(0, 74)}-${index}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base.slice(0, 70)}-${Date.now().toString(36)}`;
}

export function normalizeTags(tags: string[]): string[] {
  return [
    ...new Set(
      tags
        .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 40))
        .filter(Boolean),
    ),
  ].slice(0, 20);
}

export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
