"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { z } from "zod";
import { failure, idsSchema, success, type ActionResult } from "@/lib/actions";
import { emptyToNull, uniqueSlug } from "@/lib/admin/slugs";
import { ActionError, authorize } from "@/lib/auth";
import { buildCoverKey, createPresignedUpload, deleteObjects, headObject, isOwnedKey, type PresignedUpload } from "@/lib/r2";
import { isR2Configured } from "@/lib/server-env";

type TaxonomyKind = "categories" | "collections" | "devices";

const optionalText = (max: number) => z.string().trim().max(max).nullish();

const baseSchema = z.object({
  id: z.uuid().nullish(),
  name: z.string().trim().min(1, "Name is required.").max(80),
  slug: z.string().trim().max(80).nullish(),
  description: optionalText(1000),
  seoTitle: optionalText(120),
  seoDescription: optionalText(320),
  sortOrder: z.coerce.number().int().min(-1000).max(100000).default(0),
  isActive: z.boolean().default(true),
});

const categorySchema = baseSchema.extend({
  coverKey: z.string().nullish(),
});

const collectionSchema = categorySchema.extend({
  isFeatured: z.boolean().default(false),
});

const deviceSchema = baseSchema.extend({
  family: z.string().trim().min(1, "Family is required.").max(60),
  screenLabel: optionalText(60),
  width: z.coerce.number().int().positive("Width must be positive.").max(20000),
  height: z.coerce.number().int().positive("Height must be positive.").max(20000),
  diagonalIn: z.coerce.number().positive().max(99.9).nullish(),
  ppi: z.coerce.number().int().positive().max(5000).nullish(),
});

function refreshTags(kind: TaxonomyKind) {
  updateTag(kind);
  updateTag("wallpapers");
}

async function validateCover(coverKey: string | null | undefined) {
  if (!coverKey) return null;
  const match = /^covers\/([0-9a-f-]{36})\.(webp|jpg)$/.exec(coverKey);
  if (!match || !isOwnedKey(coverKey, match[1])) throw new ActionError("Invalid cover image.");
  if (!(await headObject(coverKey))) throw new ActionError("Cover image upload was not found. Please upload it again.");
  return coverKey;
}

async function saveRow(
  kind: TaxonomyKind,
  id: string | null | undefined,
  name: string,
  slugSource: string | null | undefined,
  row: Record<string, unknown>,
  coverKey?: string | null,
) {
  const { supabase } = await authorize();
  const slug = await uniqueSlug(supabase, kind, slugSource || name, id ?? undefined);

  if (id) {
    let previousCover: string | null = null;
    if (coverKey !== undefined && kind !== "devices") {
      const { data } = await supabase.from(kind).select("cover_key").eq("id", id).maybeSingle();
      previousCover = (data?.cover_key as string | null) ?? null;
    }
    const { error } = await supabase.from(kind).update({ ...row, name, slug }).eq("id", id);
    if (error) throw error;
    if (previousCover && previousCover !== coverKey) await deleteObjects([previousCover]);
    return { id, slug };
  }

  const { data, error } = await supabase.from(kind).insert({ ...row, name, slug }).select("id").single();
  if (error) throw error;
  return { id: data.id as string, slug };
}

export async function saveCategory(input: z.input<typeof categorySchema>): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const data = categorySchema.parse(input);
    const coverKey = data.coverKey === undefined ? undefined : await validateCover(data.coverKey);
    const result = await saveRow(
      "categories",
      data.id,
      data.name,
      data.slug,
      {
        description: emptyToNull(data.description),
        seo_title: emptyToNull(data.seoTitle),
        seo_description: emptyToNull(data.seoDescription),
        sort_order: data.sortOrder,
        is_active: data.isActive,
        ...(coverKey !== undefined ? { cover_key: coverKey } : {}),
      },
      coverKey,
    );
    refreshTags("categories");
    return success(result, "Category saved.");
  } catch (error) {
    return failure(error, "Could not save the category.");
  }
}

export async function saveCollection(input: z.input<typeof collectionSchema>): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const data = collectionSchema.parse(input);
    const coverKey = data.coverKey === undefined ? undefined : await validateCover(data.coverKey);
    const result = await saveRow(
      "collections",
      data.id,
      data.name,
      data.slug,
      {
        description: emptyToNull(data.description),
        seo_title: emptyToNull(data.seoTitle),
        seo_description: emptyToNull(data.seoDescription),
        sort_order: data.sortOrder,
        is_active: data.isActive,
        is_featured: data.isFeatured,
        ...(coverKey !== undefined ? { cover_key: coverKey } : {}),
      },
      coverKey,
    );
    refreshTags("collections");
    return success(result, "Collection saved.");
  } catch (error) {
    return failure(error, "Could not save the collection.");
  }
}

export async function saveDevice(input: z.input<typeof deviceSchema>): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const data = deviceSchema.parse(input);
    const result = await saveRow("devices", data.id, data.name, data.slug, {
      family: data.family,
      screen_label: emptyToNull(data.screenLabel),
      width: data.width,
      height: data.height,
      diagonal_in: data.diagonalIn ?? null,
      ppi: data.ppi ?? null,
      description: emptyToNull(data.description),
      seo_title: emptyToNull(data.seoTitle),
      seo_description: emptyToNull(data.seoDescription),
      sort_order: data.sortOrder,
      is_active: data.isActive,
    });
    refreshTags("devices");
    return success(result, "Device saved.");
  } catch (error) {
    return failure(error, "Could not save the device.");
  }
}

export async function deleteTaxonomy(kind: TaxonomyKind, ids: string[]): Promise<ActionResult<{ count: number }>> {
  try {
    const { supabase } = await authorize();
    const table = z.enum(["categories", "collections", "devices"]).parse(kind);
    const rowIds = idsSchema.parse(ids);

    // Devices have no cover image; the returned rows are the ones actually deleted.
    const { data, error } = await supabase
      .from(table)
      .delete()
      .in("id", rowIds)
      .select(table === "devices" ? "id" : "id,cover_key");
    if (error) throw error;

    const rows = (data ?? []) as Array<{ cover_key?: string | null }>;
    await deleteObjects(rows.map((row) => row.cover_key));

    refreshTags(table);
    return success({ count: rows.length }, rows.length === 1 ? "Deleted." : `${rows.length} items deleted.`);
  } catch (error) {
    return failure(error, "Could not delete the selected items.");
  }
}

export async function createCoverUploadTicket(input: {
  contentType: "image/webp" | "image/jpeg";
}): Promise<ActionResult<PresignedUpload>> {
  try {
    await authorize();
    if (!isR2Configured) throw new ActionError("Cloudflare R2 is not configured.");
    const contentType = z.enum(["image/webp", "image/jpeg"]).parse(input.contentType);
    const key = buildCoverKey(randomUUID(), contentType === "image/webp" ? "webp" : "jpg");
    return success(await createPresignedUpload(key, contentType));
  } catch (error) {
    return failure(error, "Could not prepare the cover upload.");
  }
}
