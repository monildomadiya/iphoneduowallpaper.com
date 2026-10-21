#!/usr/bin/env node
/**
 * Crawls every URL in the sitemap and lists <title>s, <h1>s and meta descriptions that appear on more
 * than one page — across English, Spanish and Turkish — plus pages that are not 200, are noindex
 * or canonicalise elsewhere.
 *
 *   node scripts/audit-duplicates.mjs                        # https://iphoneduowallpaper.com
 *   node scripts/audit-duplicates.mjs http://localhost:3000  # a local build (`npm run build && npm start`)
 */
const base = (process.argv[2] ?? "https://iphoneduowallpaper.com").replace(/\/$/, "");
const live = "https://iphoneduowallpaper.com";

const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .trim();

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
// A local build still writes production URLs into the sitemap; crawl them on the local server.
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]).replace(live, base));
console.log(`${urls.length} URLs in ${base}/sitemap.xml`);

const pages = [];
const problems = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    const response = await fetch(url, { redirect: "manual" });
    if (response.status !== 200) {
      problems.push(`${response.status} ${url}${response.headers.get("location") ? ` → ${response.headers.get("location")}` : ""}`);
      continue;
    }
    const html = await response.text();
    const title = decode(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "");
    const h1 = decode(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "");
    const description = decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "");
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]?.replace(live, base);
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) problems.push(`noindex ${url}`);
    if (canonical && canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) problems.push(`canonical ${url} → ${canonical}`);
    if (!title) problems.push(`no <title> ${url}`);
    if (!h1) problems.push(`no <h1> ${url}`);
    if (title.length > 65) problems.push(`title ${title.length} chars: ${url}`);
    pages.push({ url, title, h1, description });
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

let duplicates = 0;
for (const field of ["title", "h1", "description"]) {
  const groups = new Map();
  for (const page of pages) {
    if (!page[field]) continue;
    const key = page[field].toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), page.url]);
  }
  for (const [value, list] of groups) {
    if (list.length < 2) continue;
    duplicates += 1;
    console.log(`\nDuplicate ${field}: "${value}"`);
    for (const url of list) console.log(`  ${url}`);
  }
}

console.log(problems.length ? `\n${problems.join("\n")}` : "\nNo status, noindex or canonical problems.");
console.log(`\n${duplicates} duplicate group(s) across ${pages.length} pages.`);
process.exitCode = duplicates || problems.length ? 1 : 0;
