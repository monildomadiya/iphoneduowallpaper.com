# VPS migration: iphoneduowallpaper.com

Target supplied by the owner: `107.172.39.165`. The application was built and
installed on Ubuntu 22.04 on 2026-10-23 with Node 24.22.1, systemd and nginx.
The production release is `/srv/iphoneduowallpaper/releases/20261023-links`, exposed
through `/srv/iphoneduowallpaper/current`. Application secrets are provisioned
separately in the release's private `.env.local`.

Cloudflare DNS: apex A record points at `107.172.39.165`; `www` is a CNAME to
the apex. Both remain proxied. The former website Worker routes were detached;
the Worker deployment remains available for rollback. Full (strict) TLS is
enabled, backed by a Let's Encrypt certificate for both hostnames (expires
2027-01-21). An nginx reload hook is installed for certificate renewal, and
`certbot renew --dry-run --cert-name iphoneduowallpaper.com` passed.

Old PromptKing/BruttoNetto services were stopped and disabled. Their website
files, database directories, nginx configuration and previous PM2 dump were
archived under `/root/pre-wallpaper-backup-20261023` (root-only access).

Validation: Linux production build and TypeScript passed; direct origin and
live domain health checks passed. Wallpaper listing (including sorting and
Spanish/Turkish), a wallpaper detail, real category/device pages, search,
blog, sitemap, robots.txt, the admin login page and R2 images returned 200.
The protected admin dashboard redirects to login. A signed R2 download
returned 206 for a range request. Authenticated admin editing was not tested.

The 23 October SEO pass also corrected a development `NEXT_PUBLIC_SITE_URL`
that had leaked into all canonical and sitemap URLs. Production now explicitly
uses `https://iphoneduowallpaper.com`, and `src/lib/env.ts` rejects development
origins in production by falling back to that public URL. Ten regression checks
are available with `node scripts/check-site-url.mjs`. A live crawl verified all
421 sitemap pages return 200 with matching public canonicals and no duplicate
titles/descriptions. The 421-page sitemap and 142-page image sitemap were
submitted successfully to Search Console.

The readability release adds a local-image contrast tool and original practical
guide at `/wallpaper-readability`, linked from the homepage, help, wallpaper
details and footer. The sitemap now contains 422 URLs. Linux production build,
TypeScript, contrast-maths checks, live upload/controls and a 2670 × 1878 PNG
export passed. The prior `20261023-seo` release remains available for rollback.

The internal-linking release connects all 19 published guides to relevant tools
and collection pages, groups guide recommendations by topic, and adds guide
links to category/device pages, the maker, fit help and readability lab. Article
resource cards only include published posts. `20261023-readability` remains the
previous release for rollback.

`npm run deploy` still targets Cloudflare and can reattach the old Worker
routes. Use the VPS release procedure below for subsequent deployments.

## Inspect before installing

Obtain SSH access and inspect the OS, memory/disk, installed Node version and
binary path, existing virtual hosts/control panel, active services, and ports
80/443/3000. If the server has a control panel, configure its supported Node
application/reverse proxy instead of overwriting generated configuration.
The provided systemd and nginx templates assume Linux with systemd and nginx.
Use Node 24 (matching `.node-version`). Build on Linux; Windows dependencies
and `.next` output must not be copied into the Linux runtime.

## Application

1. Create a dedicated `iphoneduowallpaper` system user and release directories
   under `/srv/iphoneduowallpaper/releases/`. Transfer the project source to a
   new release, excluding `.git`, `node_modules`, `.next`, `.open-next`,
   `.wrangler`, `.variants`, `reports`, `.claude`, and local environment files.
2. Securely provision `.env.local` separately in that release, owned by the
   application user with mode `600`. Use the existing Supabase/R2 values and
   `IP_HASH_SALT`; see `.env.example`. Keep
   `NEXT_PUBLIC_SITE_URL=https://iphoneduowallpaper.com` and the existing image
   URL. Public variables must be present during **both build and runtime**.
   Leave `NEXT_PUBLIC_PUBLIC_MODE` and `NEXT_PUBLIC_VARIANTS_MODE` unset for
   normal Node hosting. Do not run the Cloudflare snapshot build on the VPS.
3. As the application user, run `npm ci --include=dev` and `npm run build` in
   the new release (`npm run build -- --webpack` was used for this migration).
   Keep the existing release available for rollback.
4. Point `/srv/iphoneduowallpaper/current` at the successful release. Confirm
   `/opt/node24/bin/node` is the correct Node 24 binary, then install the service unit.
   The application user needs write access to its release for the Next.js cache.
5. Start the service, check its journal, and request
   `http://localhost:3000/api/health`. It must return `{"ok":true}`. Also check
   the homepage, categories, wallpaper detail, search, a download, sitemap,
   and admin login. The health endpoint alone does not validate Supabase/R2.
   Verify the live canonical and both sitemap origins as well. Run
   `node scripts/seo-audit.mjs reports/seo-YYYY-MM-DD` after a deployment; it
   stops if the sitemap points outside the production origin.

## HTTPS and routing

1. Record current Cloudflare DNS, Worker routes/custom domains, SSL mode and
   relevant redirect/cache rules for rollback. Obtain a valid certificate
   covering both apex and `www` before cutover, using DNS validation if needed.
   The nginx template expects a Let's Encrypt certificate; adapt paths for an
   existing certificate. Never install that template before the files exist.
