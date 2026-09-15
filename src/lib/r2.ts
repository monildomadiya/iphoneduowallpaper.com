import "server-only";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isR2Configured, r2 } from "@/lib/server-env";

export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Add the R2_* environment variables.");
  }
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${r2.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
      // R2 does not need the SDK's default CRC32 checksums on presigned requests.
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }
  return client;
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
  const command = new PutObjectCommand({
    Bucket: r2.bucket,
    Key: key,
    ContentType: contentType,
    CacheControl: IMMUTABLE_CACHE_CONTROL,
  });
  const url = await getSignedUrl(getClient(), command, { expiresIn });
  return {
    key,
    url,
    headers: { "Content-Type": contentType, "Cache-Control": IMMUTABLE_CACHE_CONTROL },
  };
}

export async function createPresignedDownload(key: string, filename: string, expiresIn = 300) {
  const command = new GetObjectCommand({
    Bucket: r2.bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
  });
  return getSignedUrl(getClient(), command, { expiresIn });
}

export async function headObject(key: string): Promise<{ size: number; contentType: string | null } | null> {
  try {
    const result = await getClient().send(new HeadObjectCommand({ Bucket: r2.bucket, Key: key }));
    return { size: result.ContentLength ?? 0, contentType: result.ContentType ?? null };
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404 || (error as { name?: string }).name === "NotFound") return null;
    throw error;
  }
}

/** Deletes objects with one request per 1,000 keys. Failures are logged, not thrown. */
export async function deleteObjects(keys: Array<string | null | undefined>) {
  if (!isR2Configured) return;
  const unique = [...new Set(keys.filter((key): key is string => Boolean(key)))];
  const batches: string[][] = [];
  for (let start = 0; start < unique.length; start += 1000) batches.push(unique.slice(start, start + 1000));

  const results = await Promise.allSettled(
    batches.map((batch) =>
      getClient().send(
        new DeleteObjectsCommand({ Bucket: r2.bucket, Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true } }),
      ),
    ),
  );
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[r2] delete failed", result.reason);
    } else if (result.value.Errors?.length) {
      console.error("[r2] delete failed", result.value.Errors);
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
