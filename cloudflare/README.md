# Cloudflare Workers deployment

This app needs OpenNext: admin authentication, Server Actions, downloads and database queries
cannot be deployed as a static export. `wrangler.jsonc` serves assets, binds an R2 cache bucket,
and uses SQLite Durable Objects for revalidation and tag invalidation.

OpenNext does not support Node.js Proxy yet, so session refresh uses `src/middleware.ts`
with the Edge runtime. Next.js marks this filename deprecated, but it remains supported.
The admin guard and Supabase session refresh are retained.
The Cloudflare build uses Webpack to avoid Windows Turbopack chunk-loading failures;
ordinary `npm run dev` and Node builds retain the default bundler.
R2 requests use Cloudflare's documented `aws4fetch` client to keep the Worker small; the
workstation image scripts can still use the AWS SDK. Wrangler minification is enabled.
Next.js 16.4.2 and OpenNext 1.20.12 are pinned together. Cache Components is disabled because
its rendering scheduler still hung dynamic requests on Workers during live verification.
Public queries use `unstable_cache` with a 60-second TTL, argument-specific keys and the existing
mutation tags. This retains shared R2 data caching and admin invalidation without the PPR scheduler.

## Before deployment

1. Apply `supabase/migrations/0002_variants.sql` in Supabase SQL Editor after `0001_init.sql`.
   It adds focal points and device variants. Builds fail with `column wallpapers.focal_x does not exist`
   until this migration has been applied.
2. Use Node 22 or 24. Install dependencies with `npm ci` (including dev dependencies).
3. Log in with `npx wrangler login` and create the separate cache bucket:

   ```bash
   npx wrangler r2 bucket create iphoneduowallpaper-next-cache
   ```

   The wallpaper image bucket is separate; do not replace or delete it.

## Environment variables

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
`NEXT_PUBLIC_SITE_URL=https://iphoneduowallpaper.com`, and `NEXT_PUBLIC_R2_PUBLIC_URL`
in the build environment. Locally, Next.js reads `.env.local`. Public values are baked into the
browser bundle; redeploy when changing them. The Cloudflare build script defaults the site URL
to the production domain to avoid publishing localhost canonical links.

At Worker runtime, set the two Supabase public variables above and the following secrets using
Workers Settings → Variables and Secrets, or `npx wrangler secret put NAME`:

- `SUPABASE_SECRET_KEY`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `IP_HASH_SALT`

`R2_BUCKET`, `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_R2_PUBLIC_URL` have public defaults in
`wrangler.jsonc`; change them if your production values differ. Never put private keys in that file.
Build-time secrets do not automatically become Worker runtime secrets.

## Build, verify, deploy

```bash
npm run typecheck
npm run build:cloudflare
npm run check:cloudflare
npm run deploy:cloudflare
```

Use `npm run preview` to build and run locally in the Workers runtime. Keep local runtime values
in an ignored `.dev.vars` file if required. Test `/api/health`, a wallpaper page, download,
`/admin/login`, and an authenticated admin edit before moving the domain.

The Worker name is `iphoneduowallpaper`. Production routes are configured for
`iphoneduowallpaper.com/*` and `www.iphoneduowallpaper.com/*`. These require proxied DNS records;
the existing Render CNAME records can remain because the Worker handles matching requests itself.
The routes fail closed rather than bypassing the app when a Workers limit is reached. The
`images` subdomain remains an R2 domain and is deliberately excluded from these route patterns.
Keep the Supabase auth callback URL and R2 upload CORS origin set to the production domain.

The routes were connected in Cloudflare and verified against the deployed `BUILD_ID` on both
hostnames. An alternative is Custom Domains, which requires resolving the existing CNAME conflict.
If retiring the old Render service, keep Cloudflare proxying enabled and replace its unused CNAME
targets with an originless placeholder DNS record before removing the Render hostname.

## GitHub automatic builds

Push the reviewed local changes, then connect this GitHub repository in Cloudflare Workers Builds.
Use the repository root, the production branch, and:

| Setting | Value |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy:cloudflare` |
| Node version (`NODE_VERSION`) | `22` |

Add the build variables listed above in Build settings; configure runtime secrets separately.
Do not use `next start` as the deploy command. OpenNext emits `.open-next/worker.js`.
Linux CI is preferred because OpenNext's Windows support is limited. On Windows the build script
uses directory junctions if the adapter cannot create directory symlinks; no system setting changes
or administrator privileges are needed for that fallback.

## Free-plan constraints and image processing

### Live reliability finding — October 21, 2026

The SEO crawl of 422 sitemap URLs (two concurrent requests, one retry on 5xx) recorded
186 HTTP 503 responses containing Cloudflare Error 1102, 233 HTTP 200 responses,
two HTTP 404 responses and one request failure. Separate sequential checks recovered
on a sampled blog page and robots.txt, so this is intermittent rather than a permanent outage.
The bundle-size check below does **not** validate runtime reliability. Do not treat a successful
deployment or a few smoke requests as proof that this SSR workload fits Workers Free.
Before relying on this hosting for indexing or an ad review, inspect Worker CPU/memory metrics
and reduce request-time rendering (for example, pre-render public content), or evaluate another
hosting plan. A paid subscription must be a separate owner decision. Raw crawl evidence is in
`reports/seo-2026-10-21/crawl.json`.

Workers Free currently allows a 3 MiB compressed Worker, 10 ms CPU per request, and
100,000 dynamic requests per day. Check the compressed size printed by the Wrangler dry run;
a successful Next.js build alone does not prove this app fits the free plan. The deploy script
runs this size check and stops if the compressed bundle exceeds 3 MiB. Runtime CPU
must also be checked with real requests. Static assets, R2, Durable Objects and Supabase have
their own quotas. This configuration does not subscribe to a paid plan.

Sharp uses native Node addons and cannot run inside a Worker. Workers builds therefore set
`NEXT_PUBLIC_VARIANTS_MODE=workstation`, exclude the renderer from the Worker, and show the
workstation command in the editor. Existing R2 device images continue to work. After an upload
or focal-point edit, run locally with the production `.env.local` credentials:

```bash
npm run variants -- build --stale
```

This writes the generated files to R2 and updates Supabase. Cached public pages may keep the old
variant metadata until their cache expires; after this job, save the wallpaper in admin to
invalidate its tags immediately. Node builds retain automatic background generation.

Official references: [OpenNext setup](https://opennext.js.org/cloudflare/get-started),
[caching](https://opennext.js.org/cloudflare/caching), and
[Workers limits](https://developers.cloudflare.com/workers/platform/limits/).
