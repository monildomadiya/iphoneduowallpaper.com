import "server-only";

export const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const r2 = {
  accountId: process.env.R2_ACCOUNT_ID ?? "",
  accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  bucket: process.env.R2_BUCKET ?? "",
};

export const isR2Configured = Boolean(
  r2.accountId && r2.accessKeyId && r2.secretAccessKey && r2.bucket,
);

export const ipHashSalt = process.env.IP_HASH_SALT ?? "iphoneduowallpaper";
