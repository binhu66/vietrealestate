-- Allow unauthenticated users to submit listings (pending review).
-- Submitted listings default to standard_status='Active' but are reviewed by admin.
CREATE POLICY "listings_anon_insert"
  ON listings FOR INSERT
  WITH CHECK (posted_by IS NULL);

-- Allow anyone to read pending listings they submitted via contact_phone lookup
-- (Admins use service_role to see all statuses)
