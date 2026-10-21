import "server-only";
import { unstable_cache } from "next/cache";

/**
 * Cache public database results without Cache Components' timer-based rendering.
 * Workers cannot reliably run that scheduler. Keep the same mutation tags and
 * a short TTL so transient database fallbacks recover quickly.
 */
export function cachedPublicQuery<T>(query: () => Promise<T>, name: string, args: unknown[], tags: string[]) {
  return unstable_cache(query, ["public-data-v1", name, JSON.stringify(args)], { tags, revalidate: 60 })();
}
