import "server-only";
import { createHash } from "node:crypto";
import { AwsClient } from "aws4fetch";
import { isR2Configured, r2 } from "@/lib/server-env";

export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

let client: AwsClient | null = null;

function getClient(): AwsClient {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Add the R2_* environment variables.");
  }
  if (!client) {
    client = new AwsClient({
      service: "s3",
      region: "auto",
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey,
      retries: 2,
    });
  }
  return client;
}

function objectUrl(key = "") {
  const encoded = key.split("/").map(encodeURIComponent).join("/");
  return new URL(`https://${r2.accountId}.r2.cloudflarestorage.com/${encodeURIComponent(r2.bucket)}/${encoded}`);
}

async function assertSuccess(response: Response) {
  if (!response.ok) throw new Error(`R2 request failed (HTTP ${response.status}).`);
}

export interface PresignedUpload {
  key: string;
  url: string;
  headers: Record<string, string>;
}

export async function createPresignedUpload(
  key: string,
  contentType: string,
  expiresIn = 900,
): Promise<PresignedUpload> {
  const headers = { "Content-Type": contentType, "Cache-Control": IMMUTABLE_CACHE_CONTROL };
  const url = objectUrl(key);
  url.searchParams.set("X-Amz-Expires", String(expiresIn));
  const signed = await getClient().sign(url.toString(), {
    method: "PUT",
    headers,
    aws: { signQuery: true, allHeaders: true },
  });
  return {
    key,
    url: signed.url,
    headers,
  };
}

/** Uploads a file the server made itself (per-device wallpaper crops). */
export async function putObject(key: string, body: Buffer, contentType: string) {
  const response = await getClient().fetch(objectUrl(key).toString(), {
    method: "PUT",
    body: new Uint8Array(body),
    headers: { "Content-Type": contentType, "Cache-Control": IMMUTABLE_CACHE_CONTROL },
  });
  await assertSuccess(response);
  await response.body?.cancel();
}

export async function createPresignedDownload(key: string, filename: string, expiresIn = 300) {
  const url = objectUrl(key);
  url.searchParams.set("X-Amz-Expires", String(expiresIn));
  url.searchParams.set("response-content-disposition", `attachment; filename="${filename.replace(/["\r\n]/g, "")}"`);
  return (await getClient().sign(url.toString(), { aws: { signQuery: true } })).url;
}

export async function headObject(key: string): Promise<{ size: number; contentType: string | null } | null> {
  const response = await getClient().fetch(objectUrl(key).toString(), { method: "HEAD" });
  if (response.status === 404) return null;
  await assertSuccess(response);
  return { size: Number(response.headers.get("content-length") ?? 0), contentType: response.headers.get("content-type") };
}

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
}

/** Deletes objects with one request per 1,000 keys. Failures are logged, not thrown. */
export async function deleteObjects(keys: Array<string | null | undefined>) {
  if (!isR2Configured) return;
  const unique = [...new Set(keys.filter((key): key is string => Boolean(key)))];
  const batches: string[][] = [];
  for (let start = 0; start < unique.length; start += 1000) batches.push(unique.slice(start, start + 1000));

  const results = await Promise.allSettled(
    batches.map(async (batch) => {
      const body = `<Delete xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Quiet>true</Quiet>${batch.map((key) => `<Object><Key>${escapeXml(key)}</Key></Object>`).join("")}</Delete>`;
      const url = objectUrl();
      url.search = "?delete";
      const response = await getClient().fetch(url.toString(), {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/xml",
          "Content-MD5": createHash("md5").update(body).digest("base64"),
        },
      });
      await assertSuccess(response);
      if (/<Error>/.test(await response.text())) throw new Error("R2 could not delete one or more objects.");
    }),
  );
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[r2] delete failed", result.reason);
    }
  }
}

export function buildWallpaperKeys(id: string, extension: string, previewExtension = "webp", thumbExtension = "webp") {
  const now = new Date();
  const base = `wallpapers/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${id}`;
  return {
    original: `${base}/original.${extension}`,
    preview: `${base}/preview.${previewExtension}`,
    thumb: `${base}/thumb.${thumbExtension}`,
  };
}

export function buildCoverKey(id: string, extension = "webp") {
  return `covers/${id}.${extension}`;
}

const WALLPAPER_KEY = /^wallpapers\/\d{4}\/\d{2}\/([0-9a-f-]{36})\/(original|preview|thumb)\.(jpg|png|webp|avif)$/;
const COVER_KEY = /^covers\/([0-9a-f-]{36})\.(webp|jpg)$/;

/** Keys must match our own layout for the given upload ID, so clients cannot point records at arbitrary objects. */
export function isOwnedKey(key: string, id: string) {
  const match = WALLPAPER_KEY.exec(key) ?? COVER_KEY.exec(key);
  return Boolean(match && match[1] === id);
}
