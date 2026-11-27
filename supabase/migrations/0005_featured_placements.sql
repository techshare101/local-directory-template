-- 0005_featured_placements.sql
-- Paid "Featured" placement: time-boxed, operator-approved, honestly labelled.

alter table public.isabela_businesses
  add column if not exists featured_until timestamptz,
  add column if not exists featured_rank integer not null default 0,
  add column if not exists featured_note text not null default '';

create index if not exists isabela_idx_biz_featured_until
  on public.isabela_businesses (featured_until);

-- Purchase / upgrade requests. Public can insert; only the operator (service role)
-- can read or change them.
create table if not exists public.isabela_featured_requests (
  id uuid primary key default gen_random_uuid(),
  business_slug text not null default '',
  business_name text not null,
  contact_name text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  plan text not null default 'monthly',
  message text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists isabela_idx_featured_req_status
  on public.isabela_featured_requests (status, created_at desc);

alter table public.isabela_featured_requests enable row level security;

drop policy if exists "isabela insert featured request" on public.isabela_featured_requests;
create policy "isabela insert featured request" on public.isabela_featured_requests
  for insert with check (true);
