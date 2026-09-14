-- =====================================================================
-- iPhoneDuoWallpaper.com — database schema
-- Run once in Supabase → SQL Editor (safe to re-run).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Admin users (linked to Supabase Auth users)
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'admin' check (role in ('owner', 'admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

create or replace function public.has_admin_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = auth.uid() and a.role = any (roles)
  );
$$;

-- ---------------------------------------------------------------------
-- Taxonomies
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  cover_key text,
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  cover_key text,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace trigger collections_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  family text not null default 'iPhone',
  screen_label text,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  diagonal_in numeric(4, 1),
  ppi integer,
  description text,
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace trigger devices_updated_at
  before update on public.devices
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Wallpapers
-- ---------------------------------------------------------------------
create table if not exists public.wallpapers (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  category_id uuid references public.categories (id) on delete set null,
  tags text[] not null default '{}',
  original_key text not null,
  preview_key text not null,
  thumb_key text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  file_size bigint not null default 0,
  mime_type text not null default 'image/jpeg',
  dominant_color text not null default '#1d1d1f',
  source_type text not null default 'original'
    check (source_type in ('original', 'ai', 'licensed', 'public_domain')),
  credit_name text,
  credit_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  downloads bigint not null default 0,
  views bigint not null default 0,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector
);

create index if not exists wallpapers_status_published_idx on public.wallpapers (status, published_at desc);
create index if not exists wallpapers_status_downloads_idx on public.wallpapers (status, downloads desc);
create index if not exists wallpapers_category_idx on public.wallpapers (category_id);
create index if not exists wallpapers_featured_idx on public.wallpapers (is_featured) where is_featured;
create index if not exists wallpapers_tags_idx on public.wallpapers using gin (tags);
create index if not exists wallpapers_search_idx on public.wallpapers using gin (search);

create or replace function public.wallpapers_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.search :=
       setweight(to_tsvector('simple'::regconfig, coalesce(new.title, '')), 'A')
    || setweight(to_tsvector('simple'::regconfig, coalesce(array_to_string(new.tags, ' '), '')), 'B')
    || setweight(to_tsvector('simple'::regconfig, coalesce(new.description, '')), 'C');
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create or replace trigger wallpapers_before_insert
  before insert on public.wallpapers
  for each row execute function public.wallpapers_before_write();

create or replace trigger wallpapers_before_update
  before update of title, tags, description, status on public.wallpapers
  for each row execute function public.wallpapers_before_write();

-- Only content edits bump updated_at (download/view counters do not).
create or replace trigger wallpapers_updated_at
  before update of title, slug, description, category_id, tags, original_key, preview_key,
    thumb_key, width, height, file_size, mime_type, dominant_color, source_type, credit_name,
    credit_url, status, is_featured, seo_title, seo_description, published_at
  on public.wallpapers
  for each row execute function public.set_updated_at();

create table if not exists public.wallpaper_devices (
  wallpaper_id uuid not null references public.wallpapers (id) on delete cascade,
  device_id uuid not null references public.devices (id) on delete cascade,
  primary key (wallpaper_id, device_id)
);
create index if not exists wallpaper_devices_device_idx on public.wallpaper_devices (device_id);

create table if not exists public.wallpaper_collections (
  wallpaper_id uuid not null references public.wallpapers (id) on delete cascade,
  collection_id uuid not null references public.collections (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (wallpaper_id, collection_id)
);
create index if not exists wallpaper_collections_collection_idx on public.wallpaper_collections (collection_id);

-- ---------------------------------------------------------------------
-- Daily statistics + tracking
-- ---------------------------------------------------------------------
create table if not exists public.daily_stats (
  day date not null,
  wallpaper_id uuid not null references public.wallpapers (id) on delete cascade,
  views integer not null default 0,
  downloads integer not null default 0,
  primary key (day, wallpaper_id)
);
create index if not exists daily_stats_day_idx on public.daily_stats (day);

create or replace function public.track_wallpaper_event(p_wallpaper_id uuid, p_event text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day date := (now() at time zone 'utc')::date;
begin
  if p_event = 'download' then
    update public.wallpapers set downloads = downloads + 1
      where id = p_wallpaper_id and status = 'published';
    if found then
      insert into public.daily_stats as d (day, wallpaper_id, downloads)
        values (v_day, p_wallpaper_id, 1)
        on conflict (day, wallpaper_id) do update set downloads = d.downloads + 1;
    end if;
  elsif p_event = 'view' then
    update public.wallpapers set views = views + 1
      where id = p_wallpaper_id and status = 'published';
    if found then
      insert into public.daily_stats as d (day, wallpaper_id, views)
        values (v_day, p_wallpaper_id, 1)
        on conflict (day, wallpaper_id) do update set views = d.views + 1;
    end if;
  else
    raise exception 'invalid event: %', p_event;
  end if;
end;
$$;

revoke execute on function public.track_wallpaper_event(uuid, text) from public, anon, authenticated;
grant execute on function public.track_wallpaper_event(uuid, text) to service_role;

-- ---------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text,
  content text not null default '',
  cover_key text,
  tags text[] not null default '{}',
  author_name text not null default 'Editorial Team',
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_published_idx on public.posts (status, published_at desc);

create or replace function public.posts_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;
create or replace trigger posts_before_write
  before insert or update on public.posts
  for each row execute function public.posts_before_write();
create or replace trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Inbox: contact messages + content reports (DMCA etc.)
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_status_idx on public.contact_messages (status, created_at desc);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'copyright'
    check (kind in ('copyright', 'broken', 'inappropriate', 'other')),
  wallpaper_id uuid references public.wallpapers (id) on delete set null,
  page_url text,
  name text not null,
  email text not null,
  original_url text,
  details text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists reports_status_idx on public.reports (status, created_at desc);

-- ---------------------------------------------------------------------
-- Site settings (single row, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'iPhone Duo Wallpapers',
  tagline text not null default 'Beautiful wallpapers made for iPhone Duo.',
  contact_email text not null default 'contact@iphoneduowallpaper.com',
  announcement text,
  adsense_enabled boolean not null default false,
  adsense_client_id text,
  adsense_auto_ads boolean not null default false,
  ad_slots jsonb not null default '{}'::jsonb,
  ads_txt text,
  ga_measurement_id text,
  cookie_banner_enabled boolean not null default true,
  social_links jsonb not null default '{}'::jsonb,
  legal_entity text,
  legal_jurisdiction text not null default 'India',
  updated_at timestamptz not null default now()
);
create or replace trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Stats views (security_invoker → respects RLS of the caller)
-- ---------------------------------------------------------------------
create or replace view public.category_stats with (security_invoker = true) as
select
  c.id as category_id,
  (select count(*) from public.wallpapers w
     where w.category_id = c.id and w.status = 'published') as wallpaper_count,
  (select w.thumb_key from public.wallpapers w
     where w.category_id = c.id and w.status = 'published'
     order by w.published_at desc nulls last limit 1) as latest_thumb_key
from public.categories c;

create or replace view public.collection_stats with (security_invoker = true) as
select
  c.id as collection_id,
  (select count(*) from public.wallpaper_collections wc
     join public.wallpapers w on w.id = wc.wallpaper_id
     where wc.collection_id = c.id and w.status = 'published') as wallpaper_count,
  (select w.thumb_key from public.wallpaper_collections wc
     join public.wallpapers w on w.id = wc.wallpaper_id
     where wc.collection_id = c.id and w.status = 'published'
     order by w.published_at desc nulls last limit 1) as latest_thumb_key
from public.collections c;

create or replace view public.device_stats with (security_invoker = true) as
select
  d.id as device_id,
  (select count(*) from public.wallpaper_devices wd
     join public.wallpapers w on w.id = wd.wallpaper_id
     where wd.device_id = d.id and w.status = 'published') as wallpaper_count,
  (select w.thumb_key from public.wallpaper_devices wd
     join public.wallpapers w on w.id = wd.wallpaper_id
     where wd.device_id = d.id and w.status = 'published'
     order by w.published_at desc nulls last limit 1) as latest_thumb_key
from public.devices d;

-- ---------------------------------------------------------------------
-- Admin dashboard stats
-- ---------------------------------------------------------------------
create or replace function public.admin_dashboard_stats(p_days integer default 30)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_today date := (now() at time zone 'utc')::date;
  result json;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select json_build_object(
    'wallpapers_total', (select count(*) from public.wallpapers),
    'wallpapers_published', (select count(*) from public.wallpapers where status = 'published'),
    'wallpapers_draft', (select count(*) from public.wallpapers where status = 'draft'),
    'downloads_total', (select coalesce(sum(downloads), 0) from public.wallpapers),
    'views_total', (select coalesce(sum(views), 0) from public.wallpapers),
    'categories_total', (select count(*) from public.categories),
    'collections_total', (select count(*) from public.collections),
    'posts_published', (select count(*) from public.posts where status = 'published'),
    'messages_new', (select count(*) from public.contact_messages where status = 'new'),
    'reports_open', (select count(*) from public.reports where status = 'open'),
    'series', (
      select coalesce(json_agg(json_build_object(
               'day', s.day, 'downloads', s.downloads, 'views', s.views) order by s.day), '[]'::json)
      from (
        select g.day::date as day,
               coalesce(sum(ds.downloads), 0)::bigint as downloads,
               coalesce(sum(ds.views), 0)::bigint as views
        from generate_series(
               (v_today - (greatest(p_days, 1) - 1))::timestamp,
               v_today::timestamp,
               interval '1 day') as g(day)
        left join public.daily_stats ds on ds.day = g.day::date
        group by g.day
      ) s
    )
  ) into result;

  return result;
end;
$$;

revoke execute on function public.admin_dashboard_stats(integer) from public, anon;
grant execute on function public.admin_dashboard_stats(integer) to authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.devices enable row level security;
alter table public.wallpapers enable row level security;
alter table public.wallpaper_devices enable row level security;
alter table public.wallpaper_collections enable row level security;
alter table public.daily_stats enable row level security;
alter table public.posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.reports enable row level security;
alter table public.site_settings enable row level security;

-- admin_users
drop policy if exists admin_users_select on public.admin_users;
create policy admin_users_select on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists admin_users_owner_insert on public.admin_users;
create policy admin_users_owner_insert on public.admin_users
  for insert to authenticated with check ((select public.has_admin_role(array['owner'])));
drop policy if exists admin_users_owner_update on public.admin_users;
create policy admin_users_owner_update on public.admin_users
  for update to authenticated
  using ((select public.has_admin_role(array['owner'])))
  with check ((select public.has_admin_role(array['owner'])));
drop policy if exists admin_users_owner_delete on public.admin_users;
create policy admin_users_owner_delete on public.admin_users
  for delete to authenticated using ((select public.has_admin_role(array['owner'])));

-- categories / collections / devices: public read (active), admin write
do $$
declare
  t text;
begin
  foreach t in array array['categories', 'collections', 'devices'] loop
    execute format('drop policy if exists %1$s_public_read on public.%1$s', t);
    execute format('create policy %1$s_public_read on public.%1$s for select to anon, authenticated
                    using (is_active or (select public.is_admin()))', t);
    execute format('drop policy if exists %1$s_admin_insert on public.%1$s', t);
    execute format('create policy %1$s_admin_insert on public.%1$s for insert to authenticated
                    with check ((select public.is_admin()))', t);
    execute format('drop policy if exists %1$s_admin_update on public.%1$s', t);
    execute format('create policy %1$s_admin_update on public.%1$s for update to authenticated
                    using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('drop policy if exists %1$s_admin_delete on public.%1$s', t);
    execute format('create policy %1$s_admin_delete on public.%1$s for delete to authenticated
                    using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- wallpapers
drop policy if exists wallpapers_public_read on public.wallpapers;
create policy wallpapers_public_read on public.wallpapers
  for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));
drop policy if exists wallpapers_admin_insert on public.wallpapers;
create policy wallpapers_admin_insert on public.wallpapers
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists wallpapers_admin_update on public.wallpapers;
create policy wallpapers_admin_update on public.wallpapers
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists wallpapers_admin_delete on public.wallpapers;
create policy wallpapers_admin_delete on public.wallpapers
  for delete to authenticated using ((select public.is_admin()));

-- join tables
do $$
declare
  t text;
begin
  foreach t in array array['wallpaper_devices', 'wallpaper_collections'] loop
    execute format('drop policy if exists %1$s_public_read on public.%1$s', t);
    execute format('create policy %1$s_public_read on public.%1$s for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists %1$s_admin_insert on public.%1$s', t);
    execute format('create policy %1$s_admin_insert on public.%1$s for insert to authenticated
                    with check ((select public.is_admin()))', t);
    execute format('drop policy if exists %1$s_admin_update on public.%1$s', t);
    execute format('create policy %1$s_admin_update on public.%1$s for update to authenticated
                    using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('drop policy if exists %1$s_admin_delete on public.%1$s', t);
    execute format('create policy %1$s_admin_delete on public.%1$s for delete to authenticated
                    using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- daily_stats: admins read; writes only through track_wallpaper_event()
drop policy if exists daily_stats_admin_read on public.daily_stats;
create policy daily_stats_admin_read on public.daily_stats
  for select to authenticated using ((select public.is_admin()));

-- posts
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts
  for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));
drop policy if exists posts_admin_insert on public.posts;
create policy posts_admin_insert on public.posts
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists posts_admin_update on public.posts;
create policy posts_admin_update on public.posts
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists posts_admin_delete on public.posts;
create policy posts_admin_delete on public.posts
  for delete to authenticated using ((select public.is_admin()));

-- contact_messages / reports: owners + admins only (inserts happen server-side)
do $$
declare
  t text;
begin
  foreach t in array array['contact_messages', 'reports'] loop
    execute format('drop policy if exists %1$s_admin_read on public.%1$s', t);
    execute format('create policy %1$s_admin_read on public.%1$s for select to authenticated
                    using ((select public.has_admin_role(array[''owner'', ''admin''])))', t);
    execute format('drop policy if exists %1$s_admin_update on public.%1$s', t);
    execute format('create policy %1$s_admin_update on public.%1$s for update to authenticated
                    using ((select public.has_admin_role(array[''owner'', ''admin''])))
                    with check ((select public.has_admin_role(array[''owner'', ''admin''])))', t);
    execute format('drop policy if exists %1$s_admin_delete on public.%1$s', t);
    execute format('create policy %1$s_admin_delete on public.%1$s for delete to authenticated
                    using ((select public.has_admin_role(array[''owner'', ''admin''])))', t);
  end loop;
end;
$$;

-- site_settings
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (true);
drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_admin_update on public.site_settings
  for update to authenticated
  using ((select public.has_admin_role(array['owner', 'admin'])))
  with check ((select public.has_admin_role(array['owner', 'admin'])));

-- ---------------------------------------------------------------------
-- Grants (RLS above decides which rows are visible / writable)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant select on
  public.categories, public.collections, public.devices, public.wallpapers,
  public.wallpaper_devices, public.wallpaper_collections, public.posts, public.site_settings,
  public.category_stats, public.collection_stats, public.device_stats
to anon, authenticated;

grant insert, update, delete on
  public.categories, public.collections, public.devices, public.wallpapers,
  public.wallpaper_devices, public.wallpaper_collections, public.posts
to authenticated;

grant select, insert, update, delete on public.admin_users to authenticated;
grant select, update, delete on public.contact_messages, public.reports to authenticated;
grant select on public.daily_stats to authenticated;
grant update on public.site_settings to authenticated;

grant all on all tables in schema public to service_role;
