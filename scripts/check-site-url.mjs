import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/env.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const live = "https://iphoneduowallpaper.com";
const cases = [
  ["production", undefined, live],
  ["production", "http://localhost:3000", live],
  ["production", "https://127.0.0.1:3000", live],
  ["production", "https://[::1]:3000", live],
  ["production", "https://0.0.0.0", live],
  ["production", "invalid-url", live],
  ["production", `${live}/`, live],
  ["production", `${live}/accidental-path`, live],
  ["development", "http://localhost:3000", "http://localhost:3000"],
  ["development", undefined, "http://localhost:3000"],
];
for (const [NODE_ENV, NEXT_PUBLIC_SITE_URL, expected] of cases) {
  const context = { exports: {}, URL, process: { env: { NODE_ENV, NEXT_PUBLIC_SITE_URL } } };
  runInNewContext(outputText, context);
  assert.equal(context.exports.siteUrl, expected, `${NODE_ENV}: ${NEXT_PUBLIC_SITE_URL}`);
}
console.log(`${cases.length} site URL regression checks passed.`);
