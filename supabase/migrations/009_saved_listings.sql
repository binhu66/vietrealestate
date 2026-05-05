-- Saved/favorited listings per user
CREATE TABLE IF NOT EXISTS saved_listings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- Users can only see/manage their own saved listings
CREATE POLICY "saved_select_own" ON saved_listings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_own" ON saved_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own" ON saved_listings FOR DELETE USING (auth.uid() = user_id);
