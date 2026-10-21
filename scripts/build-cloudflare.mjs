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
    },
  },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
