-- VietRealty: user profiles, favorites, saved searches

-- ── profiles ──────────────────────────────────────────────
-- Mirrors auth.users 1:1; created by trigger on auth.users insert
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  phone           text,
  zalo            text,
  avatar_url      text,
  role            text not null default 'user'
                    check (role in ('admin', 'agent', 'user')),
  status          text not null default 'active'
                    check (status in ('active', 'inactive', 'banned')),
  -- Preferred locale for this user
  locale          text default 'vi' check (locale in ('vi', 'en', 'zh')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_public_read"
  on profiles for select using (status = 'active');

create policy "profiles_owner_update"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create profile on new user signup
create or replace function fn_create_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_create_profile
  after insert on auth.users
  for each row execute function fn_create_profile();

-- ── favorites ──────────────────────────────────────────────
create table favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid not null references listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, listing_id)
);

create index idx_favorites_user_id on favorites (user_id, created_at desc);

alter table favorites enable row level security;

create policy "favorites_owner_all"
  on favorites for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── saved_searches ────────────────────────────────────────
create table saved_searches (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text,
  filters         jsonb not null default '{}',  -- serialized SearchParams
  last_run_at     timestamptz,
  new_count       integer default 0,            -- new results since last run
  notify_email    boolean default false,
  notify_zalo     boolean default false,
  created_at      timestamptz not null default now()
);

create index idx_saved_searches_user_id on saved_searches (user_id);

alter table saved_searches enable row level security;

create policy "saved_searches_owner_all"
  on saved_searches for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
