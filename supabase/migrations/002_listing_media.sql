-- VietRealty: listing_media table
-- Decoupled photo storage — allows async upload and Supabase Storage integration

create table listing_media (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references listings(id) on delete cascade,
  url           text not null,               -- Supabase Storage public URL
  storage_path  text,                        -- internal bucket path for deletion
  media_type    text not null default 'photo'
                  check (media_type in ('photo', 'video', 'floor_plan', 'document')),
  sort_order    smallint not null default 0, -- 0 = cover photo
  width         integer,
  height        integer,
  size_bytes    integer,
  caption       text,
  uploaded_by   uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index idx_listing_media_listing_id on listing_media (listing_id, sort_order);

alter table listing_media enable row level security;

-- Public can read photos for active listings
create policy "listing_media_public_read"
  on listing_media for select
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id and l.standard_status = 'Active'
    )
  );

-- Owner can manage photos
create policy "listing_media_owner_all"
  on listing_media for all
  using (uploaded_by = auth.uid())
  with check (uploaded_by = auth.uid());

-- ── listing_events: price/status change history ────────────
-- Same pattern as yorkbbs property_events
create table listing_events (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references listings(id) on delete cascade,
  event_type    text not null check (event_type in (
                  'price_change', 'status_change', 'vip_upgrade', 'edit', 'created'
                )),
  old_value     text,
  new_value     text,
  changed_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index idx_listing_events_listing_id on listing_events (listing_id, created_at desc);

alter table listing_events enable row level security;

create policy "listing_events_owner_read"
  on listing_events for select
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id and l.posted_by = auth.uid()
    )
  );
