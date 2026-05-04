-- Re:Link AI Supabase/Postgres schema draft.
-- No credentials are included. Apply in a Supabase project with Supabase Auth enabled.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  region text,
  onboarding_status text not null default 'new'
    check (onboarding_status in ('new', 'started', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  theme_mode text not null default 'system'
    check (theme_mode in ('system', 'light', 'dark')),
  save_raw_text boolean not null default false,
  raw_text_retention_days integer not null default 0
    check (raw_text_retention_days between 0 and 90),
  report_period_days integer not null default 7
    check (report_period_days in (7, 14)),
  notifications_enabled boolean not null default false,
  locale text not null default 'ko-KR',
  updated_at timestamptz not null default now()
);

create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null
    check (consent_type in ('privacy', 'ai_analysis', 'raw_text_storage', 'marketing', 'research')),
  version text not null,
  accepted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  check (revoked_at is null or revoked_at >= accepted_at)
);

create index if not exists user_consents_user_type_idx
  on public.user_consents(user_id, consent_type, accepted_at desc);

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null default current_date,
  raw_text text,
  text_preview text not null default '',
  raw_text_retention text not null default 'none'
    check (raw_text_retention in ('none', 'session', 'short_term', 'user_opt_in')),
  raw_text_delete_after timestamptz,
  mood_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (raw_text is null or char_length(raw_text) <= 5000),
  check (char_length(text_preview) <= 280)
);

create index if not exists daily_entries_user_date_idx
  on public.daily_entries(user_id, entry_date desc);

create table if not exists public.ai_analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_id uuid references public.daily_entries(id) on delete cascade,
  provider text not null,
  model text not null,
  prompt_version text not null,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'succeeded', 'failed', 'canceled')),
  input_hash text,
  token_input integer not null default 0 check (token_input >= 0),
  token_output integer not null default 0 check (token_output >= 0),
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  error_message text,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists ai_analysis_runs_user_created_idx
  on public.ai_analysis_runs(user_id, created_at desc);
create index if not exists ai_analysis_runs_entry_idx
  on public.ai_analysis_runs(entry_id);

