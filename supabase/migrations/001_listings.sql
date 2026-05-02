-- VietRealty: listings table
-- Inspired by yorkbbs0405 RESO/TRREB schema, adapted for Vietnam real estate market
-- Field naming: RESO-aligned snake_case where applicable, Vietnam-specific fields added

create extension if not exists postgis;

-- ============================================================
-- listings
-- ============================================================
create table listings (
  -- Identity
  id                        uuid primary key default gen_random_uuid(),
  listing_key               text unique not null generated always as (id::text) stored,

  -- Transaction & type
  transaction_type          text not null check (transaction_type in ('For Sale', 'For Rent')),
  property_type             text not null check (property_type in (
                              'apartment',    -- căn hộ chung cư
                              'house',        -- nhà phố / nhà riêng
                              'villa',        -- biệt thự
                              'land',         -- đất nền / đất thổ cư
                              'commercial',   -- mặt bằng kinh doanh
                              'warehouse',    -- kho xưởng
                              'office',       -- văn phòng
                              'other'
                            )),
  category                  text,  -- slug: can-ho-chung-cu, nha-pho, dat-nen, biet-thu, etc.

  -- Status (RESO StandardStatus)
  standard_status           text not null default 'Active'
                              check (standard_status in ('Active', 'Pending', 'Sold', 'Rented', 'Expired', 'Withdrawn')),

  -- VIP / commercial tier (batdongsan.com.vn model)
  vip_level                 smallint not null default 0 check (vip_level between 0 and 3),
  vip_expires_at            timestamptz,

  -- ── Price ──────────────────────────────────────────────
  list_price                numeric(18,0) not null,            -- always in VND
  price_unit                text not null default 'vnd'
                              check (price_unit in ('vnd', 'usd')),
  price_per_m2              numeric(18,0),                      -- computed or entered
  original_list_price       numeric(18,0),
  previous_list_price       numeric(18,0),
  price_negotiable          boolean default true,

  -- ── Area ───────────────────────────────────────────────
  building_area_total       numeric(10,2),    -- diện tích sàn / xây dựng (m²) — RESO
  land_area                 numeric(10,2),    -- diện tích đất / thổ cư (m²)
  usable_area               numeric(10,2),    -- diện tích sử dụng / thông thủy

  -- ── Rooms ──────────────────────────────────────────────
  bedrooms_total            smallint,
  bathrooms_total           smallint,
  floors_total              smallint,         -- số tầng
  floor_number              smallint,         -- tầng (apartment: tầng mấy)
  year_built                smallint,

  -- ── Orientation & facing ───────────────────────────────
  direction_faces           text,             -- hướng nhà: N/S/E/W/NE/NW/SE/SW
  balcony_direction         text,             -- hướng ban công

  -- ── Vietnam address (4-level) ──────────────────────────
  -- Mirrors Vietnam's admin hierarchy: tỉnh → quận/huyện → phường/xã → số nhà
  tinh_thanh                text not null,    -- province / thành phố trực thuộc TW
  quan_huyen                text,             -- district / quận / huyện
  phuong_xa                 text,             -- ward / phường / xã
  duong                     text,             -- street name
  so_nha                    text,             -- house number
  unparsed_address          text,             -- full display address
  project_name              text,             -- tên dự án / tòa nhà

  -- ── Geocode ────────────────────────────────────────────
  lat                       double precision,
  lng                       double precision,
  geog                      geography(Point, 4326),   -- synced from lat/lng by trigger

  -- ── Legal (pháp lý) ────────────────────────────────────
  -- Vietnam has two main land certificates: sổ đỏ (red book) and sổ hồng (pink book)
  phap_ly                   text check (phap_ly in (
                              'so_do',        -- sổ đỏ: land use rights
                              'so_hong',      -- sổ hồng: apartment/house ownership
                              'hop_dong',     -- hợp đồng mua bán (in progress)
                              'other',
                              null
                            )),
  land_use_rights_years     smallint,         -- 50 for foreigners on condo, null = freehold

  -- ── Alley / frontage ───────────────────────────────────
  ngo_hem_width             numeric(5,2),     -- ngõ/hẻm width (m) — important for pricing
  mat_tien_width            numeric(5,2),     -- mặt tiền width (m)

  -- ── Building features ──────────────────────────────────
  furniture_status          text check (furniture_status in ('full', 'basic', 'none')),
  interior_features         text[],           -- array of tags
  exterior_features         text[],
  amenities                 text[],           -- hồ bơi, gym, bảo vệ 24/7, thang máy, etc.
  elevator_yn               boolean,
  parking_spaces            smallint,
  parking_type              text,             -- covered / open / building

  -- ── Contact ────────────────────────────────────────────
  contact_name              text,
  contact_phone             text,
  contact_zalo              text,             -- Zalo is dominant messenger in Vietnam
  contact_email             text,

  -- ── Content ────────────────────────────────────────────
  public_remarks            text,             -- listing description (Vietnamese)
  public_remarks_en         text,             -- English description
  public_remarks_zh         text,             -- Chinese description
  title                     text,             -- listing title
  title_en                  text,
  title_zh                  text,

  -- ── Media ──────────────────────────────────────────────
  cover_image               text,             -- primary photo URL
  video_url                 text,
  virtual_tour_url          text,
  photos_count              smallint default 0,

  -- ── SEO / AI assist ────────────────────────────────────
  ai_parsed                 boolean default false,   -- was AI used to fill fields?
  source_url                text,                     -- original scraped URL
  source_site               text,                     -- batdongsan, nhatot, alonhadat, etc.
  source_listing_id         text,                     -- original ID on source site
  tags                      text[],

  -- ── Stats ──────────────────────────────────────────────
  views                     integer not null default 0,
  inquiries_count           integer not null default 0,
  days_on_market            integer,

  -- ── Ownership ──────────────────────────────────────────
  posted_by                 uuid references auth.users(id) on delete set null,
  agent_id                  uuid,             -- FK added in 004_agents.sql
  verified_by               uuid references auth.users(id) on delete set null,

  -- ── Timestamps ─────────────────────────────────────────
  listing_contract_date     date,
  close_date                date,
  expiration_date           date,
  original_entry_timestamp  timestamptz not null default now(),
  modification_timestamp    timestamptz not null default now(),

  -- ── Full-text search ───────────────────────────────────
  search_tsv                tsvector generated always as (
    to_tsvector('simple',
      coalesce(title, '') || ' ' ||
      coalesce(unparsed_address, '') || ' ' ||
      coalesce(project_name, '') || ' ' ||
      coalesce(tinh_thanh, '') || ' ' ||
      coalesce(quan_huyen, '') || ' ' ||
      coalesce(phuong_xa, '') || ' ' ||
      coalesce(public_remarks, '')
    )
  ) stored
);

