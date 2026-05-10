# BinHorizon – Supabase Migrations

## Run order

```
001_listings.sql       – core listings table, PostGIS geog, RLS
002_listing_media.sql  – photos, listing_events history
003_profiles.sql       – user profiles, favorites, saved_searches
004_agents.sql         – agents, contact_requests (leads)
005_ai_scrape.sql      – scrape_jobs queue, ai_parse_sessions
```

## Apply via Supabase CLI

```bash
supabase db push
# or manually:
supabase db execute --file supabase/migrations/001_listings.sql
```

## Key design decisions

| Decision | Reason |
|---|---|
| PostGIS `geog` column on listings | Enables radius search and map bbox queries efficiently |
| `transaction_type` = 'For Sale' / 'For Rent' | RESO-standard values, consistent with yorkbbs0405 |
| Vietnam 4-level address stored as separate columns | Filtering by province/district without string parsing |
| `phap_ly` (so_do/so_hong) | Critical field for Vietnam — determines who can own |
| `vip_level` 0–3 | Matches batdongsan.com.vn commercial model for promoted listings |
| `contact_zalo` on both listings and agents | Zalo is the dominant contact channel in Vietnam |
| `scrape_jobs` + `ai_parse_sessions` | Supports both automated crawling and admin AI-assist entry |
| Price always in VND | Avoids dual-currency confusion; `price_unit` tracks USD originals |
