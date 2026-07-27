-- ============================================================================
-- app_events_setup.sql
-- Run ONCE in the Supabase Dashboard (SQL Editor) to create the funnel +
-- retention analytics table. Idempotent — safe to re-run.
--
-- Purpose: answer three questions we currently cannot answer at all —
--   1. Where do users fall off? (onboarding step -> first scan -> paywall
--      shown -> dismissed or purchased)
--   2. When do they close the app?
--   3. Do they come back? (day-N retention)
--
-- 2026-07-27 decision: this table carries a PERSISTENT per-install random ID
-- (`install_id`) so retention can actually be computed ("did install X come
-- back on day 3?"). This is a deliberate, founder-approved reversal of the
-- 2026-07-02 "no persistent identifier" stance on THIS table only —
-- scan_events (see analytics_setup.sql) stays fully anonymous/unlinkable,
-- untouched by this change.
--
-- What is still NOT here, on purpose: no user_id, no email, no name, no IP,
-- no IDFA/IDFV, no device fingerprint, nothing joinable to a Food Exposé
-- account. `install_id` is a random UUID generated on-device and persisted
-- in AsyncStorage (see src/utils/appAnalytics.js) — it identifies an
-- INSTALL, not a person, and is wiped by an uninstall.
--
-- The absence of a user_id column is exactly what keeps this table eligible
-- for "Data Not Linked to You" on the App Store privacy label rather than
-- "Data Linked to You" — there is no column here that could ever be joined
-- back to an identity. `install_id` itself is still a declarable Identifier
-- on the label (see the header of appAnalytics.js for the ATT reasoning).
-- ============================================================================

-- Create the app_events table.
create table if not exists public.app_events (
  id                     uuid primary key default gen_random_uuid(),  -- random row id, not a user identifier
  install_id             text not null,   -- random per-install UUID, persisted on-device; dies with an uninstall
  session_id             text not null,   -- random per-launch UUID, in-memory only on-device; lets us tell "same session" apart from "came back later"
  event                  text not null,   -- one of the whitelisted event names in appAnalytics.js (app_open, onboarding_step, first_scan, paywall_shown, ...)
  step                   text,            -- qualifier: onboarding step name, or paywall trigger source ('scan' | 'search' | 'company' | 'history' | 'alternatives' | 'onboarding' | 'offer')
  app_version            text,            -- e.g. "1.2.0" — lets us scope a funnel/retention read to one shipped build
  platform               text,            -- 'ios' | 'android'
  days_since_last_open   int,             -- coarse bucket (0/1/3/7/14/30/31+), computed on-device from a locally-stored last-open timestamp; only set on 'app_open' events. Raw history never leaves the device.
  created_at             timestamptz not null default now()
);

-- Enable Row Level Security so clients can only do exactly what the
-- policies below allow (insert-only, no read access from the app).
alter table public.app_events enable row level security;

-- Allow INSERT from both authenticated and anonymous (anon) client roles —
-- logging must never depend on whether the shopper is signed in.
-- (Postgres has no CREATE POLICY IF NOT EXISTS, so drop-then-create keeps
-- this script safe to re-run.)
drop policy if exists "app_events_insert_anon_and_authenticated" on public.app_events;
create policy "app_events_insert_anon_and_authenticated"
  on public.app_events
  for insert
  to authenticated, anon
  with check (true);

-- Deliberately NO select policy for authenticated/anon roles.
-- The app itself can never read this table back — only the Supabase
-- dashboard (as table owner) or a service-role key (server-side, never
-- shipped in the app) can query it. Write-only from the client's
-- perspective, same posture as scan_events.
create index if not exists app_events_install_id_idx on public.app_events (install_id);
create index if not exists app_events_event_idx      on public.app_events (event);
create index if not exists app_events_created_at_idx on public.app_events (created_at);


-- ============================================================================
-- AD-HOC QUERIES — run individually in the SQL Editor whenever you want an
-- answer. Not part of setup; nothing below CREATEs anything or needs to be
-- re-run on a schedule. Each is commented so a non-SQL reader can tell what
-- it returns.
-- ============================================================================

-- ── 1. Onboarding funnel with drop-off per step ────────────────────────────
-- Returns one row per onboarding step, in flow order, with how many distinct
-- installs reached that step and what % that is of the step right before it
-- (100% = nobody dropped off between those two steps).
with step_order (step, ord) as (
  values
    ('welcome', 1), ('reveal', 2), ('stats', 3), ('transparency', 4),
    ('goal', 5), ('challenge', 6), ('commitment', 7), ('paywall', 8), ('ready', 9)
),
reached as (
  select step, count(distinct install_id) as installs_reaching_step
  from public.app_events
  where event = 'onboarding_step'
  group by step
)
select
  so.ord,
  so.step,
  coalesce(r.installs_reaching_step, 0) as installs_reaching_step,
  round(
    100.0 * coalesce(r.installs_reaching_step, 0)
    / nullif(lag(coalesce(r.installs_reaching_step, 0)) over (order by so.ord), 0),
    1
  ) as pct_of_previous_step
from step_order so
left join reached r on r.step = so.step
order by so.ord;

-- ── 2. Paywall shown -> purchase conversion ────────────────────────────────
-- Overall: how many distinct installs saw ANY paywall vs. how many of those
-- ever completed a purchase (main paywall OR the 50%-off exit offer).
select
  count(distinct case when event = 'paywall_shown'     then install_id end) as installs_shown_paywall,
  count(distinct case when event = 'purchase_completed' then install_id end) as installs_purchased,
  round(
    100.0 * count(distinct case when event = 'purchase_completed' then install_id end)
    / nullif(count(distinct case when event = 'paywall_shown' then install_id end), 0),
    1
  ) as conversion_pct
from public.app_events
where event in ('paywall_shown', 'purchase_completed');

-- ── 2b. Same conversion, broken out by trigger source ──────────────────────
-- Which of the ~8 in-app paywall triggers (plus 'onboarding') actually
-- convert. Note: purchases made via the exit-offer screen are tagged
-- step = 'offer' regardless of which paywall trigger led there, so this
-- breakdown undercounts a source's TRUE conversion whenever a user bounces
-- off that paywall into the offer and buys there — use query #2 above for
-- the honest overall rate.
select
  step as paywall_source,
  count(distinct install_id) as installs_shown
from public.app_events
where event = 'paywall_shown'
group by step
order by installs_shown desc;

-- ── 3. Day-N retention curve, keyed on install_id ──────────────────────────
-- Of everyone whose first-ever app_open we've seen, what % opened the app
-- again exactly 1 / 3 / 7 / 14 / 30 days later. This is the "do they come
-- back" number — it only works because install_id is persistent across
-- launches.
with first_open as (
  select install_id, min(created_at)::date as day0
  from public.app_events
  where event = 'app_open'
  group by install_id
),
opens as (
  select distinct install_id, created_at::date as open_date
  from public.app_events
  where event = 'app_open'
)
select
  count(distinct fo.install_id) as cohort_size,
  round(100.0 * count(distinct case when o.open_date = fo.day0 + 1  then fo.install_id end) / nullif(count(distinct fo.install_id), 0), 1) as day1_retention_pct,
  round(100.0 * count(distinct case when o.open_date = fo.day0 + 3  then fo.install_id end) / nullif(count(distinct fo.install_id), 0), 1) as day3_retention_pct,
  round(100.0 * count(distinct case when o.open_date = fo.day0 + 7  then fo.install_id end) / nullif(count(distinct fo.install_id), 0), 1) as day7_retention_pct,
  round(100.0 * count(distinct case when o.open_date = fo.day0 + 14 then fo.install_id end) / nullif(count(distinct fo.install_id), 0), 1) as day14_retention_pct,
  round(100.0 * count(distinct case when o.open_date = fo.day0 + 30 then fo.install_id end) / nullif(count(distinct fo.install_id), 0), 1) as day30_retention_pct
from first_open fo
left join opens o on o.install_id = fo.install_id;
