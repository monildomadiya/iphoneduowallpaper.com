-- =====================================================================
-- Ad management: per-placement control instead of one bag of slot IDs.
-- Run once in Supabase → SQL Editor after 0003 (safe to re-run).
--
-- Why: `ad_slots` could only hold "placement → slot ID". There was no way to switch one spot off
-- without deleting its ID, no way to choose the unit type (a banner where an in-article unit
-- belongs earns noticeably less), and `adsense_auto_ads` was stored but never read. The admin
-- panel now owns all of it, so the columns have to exist first.
-- =====================================================================

alter table public.site_settings
  -- { "home_top": { "enabled": true, "slot": "1234567890", "format": "display" }, ... }
  add column if not exists ad_placements jsonb not null default '{}'::jsonb,
  -- Auto ads density hint, e.g. '30s'. Null leaves the count to Google.
  add column if not exists adsense_frequency_hint text,
  -- Ask for each unit only as it nears the viewport. Raises viewability, which is what RPM follows.
  add column if not exists ads_lazy_load boolean not null default true,
  -- Ad stuffing is what gets ad serving limited; the admin panel refuses to save more than this.
  add column if not exists ads_max_per_page smallint not null default 4
    check (ads_max_per_page between 1 and 10),
  -- Draws outlined boxes where ads would go, for checking placement without live ads.
  add column if not exists ads_preview boolean not null default false;

comment on column public.site_settings.ad_placements is
  'Per-placement ad config written by Admin → Ads: enabled, slot, format, layout_key.';

-- Carry the old slot IDs over so nothing goes dark on deploy. Only runs while ad_placements is
-- still empty, so re-running this file never overwrites what the admin panel has saved since.
update public.site_settings
set ad_placements = (
  select coalesce(
    jsonb_object_agg(key, jsonb_build_object('enabled', true, 'slot', value)),
    '{}'::jsonb
  )
  from jsonb_each_text(ad_slots)
  where value <> ''
)
where id = 1
  and ad_placements = '{}'::jsonb
  and ad_slots <> '{}'::jsonb;
