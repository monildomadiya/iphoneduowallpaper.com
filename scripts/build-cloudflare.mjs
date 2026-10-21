import { spawnSync } from "node:child_process";

// Workers serve R2 variants. Generate new ones with `npm run variants -- build --stale`.
const result = spawnSync(
  process.execPath,
  [
    ...(process.platform === "win32"
      ? ["--import", new URL("./windows-build-compat.mjs", import.meta.url).href]
      : []),
    "node_modules/@opennextjs/cloudflare/dist/cli/index.js",
    "build",
    ...process.argv.slice(2),
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      // Override the localhost value commonly kept in .env.local during a production build.
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://iphoneduowallpaper.com",
      NEXT_PUBLIC_VARIANTS_MODE: "workstation",
      NEXT_PUBLIC_PUBLIC_MODE: "static",
    },
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const snapshots = spawnSync(process.execPath, ["scripts/build-public-snapshots.mjs"], { stdio: "inherit", env: process.env });
if (snapshots.error) throw snapshots.error;
process.exit(snapshots.status ?? 1);
