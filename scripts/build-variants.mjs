#!/usr/bin/env node
/**
 * Builds the per-device files of every published wallpaper: a 4K master, the iPhone Duo outer and
 * inner crops, iPhone 18 Pro and Pro Max crops, their previews and a ZIP of the Duo pair.
 *
 *   npm run variants -- upscale              # AI-upscale originals into .variants/ (slow, local GPU)
 *   npm run variants -- build --dry-run      # write every file to .variants/ without uploading
 *   npm run variants -- build                # upload to R2 and save the result on each wallpaper
 *   npm run variants -- build --only <slug>  # one wallpaper (also works with upscale)
 *   npm run variants -- build --stale        # only wallpapers whose focal point or image changed
 *
 * `upscale` needs Real-ESRGAN (https://github.com/xinntao/Real-ESRGAN/releases, ncnn-vulkan build):
 * set REALESRGAN_BIN to realesrgan-ncnn-vulkan(.exe); its models folder must sit next to it.
 * `build` uses the upscaled master when there is one and the original otherwise; a wallpaper built
 * from an original under 3840 px gets no 4K file and keeps its HD label.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, R2_* and NEXT_PUBLIC_R2_PUBLIC_URL from .env.local.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { buildVariantFiles, isStale, variantKeyBase } from "../src/lib/variants/render.ts";

function loadEnvFile(file) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match || line.trim().startsWith("#")) continue;
    const [, key, raw] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^(['"])(.*)\1$/, "$2");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const args = process.argv.slice(2);
const stage = args[0];
const dryRun = args.includes("--dry-run");
const staleOnly = args.includes("--stale");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
if (stage !== "upscale" && stage !== "build") {
  console.error("Usage: npm run variants -- <upscale|build> [--dry-run] [--stale] [--only <slug>]");
  process.exit(1);
}

const CACHE = resolve(process.cwd(), ".variants");
const MASTER_LONG_EDGE = 3840;
const publicBase = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "").replace(/\/$/, "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !secretKey || !publicBase) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY or NEXT_PUBLIC_R2_PUBLIC_URL.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });

async function loadWallpapers() {
  const columns =
    stage === "build" ? "id,slug,title,original_key,width,height,focal_x,focal_y,variants" : "id,slug,original_key,width,height";
  let query = supabase.from("wallpapers").select(columns).eq("status", "published").order("published_at");
  if (only) query = query.eq("slug", only);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function fetchOriginal(row) {
  const file = join(CACHE, row.id, `original.${row.original_key.split(".").pop()}`);
  if (!existsSync(file)) {
    const response = await fetch(`${publicBase}/${row.original_key}`);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${row.original_key}`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  }
  return file;
}

function run(command, commandArgs) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, commandArgs, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr = (stderr + chunk).slice(-2000)));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolvePromise() : reject(new Error(`exit ${code}: ${stderr}`))));
  });
}

/** Upscaled master, keyed by the original it came from so a replaced image is upscaled again. */
function masterPath(row) {
  return join(CACHE, row.id, `master-${row.original_key.split("/").slice(-2, -1)[0]}.png`);
}

async function upscale(rows) {
  const bin = process.env.REALESRGAN_BIN;
  if (!bin || !existsSync(bin)) throw new Error("Set REALESRGAN_BIN to the realesrgan-ncnn-vulkan executable.");
  const models = join(dirname(bin), "models");
  let index = 0;
  for (const row of rows) {
    index += 1;
    const master = masterPath(row);
    if (existsSync(master)) continue;
    if (Math.max(row.width, row.height) >= MASTER_LONG_EDGE) continue;
    const started = Date.now();
    const original = await fetchOriginal(row);
    const raw = join(CACHE, row.id, "x4.png");
    if (!existsSync(raw)) await run(bin, ["-i", original, "-o", raw, "-n", "realesrgan-x4plus", "-m", models, "-s", "4"]);
    // 4× overshoots 3840 on every source we have; scale down to the long edge with Lanczos.
    const landscape = row.width >= row.height;
    await sharp(raw)
      .resize(landscape ? MASTER_LONG_EDGE : null, landscape ? null : MASTER_LONG_EDGE, { kernel: "lanczos3" })
      .png({ compressionLevel: 6 })
      .toFile(master);
    rmSync(raw);
    console.log(`[${index}/${rows.length}] ${row.slug} upscaled in ${Math.round((Date.now() - started) / 1000)}s`);
  }
}

function r2Client() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET) {
    throw new Error("R2 is not configured.");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

async function build(rows) {
  const s3 = dryRun ? null : r2Client();
  let index = 0;
  for (const row of rows) {
    index += 1;
    if (staleOnly && !isStale(row)) continue;
    const master = masterPath(row);
    const source = existsSync(master) ? master : await fetchOriginal(row);
    const result = await buildVariantFiles(readFileSync(source), {
      slug: row.slug,
      keyBase: variantKeyBase(row.original_key),
      originalKey: row.original_key,
      focalX: row.focal_x,
      focalY: row.focal_y,
      upscaled: source === master,
    });

    if (dryRun) {
      const out = join(CACHE, row.id, "out");
      mkdirSync(out, { recursive: true });
      for (const file of result.uploads) writeFileSync(join(out, file.key.split("/").pop()), file.body);
      writeFileSync(join(out, "variants.json"), JSON.stringify(result.variants, null, 2));
      console.log(`[${index}/${rows.length}] ${row.slug} → ${out}`);
      continue;
    }

    for (const file of result.uploads) {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: file.key,
          Body: file.body,
          ContentType: file.contentType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
    }
    const { error } = await supabase.from("wallpapers").update({ variants: result.variants }).eq("id", row.id);
    if (error) throw new Error(`${row.slug}: ${error.message}`);
    console.log(`[${index}/${rows.length}] ${row.slug} uploaded (${result.uploads.length} files)`);
  }
}

const rows = await loadWallpapers();
console.log(`${rows.length} wallpaper(s)`);
if (stage === "upscale") await upscale(rows);
else await build(rows);
