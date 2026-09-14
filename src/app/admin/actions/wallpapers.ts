"use server";

import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { updateTag } from "next/cache";
import { z } from "zod";
import { failure, success, type ActionResult } from "@/lib/actions";
import { emptyToNull, normalizeTags, uniqueSlug } from "@/lib/admin/slugs";
import { ActionError, authorize } from "@/lib/auth";
import {
  ALLOWED_IMAGE_TYPES,
  buildWallpaperKeys,
  createPresignedUpload,
  deleteObjects,
  headObject,
  isOwnedKey,
  type PresignedUpload,
} from "@/lib/r2";
import { isR2Configured } from "@/lib/server-env";

const MAX_ORIGINAL_BYTES = 40 * 1024 * 1024;
const DERIVED_EXTENSIONS = { "image/webp": "webp", "image/jpeg": "jpg" } as const;

const ticketSchema = z.object({
  contentType: z.string(),
  size: z.number().int().positive().max(MAX_ORIGINAL_BYTES, "Files must be 40 MB or smaller."),
  previewType: z.enum(["image/webp", "image/jpeg"]),
  thumbType: z.enum(["image/webp", "image/jpeg"]),
});

export interface UploadTicket {
  id: string;
  original: PresignedUpload;
  preview: PresignedUpload;
  thumb: PresignedUpload;
}

/** Issues short-lived presigned URLs so the browser uploads straight to Cloudflare R2. */
export async function createUploadTicket(input: z.input<typeof ticketSchema>): Promise<ActionResult<UploadTicket>> {
  try {
    await authorize();
    if (!isR2Configured) throw new ActionError("Cloudflare R2 is not configured. Add the R2_* environment variables.");
    const data = ticketSchema.parse(input);
    const extension = ALLOWED_IMAGE_TYPES[data.contentType];
    if (!extension) throw new ActionError("Unsupported file type. Please upload JPG, PNG, WebP or AVIF images.");

    const id = randomUUID();
    const keys = buildWallpaperKeys(
      id,
      extension,
      DERIVED_EXTENSIONS[data.previewType],
      DERIVED_EXTENSIONS[data.thumbType],
    );
    const [original, preview, thumb] = await Promise.all([
      createPresignedUpload(keys.original, data.contentType),
      createPresignedUpload(keys.preview, data.previewType),
      createPresignedUpload(keys.thumb, data.thumbType),
    ]);
    return success({ id, original, preview, thumb });
  } catch (error) {
    return failure(error, "Could not prepare the upload.");
  }
}

const optionalText = (max: number) => z.string().trim().max(max).nullish();

const fieldsSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(120),
  slug: z.string().trim().max(100).nullish(),
  description: optionalText(2000),
  categoryId: z.uuid().nullish(),
  deviceIds: z.array(z.uuid()).max(20).default([]),
  collectionIds: z.array(z.uuid()).max(50).default([]),
  tags: z.array(z.string()).max(30).default([]),
  status: z.enum(["draft", "published"]),
  isFeatured: z.boolean().default(false),
  sourceType: z.enum(["original", "ai", "licensed", "public_domain"]).default("original"),
  creditName: optionalText(120),
  creditUrl: z.union([z.url({ protocol: /^https?$/, error: "Credit link must start with https://" }), z.literal("")]).nullish(),
  seoTitle: optionalText(120),
  seoDescription: optionalText(320),
});

const imageSchema = z.object({
  uploadId: z.uuid(),
  originalKey: z.string(),
  previewKey: z.string(),
  thumbKey: z.string(),
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
  mimeType: z.string(),
  dominantColor: z.string().regex(/^#[0-9a-f]{6}$/i),
});

async function verifyUploadedImage(image: z.infer<typeof imageSchema>) {
  if (!ALLOWED_IMAGE_TYPES[image.mimeType]) throw new ActionError("Unsupported file type.");
  for (const key of [image.originalKey, image.previewKey, image.thumbKey]) {
    if (!isOwnedKey(key, image.uploadId)) throw new ActionError("Invalid upload reference.");
  }
  const [original, preview, thumb] = await Promise.all([
    headObject(image.originalKey),
    headObject(image.previewKey),
    headObject(image.thumbKey),
  ]);
  if (!original || !preview || !thumb) {
    throw new ActionError("The uploaded files were not found in storage. Please upload again.");
  }
  return original.size;
}

async function syncRelations(supabase: SupabaseClient, wallpaperId: string, deviceIds: string[], collectionIds: string[]) {
  const [devices, collections] = await Promise.all([
    supabase.from("wallpaper_devices").delete().eq("wallpaper_id", wallpaperId),
    supabase.from("wallpaper_collections").delete().eq("wallpaper_id", wallpaperId),
  ]);
  if (devices.error) throw devices.error;
  if (collections.error) throw collections.error;

  const inserts = [];
  if (deviceIds.length) {
    inserts.push(
      supabase
        .from("wallpaper_devices")
        .insert([...new Set(deviceIds)].map((device_id) => ({ wallpaper_id: wallpaperId, device_id }))),
    );
  }
  if (collectionIds.length) {
    inserts.push(
      supabase
        .from("wallpaper_collections")
        .insert([...new Set(collectionIds)].map((collection_id) => ({ wallpaper_id: wallpaperId, collection_id }))),
    );
  }
  for (const result of await Promise.all(inserts)) {
    if (result.error) throw result.error;
  }
}

function rowFields(data: z.infer<typeof fieldsSchema>) {
  return {
    title: data.title,
    description: emptyToNull(data.description),
    category_id: data.categoryId ?? null,
    tags: normalizeTags(data.tags),
    status: data.status,
    is_featured: data.isFeatured,
    source_type: data.sourceType,
    credit_name: emptyToNull(data.creditName),
    credit_url: emptyToNull(data.creditUrl),
    seo_title: emptyToNull(data.seoTitle),
    seo_description: emptyToNull(data.seoDescription),
  };
}

export type CreateWallpaperInput = z.input<typeof fieldsSchema> & z.input<typeof imageSchema>;

export async function createWallpaper(input: CreateWallpaperInput): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const { admin, supabase } = await authorize();
    const fields = fieldsSchema.parse(input);
    const image = imageSchema.parse(input);
    const fileSize = await verifyUploadedImage(image);
    const slug = await uniqueSlug(supabase, "wallpapers", fields.slug || fields.title);

    const { error } = await supabase.from("wallpapers").insert({
      id: image.uploadId,
      slug,
      ...rowFields(fields),
      original_key: image.originalKey,
      preview_key: image.previewKey,
      thumb_key: image.thumbKey,
      width: image.width,
      height: image.height,
      file_size: fileSize,
      mime_type: image.mimeType,
      dominant_color: image.dominantColor.toLowerCase(),
      created_by: admin.id,
    });
    if (error) throw error;

    await syncRelations(supabase, image.uploadId, fields.deviceIds, fields.collectionIds);
    updateTag("wallpapers");
    return success({ id: image.uploadId, slug });
  } catch (error) {
    return failure(error, "Could not save the wallpaper.");
  }
}

