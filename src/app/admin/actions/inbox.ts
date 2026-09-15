"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { failure, idsSchema, success, type ActionResult } from "@/lib/actions";
import { authorize, MANAGER_ROLES } from "@/lib/auth";

export async function setMessageStatus(id: string, status: "new" | "read" | "archived"): Promise<ActionResult<null>> {
  try {
    const { supabase } = await authorize(MANAGER_ROLES);
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: z.enum(["new", "read", "archived"]).parse(status) })
      .eq("id", z.uuid().parse(id));
    if (error) throw error;
    return success(null);
  } catch (error) {
    return failure(error, "Could not update the message.");
  }
}

export async function deleteMessages(ids: string[]): Promise<ActionResult<{ count: number }>> {
  try {
    const { supabase } = await authorize(MANAGER_ROLES);
    const { data, error } = await supabase.from("contact_messages").delete().in("id", idsSchema.parse(ids)).select("id");
    if (error) throw error;
    const count = data?.length ?? 0;
    return success({ count }, count === 1 ? "Message deleted." : `${count} messages deleted.`);
  } catch (error) {
    return failure(error, "Could not delete the selected messages.");
  }
}

export async function setReportStatus(
  id: string,
  status: "open" | "resolved" | "dismissed",
  options: { unpublishWallpaperId?: string | null } = {},
): Promise<ActionResult<null>> {
  try {
    const { supabase } = await authorize(MANAGER_ROLES);
    const { error } = await supabase
      .from("reports")
      .update({ status: z.enum(["open", "resolved", "dismissed"]).parse(status) })
      .eq("id", z.uuid().parse(id));
    if (error) throw error;

    if (options.unpublishWallpaperId) {
      const { error: unpublishError } = await supabase
        .from("wallpapers")
        .update({ status: "draft" })
        .eq("id", z.uuid().parse(options.unpublishWallpaperId));
      if (unpublishError) throw unpublishError;
      updateTag("wallpapers");
    }
    return success(null, options.unpublishWallpaperId ? "Report resolved and wallpaper unpublished." : "Report updated.");
  } catch (error) {
    return failure(error, "Could not update the report.");
  }
}

export async function deleteReports(ids: string[]): Promise<ActionResult<{ count: number }>> {
  try {
    const { supabase } = await authorize(MANAGER_ROLES);
    const { data, error } = await supabase.from("reports").delete().in("id", idsSchema.parse(ids)).select("id");
    if (error) throw error;
    const count = data?.length ?? 0;
    return success({ count }, count === 1 ? "Report deleted." : `${count} reports deleted.`);
  } catch (error) {
    return failure(error, "Could not delete the selected reports.");
  }
}