2. Install a separate virtual host, run `nginx -t`, and reload only if it passes.
   Test HTTPS directly against the VPS using `curl --resolve`, for example:
   `curl --resolve iphoneduowallpaper.com:443:107.172.39.165 https://iphoneduowallpaper.com/api/health`.
   Test the public routes listed above through HTTPS as well.
3. Point apex and `www` to the VPS and remove conflicting website DNS records
   (including stale AAAA records if IPv6 is not configured). A matching Worker
   route/custom domain can still intercept requests even after DNS changes;
   detach only this website's Worker bindings at cutover after origin checks pass.
4. Cloudflare DNS/proxy can remain in use with Full (strict) TLS. Preserve the
   `images` R2 custom domain and other unrelated records, including email.
   Keep the existing Supabase auth callback URLs and R2 CORS origins, since the
   production website URL is unchanged. Do not cache admin/auth/API responses.
5. Verify live HTTPS, redirects, images, download, search, admin login and a
   controlled content update. Confirm Node cache invalidation works without
   republishing a Worker. Check certificate auto-renewal and service auto-start.

The nginx template treats direct connections as the source of client IPs. If
Cloudflare proxying is enabled, configure nginx's real-IP module using the
current official Cloudflare IP ranges and `CF-Connecting-IP`, trusting only
those ranges. Do not trust arbitrary client-supplied forwarding headers.
Open only the required HTTP/HTTPS ports; keep Node bound to loopback.

Use the literal hostname `localhost` in both the service and nginx upstream.
In this Next.js version, NextURL normalizes `127.0.0.1` to `localhost`; using
the IP as the server hostname can cause middleware listing rewrites behind
HTTPS to be treated as external proxies to `https://localhost:3000`, producing
an SSL protocol error because the internal listener uses HTTP.

## Rollback

Keep the old Worker deployment available. If the cutover fails, restore the
saved DNS and Worker bindings. For a later Node release failure, restore the
previous `current` symlink and restart the application service. The database
and R2 storage remain shared throughout this migration; no data/schema change
is required for moving the website runtime.

The initial `20261023` release predates the SEO URL correction. Correct its
environment and rebuild it with the production URL guard before using it as
a future production release; its original static pages contain localhost URLs.

## Automatic deployment from GitHub

Pushing to `main` on GitHub releases the site without manual steps. On the VPS,
`iphoneduowallpaper-deploy.timer` runs [`auto-deploy.sh`](auto-deploy.sh) every
2 minutes. When `main` has a new commit it builds a new release beside the live
one (copying the live `.env.local`), switches `current`, restarts the service and
checks `/api/health`. A failed build leaves the live site untouched; a failed
health check restores the previous release. That commit is then skipped until
the next push. The four newest releases are kept for manual rollback.

The repository is public, so the server needs no GitHub credentials. Install or
update the deployer as root (the script is copied out of the repository so a
push cannot change it):

```bash
command -v git >/dev/null || apt-get install -y git
cd /tmp && for f in auto-deploy.sh iphoneduowallpaper-deploy.service iphoneduowallpaper-deploy.timer; do curl -fsSLO "https://raw.githubusercontent.com/monildomadiya/iphoneduowallpaper.com/main/deploy/vps/$f"; done
install -m 755 auto-deploy.sh /usr/local/bin/iphoneduowallpaper-deploy
install -m 644 iphoneduowallpaper-deploy.service iphoneduowallpaper-deploy.timer /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now iphoneduowallpaper-deploy.timer
```

Follow a deployment with `journalctl -u iphoneduowallpaper-deploy -f`. Run one
immediately with `systemctl start iphoneduowallpaper-deploy`. Pause automatic
deployments with `systemctl stop iphoneduowallpaper-deploy.timer`.

### Deploy immediately from GitHub Actions

[`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) runs on every
push to `main`. It connects over SSH with a key that the server locks to a single
forced command, [`deploy-trigger.sh`](deploy-trigger.sh), which runs the deployer
above, prints its log into the Actions run, and fails the run if the pushed commit
could not be released. The timer stays on as a fallback. One-time setup, as root
on the VPS:

```bash
curl -fsSL https://raw.githubusercontent.com/monildomadiya/iphoneduowallpaper.com/main/deploy/vps/deploy-trigger.sh -o /tmp/deploy-trigger.sh
install -m 755 /tmp/deploy-trigger.sh /usr/local/bin/iphoneduowallpaper-deploy-trigger
ssh-keygen -t ed25519 -N "" -C github-actions-deploy -f /root/github-deploy-key
install -d -m 700 /root/.ssh && echo "command=\"/usr/local/bin/iphoneduowallpaper-deploy-trigger\",restrict $(cat /root/github-deploy-key.pub)" >> /root/.ssh/authorized_keys
```

In GitHub → Settings → Secrets and variables → Actions, add two repository secrets:

- `VPS_SSH_KEY`: the full output of `cat /root/github-deploy-key` (then delete
  that file from the server with `rm /root/github-deploy-key`).
- `VPS_HOST_KEY`: the output of `cut -d' ' -f1,2 /etc/ssh/ssh_host_ed25519_key.pub`.

Optional repository variables: `VPS_HOST` (default `107.172.39.165`) and
`VPS_SSH_PORT` (default `22`). Re-run a deployment from the Actions tab with
**Run workflow**. To revoke access, remove the `github-actions-deploy` line from
`/root/.ssh/authorized_keys`.
