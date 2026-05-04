# DB Schema Notes

## Scope

Created a Supabase/Postgres schema draft for the Re:Link AI demo-to-scale path. The schema covers the required tables:

- `profiles`
- `user_settings`
- `user_consents`
- `daily_entries`
- `ai_analysis_runs`
- `observation_candidates`
- `user_observations`
- `daily_missions`
- `wiki_profiles`
- `shop_items`
- `user_shop_items`
- `room_placements`
- `reports`
- `support_resources`
- `inquiry_drafts`
- `ai_jobs`
- `activity_events`
- `user_feedback`

## Ownership Model

Most user data has a direct `user_id` foreign key to `profiles(id)`, which maps to `auth.users(id)`. `profiles.id` is itself the Supabase Auth user id.

`observation_candidates` are intentionally tied to `daily_entries` instead of duplicating `user_id`. Their RLS policy checks ownership through the parent entry.

`room_placements` includes a composite foreign key to `user_shop_items(user_id, item_id)` so users can only place items they own.

## RLS Pattern

All public tables enable row level security.

Direct user-owned tables use this pattern:

```sql
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id)
```

`profiles` uses the same pattern against `id`.

Catalog tables allow authenticated reads for active rows only:

```sql
using (is_active)
```

The draft intentionally does not grant client writes for system-owned tables such as `ai_jobs`, `ai_analysis_runs`, `reports`, `wiki_profiles`, or `user_shop_items`. Those writes should go through the API or worker using server-side privileges.

## Privacy Decisions

- `daily_entries.raw_text` is nullable.
- `daily_entries.text_preview` is capped at 280 characters.
- `daily_entries.raw_text_retention` defaults to `none`.
- `ai_analysis_runs` includes `input_hash`, token counts, prompt version, and status fields so the API can avoid saving full raw prompt inputs.
- `user_observations` is the durable product value table; AI-generated candidates remain separate from user-accepted observations.

## API/Worker Mapping

- `POST /api/entries/analyze`: writes `daily_entries`, `ai_analysis_runs`, `observation_candidates`, and likely one `daily_missions` row.
- `POST /api/observations/consent`: writes accepted rows into `user_observations`.
- `POST /api/missions/complete`: updates `daily_missions` and `wiki_profiles`.
- `POST /api/room/items`: writes `user_shop_items` for purchases and `room_placements` for placement changes.
- `POST /api/message-draft`: writes `inquiry_drafts`.
- Future async work can enqueue `ai_jobs` rows and let a worker update status/result fields.

## Open Assumptions

- One `profiles` row exists per Supabase Auth user, including anonymous users.
- The API creates default `user_settings` and `wiki_profiles` rows during onboarding or first snapshot.
- `shop_items.id` is a stable text key matching frontend item ids/assets.
- Support resource seed data will be added later; this draft only defines the table.
- No Postgres triggers are included yet. `updated_at` must be set by API code or a later migration can add a private trigger function.
