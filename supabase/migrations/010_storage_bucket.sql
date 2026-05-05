-- Create listing-images storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  10485760,  -- 10MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Anyone can read public photos
create policy "listing_images_public_read"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Authenticated users can upload
create policy "listing_images_auth_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-images');

-- Owner can delete their own photos
create policy "listing_images_owner_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);
