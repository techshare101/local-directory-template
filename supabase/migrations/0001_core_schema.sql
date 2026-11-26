-- Local Directory MVP — core schema (Villa Isabela, DR instance)
-- ISOLATED DEPLOYMENT: all tables are prefixed `isabela_` so they live safely
-- alongside an existing production project's public-schema tables without
-- any collision or data-sharing. No shared-project config changes required.
-- Scope: core directory only (defer Stripe + claim + auth-backed dashboards).

create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table if not exists public.isabela_categories (
  id text primary key,            -- stable slug e.g. 'health-medical'
  name text not null,
  description text not null default '',
  icon text not null default 'sparkles',  -- lucide icon name
  sort_order int not null default 0
);

-- ---------- locations ----------
create table if not exists public.isabela_locations (
  id text primary key,            -- slug e.g. 'villa-isabela'
  name text not null,
  region text not null default ''
);

-- ---------- businesses ----------
create table if not exists public.isabela_businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_id text references public.isabela_categories(id) on delete set null,
  location_id text references public.isabela_locations(id) on delete set null,
  -- profile fields
  description text not null default '',
  services text[] not null default '{}',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  price_min text not null default '',
  hours jsonb not null default 'null',
  -- media
  image_hero text not null default '',
  image_logo text not null default '',
  -- directories state
  claimed boolean not null default false,
  featured boolean not null default false,
  status text not null default 'listed',  -- listed | pending | rejected
  created_at timestamptz not null default now()
);

-- ---------- offers (coupons / deals) ----------
create table if not exists public.isabela_offers (
  id text primary key,            -- slug
  business_id uuid references public.isabela_businesses(id) on delete cascade,
  title text not null,
  description text not null default '',
  price text not null default '',
  code text not null default '',
  valid_until text not null default '',
  terms text not null default '',
  image text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- posts (local spotlight blog) ----------
create table if not exists public.isabela_posts (
  id text primary key,            -- slug
  business_id uuid references public.isabela_businesses(id) on delete set null,
  title text not null,
  excerpt text not null default '',
  cover text not null default '',
  body text not null default '',
  published_at timestamptz not null default now()
);

-- ---------- events ----------
create table if not exists public.isabela_events (
  id text primary key,            -- slug
  business_id uuid references public.isabela_businesses(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  venue text not null default '',
  description text not null default '',
  cover text not null default ''
);

-- ---------- enquiries (leads, no external side effect) ----------
create table if not exists public.isabela_enquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.isabela_businesses(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  message text not null default '',
  consent boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- submissions (add-business) ----------
create table if not exists public.isabela_submissions (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  category_id text references public.isabela_categories(id) on delete set null,
  location_id text references public.isabela_locations(id) on delete set null,
  description text not null default '',
  website text not null default '',
  email text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists isabela_idx_biz_cat on public.isabela_businesses(category_id);
create index if not exists isabela_idx_biz_loc on public.isabela_businesses(location_id);
create index if not exists isabela_idx_biz_claimed on public.isabela_businesses(claimed);
create index if not exists isabela_idx_biz_featured on public.isabela_businesses(featured);
create index if not exists isabela_idx_biz_status on public.isabela_businesses(status);
create index if not exists isabela_idx_offers_biz on public.isabela_offers(business_id);
create index if not exists isabela_idx_posts_biz on public.isabela_posts(business_id);
create index if not exists isabela_idx_events_biz on public.isabela_events(business_id);

-- RLS (anon can read listed businesses, categories, locations, offers, posts
-- and events; anon can insert enquiries and submissions — not update/delete).
alter table public.isabela_businesses enable row level security;
alter table public.isabela_categories enable row level security;
alter table public.isabela_locations enable row level security;
alter table public.isabela_offers enable row level security;
alter table public.isabela_posts enable row level security;
alter table public.isabela_events enable row level security;
alter table public.isabela_enquiries enable row level security;
alter table public.isabela_submissions enable row level security;

drop policy if exists "isabela read listed businesses" on public.isabela_businesses;
create policy "isabela read listed businesses" on public.isabela_businesses
  for select using (status = 'listed');
drop policy if exists "isabela read categories" on public.isabela_categories;
create policy "isabela read categories" on public.isabela_categories for select using (true);
drop policy if exists "isabela read locations" on public.isabela_locations;
create policy "isabela read locations" on public.isabela_locations for select using (true);
drop policy if exists "isabela read offers" on public.isabela_offers;
create policy "isabela read offers" on public.isabela_offers for select using (true);
drop policy if exists "isabela read posts" on public.isabela_posts;
create policy "isabela read posts" on public.isabela_posts for select using (true);
drop policy if exists "isabela read events" on public.isabela_events;
create policy "isabela read events" on public.isabela_events for select using (true);
drop policy if exists "isabela insert enquiries" on public.isabela_enquiries;
create policy "isabela insert enquiries" on public.isabela_enquiries for insert with check (true);
drop policy if exists "isabela insert submissions" on public.isabela_submissions;
create policy "isabela insert submissions" on public.isabela_submissions for insert with check (true);
