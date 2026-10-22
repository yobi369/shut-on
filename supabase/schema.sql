-- Shut-On Photography gallery schema for Supabase.
-- Run in the Supabase SQL Editor. Review this file before production use.
create extension if not exists pgcrypto;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 180),
  description text check (description is null or char_length(description) <= 500),
  category text not null default 'Other' check (char_length(category) <= 80),
  storage_path text not null unique,
  image_url text not null,
  alt_text text not null default '' check (char_length(alt_text) <= 250),
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists photos_public_gallery_idx
  on public.photos (is_published, sort_order, created_at desc);

alter table public.photos enable row level security;

-- Public visitors can see published photos only.
drop policy if exists "Anyone can read published photos" on public.photos;
create policy "Anyone can read published photos"
  on public.photos for select
  to anon, authenticated
  using (is_published = true);

-- Authenticated accounts can manage the gallery. IMPORTANT: create only trusted
-- studio accounts in Supabase and disable public sign-ups in Authentication settings.
drop policy if exists "Authenticated studio users can read all photos" on public.photos;
create policy "Authenticated studio users can read all photos"
  on public.photos for select
  to authenticated
  using (auth.uid() is not null);

drop policy if exists "Authenticated studio users can insert photos" on public.photos;
create policy "Authenticated studio users can insert photos"
  on public.photos for insert
  to authenticated
  with check (auth.uid() is not null);

drop policy if exists "Authenticated studio users can update photos" on public.photos;
create policy "Authenticated studio users can update photos"
  on public.photos for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Authenticated studio users can delete photos" on public.photos;
create policy "Authenticated studio users can delete photos"
  on public.photos for delete
  to authenticated
  using (auth.uid() is not null);

-- Portfolio bucket: photos published to the public site are intentionally public.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photography', 'photography', true, 12582912, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = true,
  file_size_limit = 12582912,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photography');

drop policy if exists "Studio users can upload portfolio images" on storage.objects;
create policy "Studio users can upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photography'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Studio users can update own portfolio images" on storage.objects;
create policy "Studio users can update own portfolio images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'photography' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'photography' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Studio users can delete own portfolio images" on storage.objects;
create policy "Studio users can delete own portfolio images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photography' and (storage.foldername(name))[1] = auth.uid()::text);
