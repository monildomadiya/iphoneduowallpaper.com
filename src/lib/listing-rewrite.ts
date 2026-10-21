/** Map public listing query strings onto cacheable route parameters. No cookies or user data. */
export function listingRewrite(url: URL): string | null {
  const match = /^(\/(?:es|tr))?\/(wallpapers|categories\/([a-z0-9-]+)|devices\/([a-z0-9-]+)|blog)\/?$/.exec(url.pathname);
  if (!match) return null;
  const prefix = match[1] ?? "";
  const section = match[2];
  // Translated blog indexes already use a static list of translated guides.
  if (prefix && section === "blog") return null;
  const kind = section === "wallpapers" ? "wallpapers" : section === "blog" ? "blog" : match[3] ? "category" : "device";
  const slug = match[3] ?? match[4] ?? "all";
  const raw = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(raw) ? Math.min(10000, Math.max(1, raw)) : 1;
  const sort = kind !== "blog" && url.searchParams.get("sort") === "popular" ? "popular" : "latest";
  return `${prefix}/cached-listings/${kind}/${slug}/${sort}/${page}`;
}