-- ── Indexes ────────────────────────────────────────────────
-- Spatial: map queries by bounding box / radius
create index idx_listings_geog
  on listings using gist (geog)
  where standard_status = 'Active';

-- Full-text search
create index idx_listings_search_tsv
  on listings using gin (search_tsv);

-- List page: filter by status + type + city
create index idx_listings_active_filter
  on listings (standard_status, transaction_type, property_type, tinh_thanh, modification_timestamp desc);

-- VIP sort (featured listings sorted first)
create index idx_listings_vip
  on listings (vip_level desc, modification_timestamp desc)
  where standard_status = 'Active';

-- Price range filter
create index idx_listings_price
  on listings (list_price)
  where standard_status = 'Active';

-- Source dedup
create unique index idx_listings_source_dedup
  on listings (source_site, source_listing_id)
  where source_site is not null and source_listing_id is not null;

-- ── Trigger: sync lat/lng → geog ──────────────────────────
create or replace function fn_sync_listing_geog()
returns trigger language plpgsql as $$
begin
  if new.lat is not null and new.lng is not null then
    new.geog := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  else
    new.geog := null;
  end if;
  new.modification_timestamp := now();
  return new;
end;
$$;

create trigger trg_listings_sync_geog
  before insert or update of lat, lng on listings
  for each row execute function fn_sync_listing_geog();

-- ── RLS ───────────────────────────────────────────────────
alter table listings enable row level security;

-- Public: read active listings
create policy "listings_public_read"
  on listings for select
  using (standard_status = 'Active');

-- Owner: full access to own listings
create policy "listings_owner_all"
  on listings for all
  using (posted_by = auth.uid())
  with check (posted_by = auth.uid());

-- Admins bypass RLS via service_role key
