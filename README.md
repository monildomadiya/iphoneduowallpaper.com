# iPhoneDuoWallpaper.com

A fast, Apple-inspired wallpaper website for **iPhone Duo** (outer 1398 × 2034 and inner 2670 × 1878 displays), iPhone 18 Pro and iPhone 18 Pro Max — with a professional admin panel and everything needed for a Google AdSense application.

| Layer | Technology |
| --- | --- |
| Web app | Next.js 16 (App Router, Cache Components, Server Actions), React 19, Tailwind CSS 4 |
| Database & auth | Supabase (Postgres + Row Level Security + Auth) |
| Image storage & CDN | Cloudflare R2 (direct browser uploads via presigned URLs) |
| Hosting | Render (Node web service) |

---

## Features

**Public website**

- Apple-style design with light/dark mode, frosted-glass navigation and CSS device mockups of iPhone Duo (folded and unfolded) and iPhone 18 Pro Max
- Wallpaper pages with a live preview switcher (Duo Outer / Duo Inner / 18 Pro Max × Lock Screen / Home Screen), a “Screen fit” check for every device, one-tap download, “View full size” and share
- Categories, curated collections, device pages, full-text search, sorting and pagination
- Blog / guides with Markdown (3 helpful starter articles included)
- AdSense-ready pages: About, Contact (form), Privacy Policy, Terms of Use, Cookie Policy, Disclaimer, DMCA & Copyright (report form)
- SEO: per-page metadata, canonical URLs, Open Graph images, `sitemap.xml`, `robots.txt`, JSON-LD (WebSite, Organization, Breadcrumbs, ImageObject with license info, BlogPosting, FAQ)
- `ads.txt` and AdSense slots managed from the admin panel, cookie notice, optional Google Analytics 4
- Download and view counters with bot filtering and rate limiting

**Admin panel (`/admin`)**

- Secure sign-in with Supabase Auth, password reset, roles (owner / admin / editor)
- Dashboard: totals, 30-day downloads & views chart, top wallpapers, recent uploads and an **AdSense readiness checklist**
- Bulk upload: drag & drop many images; previews, 9:16 thumbnails and dominant colors are generated in the browser and uploaded straight to R2 with progress bars
- Wallpaper editor: title, slug, description, category, devices, collections, tags, featured, source & credit, SEO title/description with a Google preview, replace image, delete
- Bulk publish / unpublish / feature / delete, filters and search
- Categories, collections and devices manager (covers, SEO fields, ordering, visibility)
- Blog editor with Markdown preview
- Inbox for contact messages and DMCA / content reports (one click to unpublish a reported wallpaper)
- Ads & AdSense settings (publisher ID, auto ads, 8 ad placements, ads.txt) and site settings (brand, analytics, legal details, social links)

---

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (choose a region close to your visitors, e.g. Mumbai).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and run it.
3. Run [`supabase/seed.sql`](supabase/seed.sql) the same way. It adds the iPhone Duo and iPhone 18 Pro devices, 10 categories, 5 collections and 3 guides (edit them later in the admin panel).
4. **Authentication → Sign In / Providers → Email**: turn **off** “Allow new users to sign up”. Admin accounts are created with the script below.
5. **Authentication → URL Configuration**:
   - Site URL: `https://iphoneduowallpaper.com`
   - Redirect URLs: `https://iphoneduowallpaper.com/auth/callback` and `http://localhost:3000/auth/callback`
6. **Project Settings → API Keys**: copy the project URL, the **publishable** key and the **secret** key.

## 2. Cloudflare R2

1. **R2 → Create bucket** named `iphoneduowallpaper`.
2. **Bucket → Settings → Public access → Custom domains**: connect `images.iphoneduowallpaper.com` (your domain must be on Cloudflare). This is your `NEXT_PUBLIC_R2_PUBLIC_URL`. Cloudflare's CDN caches the images automatically.
3. **Bucket → Settings → CORS policy**: paste [`cloudflare/r2-cors.json`](cloudflare/r2-cors.json). This lets the admin panel upload directly from the browser.
4. **R2 → Manage API tokens → Create API token** with **Object Read & Write** permission for this bucket. Copy the Access Key ID, Secret Access Key and your Account ID.

