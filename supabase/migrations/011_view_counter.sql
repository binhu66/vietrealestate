-- Atomic view counter increment (rate-limited by client, no per-user tracking)
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE listings
  SET views = COALESCE(views, 0) + 1
  WHERE id = listing_id
    AND standard_status = 'Active';
END;
$$;

-- Allow public (anon + authenticated) to call this function
GRANT EXECUTE ON FUNCTION increment_listing_views(uuid) TO anon, authenticated;
