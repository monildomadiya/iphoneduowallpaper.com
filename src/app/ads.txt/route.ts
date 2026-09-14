import { getSiteSettings } from "@/lib/data/settings";

/** Serves /ads.txt from Admin → Ads. Falls back to the standard Google line for the publisher ID. */
export async function GET() {
  const settings = await getSiteSettings();
  let body = settings.ads_txt?.trim() ?? "";

  if (!body && settings.adsense_client_id) {
    const publisherId = settings.adsense_client_id.replace(/^ca-/, "");
    body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
  }

  return new Response(body ? `${body}\n` : "# ads.txt is not configured yet\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