create table if not exists public.observation_candidates (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.daily_entries(id) on delete cascade,
  analysis_run_id uuid references public.ai_analysis_runs(id) on delete set null,
  tag text not null,
  text text not null,
  source_excerpt text,
  question text,
  confidence numeric(4, 3) check (confidence is null or confidence between 0 and 1),
  safety_flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists observation_candidates_entry_idx
  on public.observation_candidates(entry_id);
create index if not exists observation_candidates_run_idx
  on public.observation_candidates(analysis_run_id);

create table if not exists public.user_observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_id uuid references public.daily_entries(id) on delete set null,
  candidate_id uuid references public.observation_candidates(id) on delete set null,
  tag text not null,
  text text not null,
  source_excerpt text,
  user_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_observations_user_created_idx
  on public.user_observations(user_id, created_at desc);
create index if not exists user_observations_entry_idx
  on public.user_observations(entry_id);

create table if not exists public.daily_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_id uuid references public.daily_entries(id) on delete set null,
  mission_date date not null default current_date,
  title text not null,
  examples_json jsonb not null default '[]'::jsonb,
  why text,
  difficulty text not null default 'easy'
    check (difficulty in ('easy', 'medium', 'hard')),
  status text not null default 'assigned'
    check (status in ('assigned', 'completed', 'skipped', 'expired')),
  reward_shards integer not null default 0 check (reward_shards >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists daily_missions_user_date_idx
  on public.daily_missions(user_id, mission_date desc);

create table if not exists public.wiki_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  level integer not null default 1 check (level >= 1),
  xp integer not null default 0 check (xp >= 0),
  max_xp integer not null default 100 check (max_xp > 0),
  shards integer not null default 0 check (shards >= 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_items (
  id text primary key,
  name text not null,
  category text not null,
  price_shards integer not null check (price_shards >= 0),
  asset_key text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists shop_items_active_category_idx
  on public.shop_items(is_active, category);

create table if not exists public.user_shop_items (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null references public.shop_items(id) on delete restrict,
  purchased_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists public.room_placements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  slot text not null,
  position_json jsonb not null default '{}'::jsonb,
  rotation_degrees integer not null default 0,
  updated_at timestamptz not null default now(),
  foreign key (user_id, item_id)
    references public.user_shop_items(user_id, item_id)
    on delete cascade,
  unique (user_id, slot)
);

create index if not exists room_placements_user_idx
  on public.room_placements(user_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  period_type text not null check (period_type in ('7d', '14d')),
  summary_json jsonb not null default '{}'::jsonb,
  source_observation_ids uuid[] not null default '{}'::uuid[],
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create index if not exists reports_user_period_idx
  on public.reports(user_id, period_start desc, period_end desc);

create table if not exists public.support_resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null
    check (kind in ('counseling_center', 'community_center', 'public_service', 'hotline', 'website', 'other')),
  region text,
  address text,
  phone text,
  url text,
  tags_json jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_resources_active_region_idx
  on public.support_resources(is_active, region);

create table if not exists public.inquiry_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  report_id uuid references public.reports(id) on delete set null,
  support_resource_id uuid references public.support_resources(id) on delete set null,
  draft_text text not null,
  source_observation_ids uuid[] not null default '{}'::uuid[],
  status text not null default 'draft'
    check (status in ('draft', 'edited', 'copied', 'archived')),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index if not exists inquiry_drafts_user_created_idx
  on public.inquiry_drafts(user_id, created_at desc);

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  job_type text not null
    check (job_type in ('analyze_entry', 'generate_report', 'generate_inquiry_draft')),
  status text not null default 'pending'
    check (status in ('pending', 'running', 'succeeded', 'failed', 'canceled')),
  payload_json jsonb not null default '{}'::jsonb,
  result_json jsonb,
  attempts integer not null default 0 check (attempts >= 0),
  run_after timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_jobs_status_run_after_idx
  on public.ai_jobs(status, run_after, created_at);
create index if not exists ai_jobs_user_created_idx
  on public.ai_jobs(user_id, created_at desc);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_name text not null,
  properties_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_events_user_created_idx
  on public.activity_events(user_id, created_at desc);
create index if not exists activity_events_name_created_idx
  on public.activity_events(event_name, created_at desc);

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  screen text,
  rating integer check (rating is null or rating between 1 and 5),
  comment text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_feedback_user_created_idx
  on public.user_feedback(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_consents enable row level security;
alter table public.daily_entries enable row level security;
alter table public.ai_analysis_runs enable row level security;
alter table public.observation_candidates enable row level security;
alter table public.user_observations enable row level security;
alter table public.daily_missions enable row level security;
alter table public.wiki_profiles enable row level security;
alter table public.shop_items enable row level security;
alter table public.user_shop_items enable row level security;
alter table public.room_placements enable row level security;
alter table public.reports enable row level security;
alter table public.support_resources enable row level security;
alter table public.inquiry_drafts enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.activity_events enable row level security;
alter table public.user_feedback enable row level security;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id);
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "user_settings_select_own"
  on public.user_settings for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_settings_insert_own"
  on public.user_settings for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_settings_update_own"
  on public.user_settings for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "user_consents_select_own"
  on public.user_consents for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_consents_insert_own"
  on public.user_consents for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_consents_update_own"
  on public.user_consents for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "daily_entries_select_own"
  on public.daily_entries for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "daily_entries_insert_own"
  on public.daily_entries for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "daily_entries_update_own"
  on public.daily_entries for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "daily_entries_delete_own"
  on public.daily_entries for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "ai_analysis_runs_select_own"
  on public.ai_analysis_runs for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "observation_candidates_select_own_entry"
  on public.observation_candidates for select to authenticated
  using (
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.daily_entries de
      where de.id = observation_candidates.entry_id
        and de.user_id = (select auth.uid())
    )
  );

create policy "user_observations_select_own"
  on public.user_observations for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_observations_insert_own"
  on public.user_observations for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_observations_update_own"
  on public.user_observations for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_observations_delete_own"
  on public.user_observations for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "daily_missions_select_own"
  on public.daily_missions for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "daily_missions_update_own"
  on public.daily_missions for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "wiki_profiles_select_own"
  on public.wiki_profiles for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "shop_items_select_active"
  on public.shop_items for select to authenticated
  using (is_active);

create policy "user_shop_items_select_own"
  on public.user_shop_items for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "room_placements_select_own"
  on public.room_placements for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "room_placements_insert_own"
  on public.room_placements for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "room_placements_update_own"
  on public.room_placements for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "room_placements_delete_own"
  on public.room_placements for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "reports_select_own"
  on public.reports for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "support_resources_select_active"
  on public.support_resources for select to authenticated
  using (is_active);

create policy "inquiry_drafts_select_own"
  on public.inquiry_drafts for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "inquiry_drafts_update_own"
  on public.inquiry_drafts for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "inquiry_drafts_delete_own"
  on public.inquiry_drafts for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "ai_jobs_select_own"
  on public.ai_jobs for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "activity_events_select_own"
  on public.activity_events for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "activity_events_insert_own"
  on public.activity_events for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "user_feedback_select_own"
  on public.user_feedback for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "user_feedback_insert_own"
  on public.user_feedback for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
