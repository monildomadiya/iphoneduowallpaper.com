"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { failure, success, type ActionResult } from "@/lib/actions";
import { emptyToNull, normalizeTags, uniqueSlug } from "@/lib/admin/slugs";
import { ActionError, authorize } from "@/lib/auth";
import { deleteObjects, headObject } from "@/lib/r2";

const postSchema = z.object({
  id: z.uuid().nullish(),
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(160),
  slug: z.string().trim().max(100).nullish(),
  excerpt: z.string().trim().max(400).nullish(),
  content: z.string().max(100_000, "The article is too long."),
  coverKey: z.string().nullish(),
  tags: z.array(z.string()).max(20).default([]),
  authorName: z.string().trim().min(1).max(80).default("Editorial Team"),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(120).nullish(),
  seoDescription: z.string().trim().max(320).nullish(),
});

export async function savePost(input: z.input<typeof postSchema>): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const { supabase } = await authorize();
    const data = postSchema.parse(input);

    if (data.status === "published" && data.content.trim().length < 300) {
      throw new ActionError("Published articles should have at least 300 characters of content.");
    }
    if (data.coverKey) {
      if (!/^covers\/[0-9a-f-]{36}\.(webp|jpg)$/.test(data.coverKey)) throw new ActionError("Invalid cover image.");
      if (!(await headObject(data.coverKey))) throw new ActionError("Cover image not found. Please upload it again.");
    }

    const slug = await uniqueSlug(supabase, "posts", data.slug || data.title, data.id ?? undefined);
    const row = {
      title: data.title,
      slug,
      excerpt: emptyToNull(data.excerpt),
      content: data.content,
      cover_key: data.coverKey ?? null,
      tags: normalizeTags(data.tags),
      author_name: data.authorName,
      status: data.status,
      seo_title: emptyToNull(data.seoTitle),
      seo_description: emptyToNull(data.seoDescription),
    };

    let id = data.id ?? null;
    if (id) {
      const { data: previous } = await supabase.from("posts").select("cover_key").eq("id", id).maybeSingle();
      const { error } = await supabase.from("posts").update(row).eq("id", id);
      if (error) throw error;
      const previousCover = (previous?.cover_key as string | null) ?? null;
      if (previousCover && previousCover !== row.cover_key) await deleteObjects([previousCover]);
    } else {
      const { data: inserted, error } = await supabase.from("posts").insert(row).select("id").single();
      if (error) throw error;
      id = inserted.id as string;
    }

    updateTag("posts");
    return success({ id, slug }, data.status === "published" ? "Article published." : "Draft saved.");
  } catch (error) {
    return failure(error, "Could not save the article.");
  }
}

export async function deletePost(id: string): Promise<ActionResult<null>> {
  try {
    const { supabase } = await authorize();
    const postId = z.uuid().parse(id);
    const { data } = await supabase.from("posts").select("cover_key").eq("id", postId).maybeSingle();
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) throw error;
    if (data?.cover_key) await deleteObjects([data.cover_key as string]);
    updateTag("posts");
    return success(null, "Article deleted.");
  } catch (error) {
    return failure(error, "Could not delete the article.");
  }
}
