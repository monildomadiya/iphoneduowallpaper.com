/* eslint-disable @typescript-eslint/ban-ts-comment -- Generated modules may exist locally but are absent during a clean Next build. */
// @ts-ignore OpenNext generates this module before Wrangler bundles this entry point.
import nextWorker from "../.open-next/worker.js";
// @ts-ignore The public snapshot manifest is generated after the Next.js build.
import snapshotManifest from "../.open-next/public-manifest.json";
// @ts-ignore OpenNext generates these Durable Object exports at build time.
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "../.open-next/worker.js";
import { isApplicationRequest, publicSnapshotPath } from "./public-routing";

interface Snapshot { html: string; rsc?: string; type?: string; status?: number }
interface Redirect { regex: string; destination: string; statusCode: number; params: string[]; host?: string }
interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }
interface Context { waitUntil(promise: Promise<unknown>): void }

const worker = {
  async fetch(request: Request, env: Env, ctx: Context) {
    if (isApplicationRequest(request)) return nextWorker.fetch(request, env, ctx);
    const url = new URL(request.url);
    const manifest = snapshotManifest as { routes: Record<string, Snapshot>; notFound: Snapshot; redirects: Redirect[] };
    for (const rule of manifest.redirects) {
      if (rule.host && rule.host !== url.hostname) continue;
      const match = new RegExp(rule.regex).exec(url.pathname);
      if (!match) continue;
      let destination = rule.destination;
      rule.params.forEach((name, index) => { destination = destination.replace(new RegExp(`:${name}[+*]?`, "g"), match[index + 1] ?? ""); });
      const target = new URL(destination, url.origin);
      if (!target.search) target.search = url.search;
      return Response.redirect(target.href, rule.statusCode);
    }
    // Next static JS/CSS/fonts are already handled by Workers Static Assets before this handler.
    if (url.pathname.startsWith("/_next/")) return env.ASSETS.fetch(request);
    const path = publicSnapshotPath(url);
    const entry = manifest.routes[path];
    const snapshot = entry ?? manifest.notFound;
    const isRsc = request.headers.get("rsc") === "1";
    const asset = isRsc && snapshot.rsc ? snapshot.rsc : snapshot.html;
    const assetUrl = new URL(asset, url.origin);
    const response = await env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    if (!response.ok) return new Response("The published page is unavailable. Please try again shortly.", { status: 503 });
    const headers = new Headers(response.headers);
    headers.set("Content-Type", isRsc && snapshot.rsc ? "text/x-component; charset=utf-8" : snapshot.type ?? "text/html; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    headers.set("Vary", "RSC, Next-Router-State-Tree, Next-Router-Prefetch");
    headers.set("X-Public-Rendering", "static");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    if (path === "/search" || /^\/(es|tr)\/search$/.test(path)) headers.set("X-Robots-Tag", "noindex, follow");
    if (path === "/public-catalog.json") headers.set("X-Robots-Tag", "noindex");
    const status = entry ? snapshot.status ?? 200 : 404;
    if (status === 404) headers.set("X-Robots-Tag", "noindex, follow");
    return new Response(request.method === "HEAD" ? null : response.body, { status, headers });
  },
};
export default worker;
