-- ============================================================================
-- feature_requests_setup.sql
-- Run ONCE in the Supabase Dashboard (SQL Editor).
--
-- Purpose: the "Suggest a Feature" loop — same posture as product_requests
-- (see product_requests_setup.sql): insert-only from the app, no client read
-- access. Carries user_id when the requester is signed in so demand can be
-- ranked, but the app never reads this table back (My Requests reads local
-- AsyncStorage only, see src/utils/featureRequests.js).
-- ============================================================================

create table if not exists public.feature_requests (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  details      text,
  user_id      uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

alter table public.feature_requests enable row level security;

-- Clear any pre-existing policy with this exact name before recreating,
-- so this script is safe to re-run.
drop policy if exists "feature_requests_insert_anon_and_authenticated" on public.feature_requests;

-- Allow INSERT from both authenticated and anonymous (anon) client roles —
-- matches product_requests: suggesting a feature is never conditioned on
-- account state.
create policy "feature_requests_insert_anon_and_authenticated"
  on public.feature_requests
  for insert
  to authenticated, anon
  with check (true);

-- Deliberately NO select/update/delete policy for authenticated/anon roles.
-- Only the Supabase dashboard (table owner) or a service-role key
-- (server-side, never shipped in the app) can query it. Write-only from the
-- client's perspective, same posture as scan_events and product_requests.
