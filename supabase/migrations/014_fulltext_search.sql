-- Full-text search index for listings
-- Uses Vietnamese-friendly unaccent + simple dictionary
-- Allows: "nha dep quan 7" to match "Nhà đẹp Quận 7"

-- Add unaccent extension if not already present
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create a search vector column (auto-updated by trigger)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate existing rows
UPDATE listings SET search_vector = to_tsvector('simple',
  unaccent(coalesce(title, '')) || ' ' ||
  unaccent(coalesce(public_remarks, '')) || ' ' ||
  unaccent(coalesce(tinh_thanh, '')) || ' ' ||
  unaccent(coalesce(quan_huyen, '')) || ' ' ||
  unaccent(coalesce(phuong_xa, '')) || ' ' ||
  unaccent(coalesce(duong, '')) || ' ' ||
  unaccent(coalesce(project_name, '')) || ' ' ||
  coalesce(contact_name, '')
);

-- GIN index for fast FTS
CREATE INDEX IF NOT EXISTS idx_listings_search_vector
  ON listings USING GIN (search_vector);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION listings_search_vector_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple',
    unaccent(coalesce(NEW.title, '')) || ' ' ||
    unaccent(coalesce(NEW.public_remarks, '')) || ' ' ||
    unaccent(coalesce(NEW.tinh_thanh, '')) || ' ' ||
    unaccent(coalesce(NEW.quan_huyen, '')) || ' ' ||
    unaccent(coalesce(NEW.phuong_xa, '')) || ' ' ||
    unaccent(coalesce(NEW.duong, '')) || ' ' ||
    unaccent(coalesce(NEW.project_name, '')) || ' ' ||
    coalesce(NEW.contact_name, '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS listings_search_vector_trigger ON listings;
CREATE TRIGGER listings_search_vector_trigger
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION listings_search_vector_update();
