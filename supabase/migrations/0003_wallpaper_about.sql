-- =====================================================================
-- "About this wallpaper": hand-written copy for one image, in Markdown.
-- Run once in Supabase → SQL Editor after 0002 (safe to re-run).
--
-- Why: every wallpaper page carried ~108 unique words, the rest shared with 457 other pages,
-- which is what an AdSense review reads as low-value templated content. `description` is the
-- short card/meta line and is capped at 2000 characters; this column is the long version a
-- person writes about this picture alone.
-- =====================================================================

alter table public.wallpapers
  add column if not exists about text;

comment on column public.wallpapers.about is
  'Markdown shown under "About this wallpaper" on the wallpaper page. Written by hand in the admin panel.';

-- Search: title (A) and tags (B) outrank the prose; `about` sits with `description` at C.
create or replace function public.wallpapers_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.search :=
       setweight(to_tsvector('simple'::regconfig, coalesce(new.title, '')), 'A')
    || setweight(to_tsvector('simple'::regconfig, coalesce(array_to_string(new.tags, ' '), '')), 'B')
    || setweight(to_tsvector('simple'::regconfig, coalesce(new.description, '')), 'C')
    || setweight(to_tsvector('simple'::regconfig, coalesce(new.about, '')), 'C');
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

-- Editing only `about` must still rebuild the search vector…
create or replace trigger wallpapers_before_update
  before update of title, tags, description, about, status on public.wallpapers
  for each row execute function public.wallpapers_before_write();

-- …and still bump updated_at, which the sitemap publishes as lastmod.
create or replace trigger wallpapers_updated_at
  before update of title, slug, description, about, category_id, tags, original_key, preview_key,
    thumb_key, width, height, file_size, mime_type, dominant_color, source_type, credit_name,
    credit_url, status, is_featured, seo_title, seo_description, published_at,
    focal_x, focal_y, variants, lock_screen_friendly
  on public.wallpapers
  for each row execute function public.set_updated_at();

-- Existing rows keep a null `about`; the wallpaper page renders the section only when it is set.
