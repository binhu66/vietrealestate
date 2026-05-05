-- Geocoding cache: store address → lat/lng so we never geocode the same address twice
CREATE TABLE IF NOT EXISTS geocode_cache (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  address_key  text        UNIQUE NOT NULL,  -- normalized address string used as lookup key
  lat          double precision NOT NULL,
  lng          double precision NOT NULL,
  provider     text        NOT NULL DEFAULT 'mapbox',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Fast lookup by address key
CREATE INDEX IF NOT EXISTS geocode_cache_address_key_idx ON geocode_cache (address_key);

-- Only the service role can insert/update; anon can read (for client-side lookup)
ALTER TABLE geocode_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read geocode cache"
  ON geocode_cache FOR SELECT USING (true);

CREATE POLICY "Service role can upsert geocode cache"
  ON geocode_cache FOR ALL USING (auth.role() = 'service_role');
