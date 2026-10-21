-- =====================================================================
-- Per-device wallpaper files (iPhone Duo outer + inner, iPhone 18 Pro / Pro Max, 4K master, ZIP)
-- Run once in Supabase → SQL Editor after 0001 (safe to re-run).
-- =====================================================================

alter table public.wallpapers
  -- Where the subject sits (0–1 from the left / top); every crop is centred on it.
  add column if not exists focal_x real not null default 0.5 check (focal_x between 0 and 1),
  add column if not exists focal_y real not null default 0.5 check (focal_y between 0 and 1),
  -- Written by scripts/build-variants.mjs and the admin panel: keys, sizes and bytes of each file.
  add column if not exists variants jsonb not null default '{}'::jsonb,
  -- The top third is calm enough for the Lock Screen clock.
  add column if not exists lock_screen_friendly boolean not null default false;

-- Content edits bump updated_at (sitemap lastmod); the new columns are content too.
create or replace trigger wallpapers_updated_at
  before update of title, slug, description, category_id, tags, original_key, preview_key,
    thumb_key, width, height, file_size, mime_type, dominant_color, source_type, credit_name,
    credit_url, status, is_featured, seo_title, seo_description, published_at,
    focal_x, focal_y, variants, lock_screen_friendly
  on public.wallpapers
  for each row execute function public.set_updated_at();
