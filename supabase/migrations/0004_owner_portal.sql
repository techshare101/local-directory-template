-- 0004: Owner portal — profile editing + photo uploads after a claim is approved.
--
-- Owner access model: on claim approval the server mints a long random token
-- stored on the business row. The owner receives a link /owner/<token> over
-- WhatsApp or email (no password, no email deliverability dependency — the DR
-- realistic path). Token is single-purpose (edit this one listing), expiring
-- after 90 days, and revocable by clearing the column.

alter table isabela_businesses
  add column if not exists whatsapp text not null default '',
  add column if not exists image_gallery jsonb not null default '[]'::jsonb,
  add column if not exists owner_token text,
  add column if not exists owner_token_expires timestamptz,
  add column if not exists updated_at timestamptz not null default now();

-- Unique but only for non-null tokens (Postgres treats NULLs as distinct, so a
-- plain unique index is fine).
create unique index if not exists isabela_businesses_owner_token_key
  on isabela_businesses (owner_token);

-- Public media bucket: photos are served over the public object endpoint;
-- writes happen only through the service-role key in server route handlers.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'isabela-media',
  'isabela-media',
  true,
  5242880, -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
