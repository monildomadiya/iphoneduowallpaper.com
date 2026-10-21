import assert from "node:assert/strict";

const base = process.argv[2];
assert.ok(base?.startsWith("http"), "Usage: node scripts/check-public-listings.mjs https://example.com");
const cases = [
  ["/categories/anime-4k", "en"],
  ["/categories/dark?sort=popular", "en"],
  ["/wallpapers?page=2", "en"],
  ["/wallpapers?page=2&sort=popular", "en"],
  ["/devices/iphone-duo-inner-display?page=2", "en"],
  ["/es/categories/dark", "es"],
  ["/tr/wallpapers?page=2", "tr"],
  ["/blog?page=2", "en"],
];
for (const [path, lang] of cases) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60000) });
  const html = await response.text();
  assert.equal(response.status, 200, path);
  assert.ok(html.includes(`<html lang="${lang}"`), `${path}: wrong language`);
  assert.ok(html.includes("<h1") && html.includes("</html>"), `${path}: incomplete HTML`);
  assert.ok(!/Error 1102|Worker exceeded resource limits|Application error:/.test(html), path);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical && !canonical.includes("cached-listings"), `${path}: internal canonical leaked`);
  if (path.startsWith("/wallpapers?page=2")) {
    assert.ok(canonical.endsWith("/wallpapers?page=2"));
    assert.ok(html.includes("Page 2 of"), "Wrong pagination content");
  }
  if (path.includes("sort=popular")) assert.match(html, /aria-selected="true"[^>]*>Most downloaded<\/a>/);
  console.log(JSON.stringify({ path, status: response.status, bytes: html.length, canonical }));
}
for (const path of ["/categories/anime-4k", "/wallpapers?page=2&sort=popular", "/es/categories/dark"]) {
  const response = await fetch(new URL(path, base), { headers: { RSC: "1" }, signal: AbortSignal.timeout(60000) });
  const body = await response.text();
  assert.equal(response.status, 200, `${path}: RSC status`);
  assert.match(response.headers.get("content-type") ?? "", /text\/x-component/);
  assert.ok(body.length > 500, `${path}: empty RSC response`);
  console.log(JSON.stringify({ path, rsc: true, bytes: body.length }));
}
console.log("Public listing HTML, metadata, locale, sorting, pagination and RSC checks passed.");
