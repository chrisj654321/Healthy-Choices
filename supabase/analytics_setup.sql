-- ============================================================================
-- analytics_setup.sql
-- Run ONCE in the Supabase Dashboard (SQL Editor) before build 28 ships.
--
-- Purpose: anonymous, aggregate-only product-interaction analytics.
-- No user_id, no device id, no session id — this table can never be joined
-- back to an individual. It exists purely so the founder can query
-- aggregate scan trends (which products/categories/scores shoppers engage
-- with). Nothing here requires an Apple ATT prompt.
-- ============================================================================

-- Create the scan_events table.
-- Columns are intentionally limited to anonymous, aggregate-safe fields.
create table if not exists public.scan_events (
  id          uuid primary key default gen_random_uuid(),  -- random row id, not a user identifier
  barcode     text not null,                                -- product barcode
  category    text,                                         -- product category, if known
  score       int,                                          -- computed health score at time of view
  grade       text,                                         -- computed letter grade at time of view
  source      text,                                         -- 'scan' | 'search' | 'history' | 'category' | 'home'
  created_at  timestamptz not null default now()            -- event timestamp
);

-- Enable Row Level Security so clients can only do exactly what the
-- policies below allow (insert-only, no read access from the app).
alter table public.scan_events enable row level security;

-- Allow INSERT from both authenticated and anonymous (anon) client roles.
-- This is what lets the app log events regardless of whether the shopper
-- is signed in — logging is never conditioned on account state.
-- (Postgres has no CREATE POLICY IF NOT EXISTS, so drop-then-create keeps
-- this script safe to re-run.)
drop policy if exists "scan_events_insert_anon_and_authenticated" on public.scan_events;
create policy "scan_events_insert_anon_and_authenticated"
  on public.scan_events
  for insert
  to authenticated, anon
  with check (true);

-- Deliberately NO select policy for authenticated/anon roles.
-- This means the app itself can never read this table back — only the
-- Supabase dashboard (as table owner) or a service-role key (server-side,
-- never shipped in the app) can query it. This keeps the data
-- write-only from the client's perspective and reduces the surface for
-- any future re-identification concerns.
