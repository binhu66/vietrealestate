-- Schedule daily news scraping via pg_cron
-- Requires pg_cron extension and supabase_functions schema
-- Run this migration AFTER deploying the scrape-news Edge Function

-- Enable pg_cron if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule: every day at 07:00 Vietnam time (00:00 UTC)
-- Also runs at 12:00 Vietnam time (05:00 UTC) for afternoon news
SELECT cron.schedule(
  'scrape-news-morning',
  '0 0 * * *',  -- 07:00 ICT = 00:00 UTC
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/scrape-news',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'scrape-news-afternoon',
  '0 5 * * *',  -- 12:00 ICT = 05:00 UTC
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/scrape-news',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Optional: clean up old articles older than 90 days to avoid bloat
SELECT cron.schedule(
  'cleanup-old-news',
  '0 2 * * 0',  -- Every Sunday at 09:00 ICT = 02:00 UTC
  $$
  DELETE FROM news_articles
  WHERE published_at < now() - interval '90 days'
    AND source != 'manual'
    AND is_featured = false;
  $$
);
