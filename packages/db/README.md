# Re:Link DB Package

This package contains the initial Supabase/Postgres schema draft for the Re:Link AI MVP-to-pilot path.

## Files

- `schema.sql`: complete draft schema, indexes, and RLS policies for the public schema.

## Apply Target

Apply `schema.sql` only to a Supabase project with Supabase Auth enabled. It assumes:

- `auth.users` exists.
- Users can start as Supabase anonymous users and later convert to permanent accounts.
- API/worker services use server-side credentials outside frontend code.
- No real credentials are stored in this package.

## Access Model

User-owned tables use one of these RLS patterns:

- Direct ownership: `user_id = auth.uid()`.
- Profile ownership: `profiles.id = auth.uid()`.
- Indirect ownership: `observation_candidates` are readable only when their `entry_id` belongs to a row in `daily_entries` owned by the current user.

Catalog tables are RLS-protected too:

- `shop_items`: authenticated users can read active items only.
- `support_resources`: authenticated users can read active resources only.

API-owned operational tables are intentionally limited for clients:

- `ai_analysis_runs`, `ai_jobs`, `reports`, `wiki_profiles`, and `user_shop_items` are readable by the owning user, but client writes are not granted in the schema draft.
- The API or worker should create and update those rows with server-side privileges.

## Privacy Notes

`daily_entries.raw_text` is nullable. The default retention mode is `none`, so the product can store only a short `text_preview` and accepted observation fragments unless the user explicitly opts into raw text storage.

AI request tracking should prefer `input_hash`, token counts, prompt versions, and status metadata. Avoid storing full prompt/input text in operational logs.
