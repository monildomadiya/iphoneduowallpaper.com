import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import shardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

const config = defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
  tagCache: shardedTagCache({ baseShardSize: 1 }),
  // Serve ISR/SSG hits in the routing layer without starting NextServer.
  enableCacheInterception: true,
});

// Avoid Turbopack's Windows chunk paths in the deployed Workers runtime.
config.buildCommand = "npm run build -- --webpack";

export default config;
