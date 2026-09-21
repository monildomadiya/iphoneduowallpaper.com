import type { NextRequest } from "next/server";
import { createCoverUploadTicket } from "@/app/admin/actions/taxonomy";
import { createUploadTicket } from "@/app/admin/actions/wallpapers";
import { apiError, fromResult, readJson, withAdmin } from "@/lib/api/admin";

interface TicketBody {
  kind?: "wallpaper" | "cover";
  contentType?: string;
  size?: number;
  previewType?: "image/webp" | "image/jpeg";
  thumbType?: "image/webp" | "image/jpeg";
}

/** Issues the short-lived presigned URLs the app uploads straight to Cloudflare R2 with. */
export async function POST(request: NextRequest) {
  const body = await readJson<TicketBody>(request);
  return withAdmin(null, async () => {
    if (!body) return apiError("Invalid request body.", 400);

    if (body.kind === "cover") {
      const contentType = body.contentType === "image/jpeg" ? "image/jpeg" : "image/webp";
      return fromResult(await createCoverUploadTicket({ contentType }));
    }

    return fromResult(
      await createUploadTicket({
        contentType: String(body.contentType ?? ""),
        size: Number(body.size ?? 0),
        previewType: body.previewType ?? "image/webp",
        thumbType: body.thumbType ?? "image/webp",
      }),
    );
  });
}
