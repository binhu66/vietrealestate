-- VietRealty: AI-assisted listing ingestion and scrape queue
-- Supports: (1) admin manual AI-parse from URL/image/text
--           (2) background crawler jobs

-- ── scrape_jobs ───────────────────────────────────────────
-- Queue for crawling pages from batdongsan.com.vn, nhatot.com, etc.
create table scrape_jobs (
  id              uuid primary key default gen_random_uuid(),
  source_site     text not null,              -- batdongsan, nhatot, alonhadat, etc.
  source_url      text not null,
  status          text not null default 'pending'
                    check (status in ('pending', 'running', 'done', 'failed', 'duplicate')),
  result_listing_id uuid references listings(id) on delete set null,
  raw_html        text,                       -- stored for re-parsing if model improves
  ai_raw_json     jsonb,                      -- raw AI extraction result before mapping
  error_msg       text,
  retry_count     smallint not null default 0,
  scheduled_at    timestamptz not null default now(),
  started_at      timestamptz,
  finished_at     timestamptz,
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index idx_scrape_jobs_status on scrape_jobs (status, scheduled_at);
create index idx_scrape_jobs_source on scrape_jobs (source_site, source_url);

-- ── ai_parse_sessions ────────────────────────────────────
-- Admin uses: paste text / upload image / enter URL → AI fills form
-- One session = one admin-initiated parse attempt
create table ai_parse_sessions (
  id              uuid primary key default gen_random_uuid(),
  -- Input
  input_type      text not null check (input_type in ('url', 'text', 'image', 'screenshot')),
  input_url       text,
  input_text      text,
  input_image_url text,
  -- AI output
  model_used      text,                       -- e.g. claude-sonnet-4-6
  ai_raw_json     jsonb,                      -- full model response
  extracted_fields jsonb,                     -- cleaned mapping → listing fields
  confidence      numeric(3,2),               -- 0-1 overall confidence
  -- Result
  status          text not null default 'pending'
                    check (status in ('pending', 'processing', 'done', 'failed')),
  result_listing_id uuid references listings(id) on delete set null,
  error_msg       text,
  created_by      uuid not null references auth.users(id) on delete cascade,
  created_at      timestamptz not null default now(),
  finished_at     timestamptz
);

create index idx_ai_parse_sessions_user on ai_parse_sessions (created_by, created_at desc);

alter table scrape_jobs enable row level security;
alter table ai_parse_sessions enable row level security;

-- Only admins can access via service_role key (no user-facing RLS needed)
-- Frontend admin uses supabaseAdmin client with service_role

-- ── Helper view: pending scrape queue ─────────────────────
create view v_scrape_pending as
  select id, source_site, source_url, retry_count, scheduled_at
  from scrape_jobs
  where status = 'pending' and scheduled_at <= now()
  order by scheduled_at
  limit 50;
