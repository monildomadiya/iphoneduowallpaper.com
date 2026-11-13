import assert from "node:assert/strict";
import { listingRewrite } from "../src/lib/listing-rewrite.ts";

const rewrite = (path) => listingRewrite(new URL(path, "https://example.com"));
assert.equal(rewrite("/categories/anime-4k"), "/cached-listings/category/anime-4k/latest/1");
assert.equal(rewrite("/wallpapers?page=2&sort=popular&_rsc=prefetch"), "/cached-listings/wallpapers/all/popular/2");
assert.equal(rewrite("/es/devices/iphone-duo-inner-display?page=3"), "/es/cached-listings/device/iphone-duo-inner-display/latest/3");
assert.equal(rewrite("/tr/categories/dark?sort=popular"), "/tr/cached-listings/category/dark/popular/1");
assert.equal(rewrite("/zh/wallpapers?page=2"), "/zh/cached-listings/wallpapers/all/latest/2");
assert.equal(rewrite("/ko/categories/landscape?sort=popular&page=2"), "/ko/cached-listings/category/landscape/popular/2");
assert.equal(rewrite("/de/devices/iphone-18-pro"), "/de/cached-listings/device/iphone-18-pro/latest/1");
assert.equal(rewrite("/blog?page=2&sort=popular"), "/cached-listings/blog/all/latest/2");
assert.equal(rewrite("/wallpapers?page=-2"), "/cached-listings/wallpapers/all/latest/1");
assert.equal(rewrite("/wallpapers?page=999999"), "/cached-listings/wallpapers/all/latest/10000");
for (const path of ["/admin", "/api/download/id", "/auth/callback", "/wallpapers/example", "/wallpapers/all", "/cached-listings/category/a/latest/1", "/es/blog", "/zh/blog", "/ko/blog", "/de/blog", "/de/wallpapers/example", "/fr/wallpapers"]) assert.equal(rewrite(path), null, path);
console.log("Listing rewrite checks passed: pagination, sorting, locales, bounds and protected-route exclusions.");
