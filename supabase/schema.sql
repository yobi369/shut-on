-- Shut-On Photography gallery schema for Supabase.
-- Run in the Supabase SQL Editor. Review this file before production use.
create extension if not exists pgcrypto;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
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
create index if not exists photos_public_gallery_idx on public.photos (is_published, sort_order, created_at desc);
create index if not exists photos_owner_idx on public.photos (owner_id);
alter table public.photos enable row level security;

drop policy if exists "Anyone can read published photos" on public.photos;
create policy "Anyone can read published photos" on public.photos for select to anon, authenticated using (is_published = true);
drop policy if exists "Owners can read their photos" on public.photos;
create policy "Owners can read their photos" on public.photos for select to authenticated using (owner_id = auth.uid());
drop policy if exists "Owners can insert their photos" on public.photos;
create policy "Owners can insert their photos" on public.photos for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "Owners can update their photos" on public.photos;
create policy "Owners can update their photos" on public.photos for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "Owners can delete their photos" on public.photos;
create policy "Owners can delete their photos" on public.photos for delete to authenticated using (owner_id = auth.uid());

-- Portfolio images are intentionally public after upload/publishing.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photography', 'photography', true, 12582912, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 12582912, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images" on storage.objects for select to anon, authenticated using (bucket_id = 'photography');
drop policy if exists "Studio users can upload portfolio images" on storage.objects;
create policy "Studio users can upload portfolio images" on storage.objects for insert to authenticated with check (bucket_id = 'photography' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Studio users can update own portfolio images" on storage.objects;
create policy "Studio users can update own portfolio images" on storage.objects for update to authenticated using (bucket_id = 'photography' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'photography' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Studio users can delete own portfolio images" on storage.objects;
create policy "Studio users can delete own portfolio images" on storage.objects for delete to authenticated using (bucket_id = 'photography' and (storage.foldername(name))[1] = auth.uid()::text);
