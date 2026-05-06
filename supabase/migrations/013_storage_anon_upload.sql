-- Allow anonymous users to upload to listing-images bucket
-- They upload to "anon/" subfolder
CREATE POLICY "listing_images_anon_upload"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = 'anon'
  );
