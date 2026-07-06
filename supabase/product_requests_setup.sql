-- ============================================================================
-- product_requests_setup.sql
-- Run ONCE in the Supabase Dashboard (SQL Editor).
--
-- Purpose: lock down the product_requests table (created ad-hoc, no RLS yet)
-- the same way scan_events was locked down — insert-only from the app,
-- no client read access. Unlike scan_events, this table DOES carry a
-- user_id when the requester is signed in (that's intentional: it's a real
-- demand-ranking queue for Octavius, not an anonymous analytics stream) —
-- but the app itself never reads it back (src/utils/productRequests.js's
-- getRequests() only reads local AsyncStorage), so client SELECT access
-- is still unnecessary and should stay closed.
-- ============================================================================

-- Safe if the table already exists with this shape (it does, per the app's
-- real inserts in src/utils/productRequests.js: barcode, name, brand, user_id).
-- If your existing table has additional columns already, this is a no-op —
-- it will NOT alter an existing table's shape.
create table if not exists public.product_requests (
  id           uuid primary key default gen_random_uuid(),
  barcode      text,
  name         text,
  brand        text,
  user_id      uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

-- Before applying policies, see what's already there (ad-hoc tables sometimes
-- pick up a permissive default policy from dashboard setup). Run this first
-- and eyeball the output — if anything looks like "allow all" or a stray
-- select policy, drop it explicitly before/after running the block below.
--   select * from pg_policies where tablename = 'product_requests';

alter table public.product_requests enable row level security;

-- Clear any pre-existing policy with these exact names before recreating,
-- so this script is safe to re-run.
drop policy if exists "product_requests_insert_anon_and_authenticated" on public.product_requests;

-- Allow INSERT from both authenticated and anonymous (anon) client roles —
-- matches scan_events: logging a request is never conditioned on account state.
create policy "product_requests_insert_anon_and_authenticated"
  on public.product_requests
  for insert
  to authenticated, anon
  with check (true);

-- Deliberately NO select/update/delete policy for authenticated/anon roles.
-- The app never reads this table back (My Requests reads local AsyncStorage
-- only) — only the Supabase dashboard (table owner) or a service-role key
-- (server-side, never shipped in the app) can query it. Keep it write-only
-- from the client's perspective, same posture as scan_events.
