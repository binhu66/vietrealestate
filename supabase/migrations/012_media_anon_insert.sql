-- Allow anonymous users to insert listing_media for listings they just created
-- (uploaded_by IS NULL means anonymous submission)
CREATE POLICY "listing_media_anon_insert"
  ON listing_media FOR INSERT
  WITH CHECK (uploaded_by IS NULL);
