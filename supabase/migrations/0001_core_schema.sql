-- Local Directory MVP — core schema (Villa Isabela, DR instance)
-- Scope: core directory only (defer Stripe + claim + auth-backed dashboards).
-- Run against a fresh Supabase/Postgres project.

create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table if not exists public.categories (
  id text primary key,            -- stable slug e.g. 'health-medical'
  name text not null,
  description text not null default '',
  icon text not null default 'sparkles',  -- lucide icon name
  sort_order int not null default 0
);

-- ---------- locations ----------
create table if not exists public.locations (
  id text primary key,            -- slug e.g. 'villa-isabela'
  name text not null,
  region text not null default ''
);

-- ---------- businesses ----------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_id text references public.categories(id) on delete set null,
  location_id text references public.locations(id) on delete set null,
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
create table if not exists public.offers (
  id text primary key,            -- slug
  business_id uuid references public.businesses(id) on delete cascade,
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
create table if not exists public.posts (
  id text primary key,            -- slug
  business_id uuid references public.businesses(id) on delete set null,
  title text not null,
  excerpt text not null default '',
  cover text not null default '',
  body text not null default '',
  published_at timestamptz not null default now()
);

-- ---------- events ----------
create table if not exists public.events (
  id text primary key,            -- slug
  business_id uuid references public.businesses(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  venue text not null default '',
  description text not null default '',
  cover text not null default ''
);

-- ---------- enquiries (leads, no external side effect) ----------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  message text not null default '',
  consent boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- submissions (add-business) ----------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  category_id text references public.categories(id) on delete set null,
  location_id text references public.locations(id) on delete set null,
  description text not null default '',
  website text not null default '',
  email text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists idx_businesses_cat on public.businesses(category_id);
create index if not exists idx_businesses_loc on public.businesses(location_id);
create index if not exists idx_businesses_claimed on public.businesses(claimed);
create index if not exists idx_businesses_featured on public.businesses(featured);
create index if not exists idx_businesses_status on public.businesses(status);
create index if not exists idx_offers_biz on public.offers(business_id);
create index if not exists idx_posts_biz on public.posts(business_id);
create index if not exists idx_events_biz on public.events(business_id);

-- RLS (defer fine-grained; anon can read listed, can insert enquiries/submissions)
alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.offers enable row level security;
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.enquiries enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "public read businesses" on public.businesses;
create policy "public read businesses" on public.businesses
  for select using (status = 'listed');
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "public read locations" on public.locations;
create policy "public read locations" on public.locations for select using (true);
drop policy if exists "public read offers" on public.offers;
create policy "public read offers" on public.offers for select using (true);
drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts for select using (true);
drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events for select using (true);
drop policy if exists "public insert enquiries" on public.enquiries;
create policy "public insert enquiries" on public.enquiries for insert with check (true);
drop policy if exists "public insert submissions" on public.submissions;
create policy "public insert submissions" on public.submissions for insert with check (true);
