import assert from "node:assert/strict";
const base = process.argv[2];
assert.ok(base?.startsWith("http"), "Pass the preview or production URL");
for (const path of ["/", "/categories/anime-4k", "/wallpapers?sort=popular&page=2", "/es/categories/dark", "/tr/search?q=gece", "/search?q=blue", "/maker?wallpaper=blue-pink-gradient-abstract-duo-wallpaper", "/sitemap.xml", "/image-sitemap.xml", "/ads.txt", "/public-catalog.json"]) {
  const r = await fetch(new URL(path, base), { signal: AbortSignal.timeout(45000) });
  assert.equal(r.status, 200, path);
  assert.equal(r.headers.get("x-public-rendering"), "static", `${path}: renderer was invoked`);
  const body = await r.text();
  assert.ok(body.length > 10, `${path}: empty response`);
  if (path === "/public-catalog.json") {
    const items = JSON.parse(body);
    assert.ok(Array.isArray(items) && items.length > 0);
    assert.ok(items.every((item) => item.id && item.slug && item.originalUrl && Array.isArray(item.tags)));
    assert.ok(items.every((item) => !Object.hasOwn(item, "status") && !Object.hasOwn(item, "original_key")));
  }
  console.log(JSON.stringify({ path, status: r.status, rendering: "static", bytes: body.length }));
}
const missing = await fetch(new URL("/static-mode-missing-page-check", base));
assert.equal(missing.status, 404);
assert.equal(missing.headers.get("x-public-rendering"), "static");
const head = await fetch(new URL("/categories/anime-4k", base), { method: "HEAD", headers: { "x-isr": "1" } });
assert.equal(head.status, 200);
assert.equal(head.headers.get("x-public-rendering"), "static");
assert.equal((await head.text()).length, 0);
const alias = await fetch(new URL("/privacy", base), { redirect: "manual" });
assert.equal(alias.status, 308);
assert.equal(new URL(alias.headers.get("location")).pathname, "/privacy-policy");
console.log("Static public responses, catalogue, 404, HEAD and redirect checks passed.");
