import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { publicSnapshotPath } from "../cloudflare/public-routing.ts";

const build = (await readFile(".next/BUILD_ID", "utf8")).trim();
const root = path.resolve(".next/server/app");
const prefix = `/_public/${build}`;
const out = path.resolve(`.open-next/assets${prefix}`);
await mkdir(out, { recursive: true });
const routes = {};
let notFound;
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { if (!entry.name.includes("segments") && !entry.name.startsWith("(")) await walk(file); continue; }
    if (!/\.(html|body)$/.test(entry.name)) continue;
    const relative = path.relative(root, file).replaceAll("\\", "/");
    const route = "/" + relative.replace(/\.(html|body)$/, "").replace(/^index$/, "");
    if (/^\/(admin|api|auth)(\/|$)/.test(route) || route.startsWith("/_global")) continue;
    const id = createHash("sha256").update(relative).digest("hex").slice(0, 20);
    const ext = entry.name.endsWith(".html") ? ".html" : ".bin";
    await cp(file, path.join(out, id + ext));
    const item = { html: `${prefix}/${id}${ext}` };
    const stem = file.replace(/\.(html|body)$/, "");
    try {
      const meta = JSON.parse(await readFile(stem + ".meta", "utf8"));
      item.type = meta.headers?.["content-type"] ?? meta.headers?.["Content-Type"];
      if (meta.status) item.status = meta.status;
    } catch { /* HTML defaults to text/html. */ }
    if (ext === ".html") {
      const content = await readFile(file, "utf8");
      if (!content.includes("</html>")) throw new Error(`Incomplete snapshot: ${route}`);
      try { await cp(stem + ".rsc", path.join(out, id + ".rsc")); item.rsc = `${prefix}/${id}.rsc`; } catch { /* Non-RSC routes. */ }
    }
    if (route === "/_not-found") notFound = item;
    else routes[route] = item;
  }
}
await walk(root);
if (!notFound) throw new Error("Static 404 snapshot missing");

const catalogue = JSON.parse(await readFile(path.join(root, "public-catalog.json.body"), "utf8"));
if (!catalogue.length || !routes["/public-catalog.json"]) throw new Error("Static public catalogue missing");

const sitemapPath = path.join(root, "sitemap.xml.body");
const sitemap = await readFile(sitemapPath, "utf8");
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const key = publicSnapshotPath(new URL(match[1].replaceAll("&amp;", "&")));
  if (!routes[key] || routes[key].status >= 400) throw new Error(`Sitemap URL has no successful static snapshot: ${key}`);
}
const routeManifest = JSON.parse(await readFile(".next/routes-manifest.json", "utf8"));
const redirects = routeManifest.redirects.map((rule) => ({ regex: rule.regex, destination: rule.destination, statusCode: rule.statusCode, params: [...rule.source.matchAll(/:([a-zA-Z0-9_]+)/g)].map((m) => m[1]), host: rule.has?.find((h) => h.type === "host")?.value }));
await writeFile(".open-next/public-manifest.json", JSON.stringify({ build, routes, notFound, redirects }));
console.log(`Published ${Object.keys(routes).length} static responses and ${catalogue.length} catalogue entries; every sitemap URL is covered.`);