## 3. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run create-admin -- you@example.com "a-strong-password" "Your Name" owner
npm run dev
```

Open <http://localhost:3000> and sign in at <http://localhost:3000/admin>.

Useful scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## 4. Deploy to Render

1. Push this project to a GitHub repository.
2. In Render choose **New → Blueprint** and select the repository ([`render.yaml`](render.yaml) is included), or create a **Web Service** manually:
   - Build command: `npm ci --include=dev && npm run build`
   - Start command: `npm run start`
   - Health check path: `/api/health`
3. Add the environment variables from `.env.example`. `NEXT_PUBLIC_*` values are baked in at build time, so **redeploy after changing them**.
4. **Settings → Custom domains**: add `iphoneduowallpaper.com` and `www.iphoneduowallpaper.com`, then create the DNS records Render shows you (in Cloudflare, keep them as “DNS only” until the certificate is issued).
5. Use at least the **Starter** plan. Free instances sleep when idle, which makes the first visit slow for readers, Google and the AdSense reviewer.
6. Keep **one instance**. Page caches live in memory, so admin edits refresh the site instantly on that instance.

## 5. Google AdSense

**Before applying**

- [ ] Site is live on `https://iphoneduowallpaper.com` (not the `onrender.com` address)
- [ ] 30+ published wallpapers, each with a unique title and a 2–3 sentence description
- [ ] 5+ helpful blog guides (3 are included — review them and add more)
- [ ] Contact email in **Admin → Site settings** is a real inbox you check
- [ ] Legal details (owner name, jurisdiction) filled in — they appear in the Terms and Privacy Policy
- [ ] Only wallpapers you created, generated or have a license to share (use the Source & credit fields)

**Apply and connect**

1. Sign up at [adsense.google.com](https://adsense.google.com) and add your site.
2. In **Admin → Ads & AdSense** paste your publisher ID (`ca-pub-…`) and save. The site-verification meta tag and `/ads.txt` are added automatically.
3. If AdSense asks for the code snippet, switch on **Serve ads** — the official script loads on public pages only.
4. After approval: either enable Auto ads in AdSense, or create display ad units and paste their slot IDs into the placements.
5. In AdSense **Privacy & messaging**, create a consent message for visitors from the EEA, UK and Switzerland.

**Stay compliant**

- Never click your own ads. Ads are labeled “Advertisement”, never shown on admin, login or error pages, and kept away from download buttons.
- Handle copyright notices in **Admin → Reports** quickly.

## Project structure

```
src/
  app/
    (site)/          public pages (home, wallpapers, categories, collections, devices, blog, legal pages)
    admin/           admin panel (login + (panel) routes and server actions)
    api/             download redirect, view tracking, health check
    ads.txt/         dynamic ads.txt
    sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
  components/        site, wallpaper, admin and ads components
  lib/
    data/            cached public queries ("use cache" + tags)
    admin/           admin queries, slug helpers, browser image pipeline
    supabase/        public, server (session), service and proxy clients
    r2.ts            presigned uploads/downloads for Cloudflare R2
  proxy.ts           refreshes the Supabase session and protects /admin
supabase/            SQL schema (tables, RLS, views, functions) and seed data
cloudflare/          R2 CORS policy
scripts/             create-admin
```

## How caching works

Public data is cached with Next.js Cache Components (`"use cache"`, `cacheLife`, `cacheTag`). Every admin change calls `updateTag(...)`, so visitors see updates on their next page view, while untouched pages are served from cache in milliseconds.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| “Supabase environment variables are missing” | Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` also work) on the server, then redeploy. |
| Upload fails with “Upload blocked…CORS” | Add the R2 CORS policy and make sure your site origin is listed. |
| Images don’t show | Check `NEXT_PUBLIC_R2_PUBLIC_URL` (no trailing slash), then redeploy. |
| “This account does not have access” | Run `npm run create-admin` for that email — it adds the `admin_users` row. |
| Contact form or download counts don’t save | Set `SUPABASE_SECRET_KEY` on the server. |
| Password reset link doesn’t work | Add `/auth/callback` to Supabase redirect URLs and open the link in the same browser. |
| Changes to `NEXT_PUBLIC_*` variables have no effect | Redeploy — they are applied at build time. |

---

iPhone, iPhone Duo and iOS are trademarks of Apple Inc. This project is not affiliated with Apple.
