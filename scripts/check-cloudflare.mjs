import { spawnSync } from "node:child_process";

// Measure the final bundled Worker, including modules, using Wrangler's own report.
const result = spawnSync(
  process.execPath,
  ["node_modules/wrangler/bin/wrangler.js", "deploy", "--dry-run"],
  { encoding: "utf8", env: { ...process.env, OPEN_NEXT_DEPLOY: "true" } },
);
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const match = /gzip:\s*([\d.]+)\s*KiB/i.exec(result.stdout);
if (!match) {
  console.error("Could not verify the compressed Worker size. Deployment stopped.");
  process.exit(1);
}
const sizeKiB = Number(match[1]);
if (sizeKiB > 3 * 1024) {
  console.error(
    `Worker is ${sizeKiB} KiB compressed; Workers Free permits 3072 KiB. ` +
      "Deployment stopped. Reduce the bundle before deploying on the free plan.",
  );
  process.exit(1);
}
console.log(`Free-plan bundle size check passed (${sizeKiB} / 3072 KiB).`);
