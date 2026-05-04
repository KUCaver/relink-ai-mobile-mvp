# DB Worker Task

## Goal

Prepare the demo-to-scale Supabase/Postgres schema plan and migration draft. Do not touch API or frontend code.

Workspace:

```text
C:\Users\gando\OneDrive\바탕 화면\건국대학교\건국대학교3학년 1학기\공모전\AI경진대회\relink_mvp_app_dev
```

## Ownership

You may edit only:

```text
packages/db/**
docs/coordination/DB_RESULT.md
docs/coordination/DB_SCHEMA_NOTES.md
```

You are not alone in the codebase; other workers may modify API and frontend files in parallel. Do not revert or overwrite their edits.

## Required Output

Create:

```text
packages/db/schema.sql
packages/db/README.md
docs/coordination/DB_SCHEMA_NOTES.md
docs/coordination/DB_RESULT.md
```

The schema should support:

- profiles
- user_settings
- user_consents
- daily_entries
- ai_analysis_runs
- observation_candidates
- user_observations
- daily_missions
- wiki_profiles
- shop_items
- user_shop_items
- room_placements
- reports
- support_resources
- inquiry_drafts
- ai_jobs
- activity_events
- user_feedback

## Security Rules

- Assume Supabase Postgres.
- Enable RLS for user-owned tables.
- Use `auth.uid()` ownership policies.
- Do not include real credentials.
- Keep raw daily text optional and privacy-aware.

## Verification

Since there is no connected Supabase project yet, verify by reading the SQL for syntax consistency and documenting known assumptions.

Write `docs/coordination/DB_RESULT.md` with changed files, verification, and risks.
