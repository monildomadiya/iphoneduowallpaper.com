"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { failure, success, type ActionResult } from "@/lib/actions";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { getServiceSupabase } from "@/lib/supabase/service";

const MIN_FILL_MS = 2500;

async function guard(formData: FormData, bucket: string): Promise<ActionResult | null> {
  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || startedAt <= 0 || Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, error: "Please take a moment to complete the form, then try again." };
  }
  const ip = getClientIp(await headers());
  const limit = rateLimit(`${bucket}:${hashIp(ip)}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return {
      ok: false,
      error: `You've sent several messages recently. Please try again in ${Math.ceil(limit.retryAfter / 60)} minutes.`,
    };
  }
  return null;
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(160),
  subject: z.string().trim().max(140, "Subject is too long.").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Your message should be at least 10 characters.")
    .max(5000, "Your message is too long."),
});

export async function submitContact(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // Honeypot field: real visitors never see or fill it.
  if (formData.get("company")) return success(undefined, "Thanks! Your message has been sent.");

  const blocked = await guard(formData, "contact");
  if (blocked) return blocked;

  try {
    const data = contactSchema.parse({
      name: formData.get("name"),
      email: String(formData.get("email") ?? "").trim(),
      subject: formData.get("subject") || undefined,
      message: formData.get("message"),
    });

    const supabase = getServiceSupabase();
    if (!supabase) throw new Error("SUPABASE_SECRET_KEY is not configured");

    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) throw error;

    return success(undefined, "Thanks for reaching out! Your message has been sent and we'll reply by email.");
  } catch (error) {
    return failure(error, "We couldn't send your message right now. Please email us directly instead.");
  }
}

const reportSchema = z
  .object({
    kind: z.enum(["copyright", "broken", "inappropriate", "other"]),
    wallpaper: z.string().trim().max(120).optional(),
    pageUrl: z.string().trim().max(500).optional(),
    name: z.string().trim().min(2, "Please enter your full name.").max(120),
    email: z.email("Please enter a valid email address.").max(160),
    originalUrl: z
      .union([z.url({ protocol: /^https?$/, error: "Enter a full link starting with https://" }).max(500), z.literal("")])
      .optional(),
    details: z.string().trim().min(20, "Please describe the issue in at least 20 characters.").max(5000),
    statement: z.string().optional(),
  })
  .refine((value) => value.kind !== "copyright" || value.statement === "on", {
    path: ["statement"],
    message: "Please confirm the good-faith statement for copyright notices.",
  })
  .refine((value) => Boolean(value.wallpaper || value.pageUrl), {
    path: ["pageUrl"],
    message: "Please include the link to the page you are reporting.",
  });

export async function submitReport(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (formData.get("company")) return success(undefined, "Thanks! Your report has been received.");

  const blocked = await guard(formData, "report");
  if (blocked) return blocked;

  try {
    const data = reportSchema.parse({
      kind: formData.get("kind"),
      wallpaper: formData.get("wallpaper") || undefined,
      pageUrl: formData.get("pageUrl") || undefined,
      name: formData.get("name"),
      email: String(formData.get("email") ?? "").trim(),
      originalUrl: formData.get("originalUrl") || undefined,
      details: formData.get("details"),
      statement: formData.get("statement") || undefined,
    });

    const supabase = getServiceSupabase();
    if (!supabase) throw new Error("SUPABASE_SECRET_KEY is not configured");

    let wallpaperId: string | null = null;
    if (data.wallpaper && /^[a-z0-9-]+$/.test(data.wallpaper)) {
      const { data: match } = await supabase.from("wallpapers").select("id").eq("slug", data.wallpaper).maybeSingle();
      wallpaperId = (match?.id as string | undefined) ?? null;
    }

    const { error } = await supabase.from("reports").insert({
      kind: data.kind,
      wallpaper_id: wallpaperId,
      page_url: data.pageUrl || (data.wallpaper ? `/wallpapers/${data.wallpaper}` : null),
      name: data.name,
      email: data.email,
      original_url: data.originalUrl || null,
      details: data.details,
    });
    if (error) throw error;

    return success(
      undefined,
      "Thank you. Your report has been received. We review every notice and will contact you by email if we need more information.",
    );
  } catch (error) {
    return failure(error, "We couldn't submit your report right now. Please email us directly instead.");
  }
}
