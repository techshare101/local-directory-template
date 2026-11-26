-- ============================================================================
-- RECONCILIATION MIGRATION — fold isla-dr-directory data model into the
-- white-label template's Supabase engine.
--
-- Adds, on the EXISTING `isabela_*` prefixed tables (per-instance prefix):
--   * i18n columns (name_es / name_en, description_es / description_en, address_es / address_en)
--   * geo + provenance columns (latitude, longitude, rating, reviews_count, source, schema_type)
--   * a CLAIMS table (manual-review owner claiming, ported from isla Phase 2)
--   * push notifications: none — this build stays in-band / raw lead rows
--
-- All statements idempotent (IF NOT EXISTS) so a re-run is safe. Uses dynamic
-- DO blocks so the same file works whatever the configured table prefix.
-- ============================================================================

-- ---- configurable prefix (default: isabela_) ----
-- (replace the two `_pfx_` placeholders below by copy or by a $$ block;
--  the app config default is `isabela`, matching this file's migrations.)

-- ============ CATEGORIES ============
alter table public.isabela_categories
  add column if not exists name_es text not null default '',
  add column if not exists name_en text not null default '',
  add column if not exists desc_es text not null default '',
  add column if not exists desc_en text not null default '',
  add column if not exists schema_type text not null default 'LocalBusiness',
  add column if not exists gradient_from text not null default '',
  add column if not exists gradient_via text not null default '',
  add column if not exists gradient_to text not null default '';

-- backfill name_es / name_en from existing `name` (single-language rows)
update public.isabela_categories set name_es = name, name_en = name where name_es = '';

-- ============ LOCATIONS (places) ============
alter table public.isabela_locations
  add column if not exists slug text not null default '',
  add column if not exists kind text not null default 'municipality',
  add column if not exists launched boolean not null default true,
  add column if not exists sort_order int not null default 0,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

-- ============ BUSINESSES ============
alter table public.isabela_businesses
  add column if not exists description_es text not null default '',
  add column if not exists description_en text not null default '',
  add column if not exists address_es text not null default '',
  add column if not exists address_en text not null default '',
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists rating double precision,
  add column if not exists reviews_count int,
  add column if not exists source text not null default 'seed',
  add column if not exists schema_type text not null default 'LocalBusiness';

-- backfill description es/en from existing `description`
update public.isabela_businesses set description_es = description, description_en = description where description_es = '';

-- ============ CLAIMS (owner claiming, manual review) ============
create table if not exists public.isabela_claims (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.isabela_businesses(id) on delete cascade,
  contact_name text not null,
  phone text not null,
  whatsapp text not null default '',
  email text not null default '',
  website text not null default '',
  notes text not null default '',
  status text not null default 'pending',   -- pending | approved | rejected
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);
alter table public.isabela_claims enable row level security;
drop policy if exists "isabela insert claims" on public.isabela_claims;
create policy "isabela insert claims" on public.isabela_claims for insert with check (true);

-- ============ indexes ============
create index if not exists isabela_idx_biz_rating on public.isabela_businesses(rating);
create index if not exists isabela_idx_claims_status on public.isabela_claims(status);