export async function updateWallpaper(
  id: string,
  input: z.input<typeof fieldsSchema>,
): Promise<ActionResult<{ slug: string }>> {
  try {
    const { supabase } = await authorize();
    const wallpaperId = z.uuid().parse(id);
    const fields = fieldsSchema.parse(input);
    const slug = await uniqueSlug(supabase, "wallpapers", fields.slug || fields.title, wallpaperId);

    const { error } = await supabase
      .from("wallpapers")
      .update({ slug, ...rowFields(fields) })
      .eq("id", wallpaperId);
    if (error) throw error;

    await syncRelations(supabase, wallpaperId, fields.deviceIds, fields.collectionIds);
    updateTag("wallpapers");
    return success({ slug }, "Wallpaper saved.");
  } catch (error) {
    return failure(error, "Could not save the wallpaper.");
  }
}

export async function replaceWallpaperImage(
  id: string,
  input: z.input<typeof imageSchema>,
): Promise<ActionResult<{ thumbKey: string; previewKey: string }>> {
  try {
    const { supabase } = await authorize();
    const wallpaperId = z.uuid().parse(id);
    const image = imageSchema.parse(input);
    const fileSize = await verifyUploadedImage(image);

    const { data: current, error: loadError } = await supabase
      .from("wallpapers")
      .select("original_key,preview_key,thumb_key")
      .eq("id", wallpaperId)
      .single();
    if (loadError) throw loadError;

    const { error } = await supabase
      .from("wallpapers")
      .update({
        original_key: image.originalKey,
        preview_key: image.previewKey,
        thumb_key: image.thumbKey,
        width: image.width,
        height: image.height,
        file_size: fileSize,
        mime_type: image.mimeType,
        dominant_color: image.dominantColor.toLowerCase(),
      })
      .eq("id", wallpaperId);
    if (error) throw error;

    await deleteObjects([current.original_key, current.preview_key, current.thumb_key]);
    updateTag("wallpapers");
    return success({ thumbKey: image.thumbKey, previewKey: image.previewKey }, "Image replaced.");
  } catch (error) {
    return failure(error, "Could not replace the image.");
  }
}

const idsSchema = z.array(z.uuid()).min(1).max(200);

export async function deleteWallpapers(ids: string[]): Promise<ActionResult<{ count: number }>> {
  try {
    const { supabase } = await authorize();
    const wallpaperIds = idsSchema.parse(ids);

    const { data, error: loadError } = await supabase
      .from("wallpapers")
      .select("id,original_key,preview_key,thumb_key")
      .in("id", wallpaperIds);
    if (loadError) throw loadError;

    const { error } = await supabase.from("wallpapers").delete().in("id", wallpaperIds);
    if (error) throw error;

    await deleteObjects((data ?? []).flatMap((row) => [row.original_key, row.preview_key, row.thumb_key]));
    updateTag("wallpapers");
    return success({ count: data?.length ?? 0 }, `${data?.length ?? 0} wallpaper(s) deleted.`);
  } catch (error) {
    return failure(error, "Could not delete the selected wallpapers.");
  }
}

const bulkSchema = z.object({
  status: z.enum(["draft", "published"]).optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.uuid().nullable().optional(),
});

export async function bulkUpdateWallpapers(
  ids: string[],
  patch: z.input<typeof bulkSchema>,
): Promise<ActionResult<{ count: number }>> {
  try {
    const { supabase } = await authorize();
    const wallpaperIds = idsSchema.parse(ids);
    const data = bulkSchema.parse(patch);

    const update: Record<string, unknown> = {};
    if (data.status) update.status = data.status;
    if (data.isFeatured !== undefined) update.is_featured = data.isFeatured;
    if (data.categoryId !== undefined) update.category_id = data.categoryId;
    if (!Object.keys(update).length) throw new ActionError("Nothing to update.");

    const { error, count } = await supabase
      .from("wallpapers")
      .update(update, { count: "exact" })
      .in("id", wallpaperIds);
    if (error) throw error;

    updateTag("wallpapers");
    return success({ count: count ?? wallpaperIds.length }, `${count ?? wallpaperIds.length} wallpaper(s) updated.`);
  } catch (error) {
    return failure(error, "Could not update the selected wallpapers.");
  }
}
