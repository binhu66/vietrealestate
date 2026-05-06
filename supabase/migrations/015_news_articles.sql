-- News articles table for auto-scraped real estate news
-- Sources: VnExpress, Cafef.vn, BatDongSan.com.vn RSS feeds (free)

CREATE TABLE news_articles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source          text NOT NULL,            -- vnexpress | cafef | batdongsan | manual
  source_url      text NOT NULL UNIQUE,     -- original URL, dedup key
  slug            text UNIQUE,              -- generated from title for SEO
  title           text NOT NULL,
  excerpt         text,
  body            text,
  image_url       text,
  category        text NOT NULL DEFAULT 'Thị trường',  -- Thị trường | Pháp lý | Đầu tư | Thương mại | Kiến thức
  author          text,
  published_at    timestamptz NOT NULL DEFAULT now(),
  scraped_at      timestamptz NOT NULL DEFAULT now(),
  -- SEO / AI
  is_featured     boolean NOT NULL DEFAULT false,
  views           integer NOT NULL DEFAULT 0,
  read_min        smallint NOT NULL DEFAULT 3,
  -- Status
  status          text NOT NULL DEFAULT 'published'
                    CHECK (status IN ('published', 'draft', 'hidden'))
);

-- Indexes
CREATE INDEX idx_news_status_date ON news_articles (status, published_at DESC);
CREATE INDEX idx_news_source ON news_articles (source, published_at DESC);
CREATE INDEX idx_news_category ON news_articles (category, published_at DESC);
CREATE INDEX idx_news_featured ON news_articles (is_featured, published_at DESC) WHERE is_featured = true;

-- Full-text search
ALTER TABLE news_articles ADD COLUMN search_vector tsvector;

UPDATE news_articles SET search_vector = to_tsvector('simple',
  unaccent(coalesce(title, '')) || ' ' ||
  unaccent(coalesce(excerpt, '')) || ' ' ||
  coalesce(category, '')
);

CREATE INDEX idx_news_search ON news_articles USING GIN (search_vector);

CREATE OR REPLACE FUNCTION news_search_vector_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple',
    unaccent(coalesce(NEW.title, '')) || ' ' ||
    unaccent(coalesce(NEW.excerpt, '')) || ' ' ||
    coalesce(NEW.category, '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER news_search_vector_trigger
  BEFORE INSERT OR UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION news_search_vector_update();

-- RLS: public read, only service_role can write
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_public_read"
  ON news_articles FOR SELECT
  USING (status = 'published');

-- View counter function
CREATE OR REPLACE FUNCTION increment_news_views(article_id uuid)
RETURNS void LANGUAGE sql AS $$
  UPDATE news_articles SET views = views + 1 WHERE id = article_id;
$$;
