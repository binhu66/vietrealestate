-- VietRealty: agents and contact_requests

-- ── agents ────────────────────────────────────────────────
create table agents (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid unique references auth.users(id) on delete set null,
  full_name         text not null,
  phone             text not null,
  zalo              text,
  email             text unique,
  avatar_url        text,
  bio               text,
  bio_en            text,
  license_number    text,
  company_name      text,
  company_address   text,
  tinh_thanh        text,                     -- primary operating province
  specialties       text[],                   -- apartment, land, villa, etc.
  -- Stats
  listings_count    integer not null default 0,
  sold_count        integer not null default 0,
  rating            numeric(3,2),
  reviews_count     integer not null default 0,
  -- Status
  verified          boolean default false,
  status            text not null default 'active'
                      check (status in ('active', 'inactive', 'banned')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_agents_tinh_thanh on agents (tinh_thanh) where status = 'active';
create index idx_agents_user_id on agents (user_id);

alter table agents enable row level security;

create policy "agents_public_read"
  on agents for select using (status = 'active');

create policy "agents_owner_update"
  on agents for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- FK from listings to agents
alter table listings add constraint fk_listings_agent
  foreign key (agent_id) references agents(id) on delete set null;

-- ── contact_requests (leads) ──────────────────────────────
create table contact_requests (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid references listings(id) on delete set null,
  agent_id        uuid references agents(id) on delete set null,
  -- Visitor info (may not be logged in)
  user_id         uuid references auth.users(id) on delete set null,
  sender_name     text not null,
  sender_phone    text not null,
  sender_zalo     text,
  sender_email    text,
  message         text,
  -- Tracking
  status          text not null default 'new'
                    check (status in ('new', 'contacted', 'closed')),
  source          text,   -- web, mobile, zalo_oa
  created_at      timestamptz not null default now()
);

create index idx_contact_requests_listing_id on contact_requests (listing_id, created_at desc);
create index idx_contact_requests_agent_id   on contact_requests (agent_id, created_at desc);
create index idx_contact_requests_status     on contact_requests (status, created_at desc);

alter table contact_requests enable row level security;

-- Agents can see their own leads
create policy "contact_requests_agent_read"
  on contact_requests for select
  using (
    agent_id in (
      select id from agents where user_id = auth.uid()
    )
  );

-- Anyone can insert a contact request (no auth required)
create policy "contact_requests_insert"
  on contact_requests for insert
  with check (true);
