# Shut-On Photography

Photography portfolio built with Node.js, Express and EJS. The admin dashboard uses Supabase Auth, Postgres and Storage so the studio owner can manage gallery images without editing source code.

## Admin dashboard

- Route: `/admin`
- Supports sign-in, multi-image upload, photo listing, editing titles/captions/categories/alt text, publish/unpublish and deletion.
- The public `/gallery` route reads published photos from Supabase when configured and retains legacy images if not configured.
- JPG, PNG and WebP images are limited to 12 MB each and 30 files per batch in the UI.
- Row Level Security (RLS) scopes photo records to their owner; storage writes are scoped to the signed-in user's folder.
- The storage bucket is public, so uploaded image URLs are publicly retrievable even when a photo is marked as a draft; drafts are hidden from the gallery, not confidential. Do not upload private client proofs.

## Required setup before use

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Disable public sign-ups in Supabase Authentication settings. Create the studio owner's account manually; only trusted studio accounts should exist.
4. In Vercel, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` using the project's URL and anon/publishable key. Never expose a service-role key.
5. Redeploy the Vercel project, visit `/admin`, and sign in.
6. Upload a test image, verify it appears on `/gallery`, unpublish it, and verify it disappears from the public gallery.

See `.env.example` for variable names.

## Development

- Node.js 18 or newer is required (the app uses built-in `fetch`).
- Install dependencies with `npm install`.
- Run locally with `npm start`.
- Run syntax checks with `npm run check`; run tests with `npm test`.

Vercel environment variables are configured in the Vercel dashboard, not committed to this repository.

## Production checklist / known limitations

- The contact form validates and logs an enquiry; it does not deliver email. Connect and test a trusted email provider before relying on it.
- The dashboard requires the Supabase setup steps above; it cannot upload until the external service is configured.
- Configure Supabase backups, account recovery, monitoring and an explicit owner-account lifecycle.
- Browser file checks are convenience checks, not a full content inspection pipeline.
- Run a production smoke test after deployment, including login, upload, publish, unpublish, deletion and public gallery visibility.
