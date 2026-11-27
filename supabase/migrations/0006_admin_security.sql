-- 0006: admin hardening — durable login throttling + audit trail.
-- Both tables are service-role only: RLS on, zero policies.

create table if not exists public.isabela_admin_attempts (
  id bigserial primary key,
  ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists isabela_idx_admin_attempts_ip
  on public.isabela_admin_attempts (ip, created_at desc);

alter table public.isabela_admin_attempts enable row level security;

create table if not exists public.isabela_admin_log (
  id bigserial primary key,
  action text not null,
  entity_type text not null default '',
  entity_id text not null default '',
  detail jsonb not null default '{}'::jsonb,
  ip text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists isabela_idx_admin_log_created
  on public.isabela_admin_log (created_at desc);

alter table public.isabela_admin_log enable row level security;
