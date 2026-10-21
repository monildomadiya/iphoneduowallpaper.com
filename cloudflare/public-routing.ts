import { listingRewrite } from "../src/lib/listing-rewrite.ts";

export function publicSnapshotPath(url: URL) {
  const listing = listingRewrite(url);
  return listing ?? (url.pathname.replace(/\/+$/, "") || "/");
}

export function isApplicationRequest(request: Request) {
  const path = new URL(request.url).pathname;
  return request.method !== "GET" && request.method !== "HEAD" || /^\/(admin|api|auth)(\/|$)/.test(path);
}
