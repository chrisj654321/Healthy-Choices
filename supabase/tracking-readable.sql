-- ============================================================================
-- tracking-readable.sql
-- Plain-English versions of the funnel/retention queries in app_events_setup.sql.
-- Built for reading at a glance, not for SQL people.
--
-- ── HOW TO USE THIS (important — this is what was confusing before) ──────────
-- The Supabase SQL Editor shows the result of only ONE query at a time. If you
-- paste several queries into one tab and hit Run, you see ONLY the last one's
-- table and the rest stay hidden. So:
--
--   1. Make a SEPARATE query tab for each of the two queries below (the "+"
--      next to your tabs). Name them "Funnel" and "Who did what".
--   2. Paste ONE query into each tab. Do NOT stack them in the same tab.
--   3. Click Run (or press Ctrl/Cmd + Enter) with nothing highlighted, so it
--      runs the whole query. If you highlight part of it, it runs only that
--      part — that is what gave you the near-empty result before.
-- ============================================================================


-- ════════════════════════════════════════════════════════════════════════════
-- QUERY 1 — THE FUNNEL, in order, in plain words.
-- One row per step of the journey, from opening the app to subscribing.
-- "How many people" = distinct installs that reached that step.
-- "% who continued" = of the people on the step above, how many made it to
-- this one. A low number is where you are losing people.
-- ════════════════════════════════════════════════════════════════════════════
with counts as (
  select
    count(distinct case when event='app_open'                                          then install_id end) as opened_app,
    count(distinct case when event='onboarding_step' and step='welcome'                then install_id end) as s_welcome,
    count(distinct case when event='onboarding_step' and step='reveal'                 then install_id end) as s_reveal,
    count(distinct case when event='onboarding_step' and step='stats'                  then install_id end) as s_stats,
    count(distinct case when event='onboarding_step' and step='transparency'           then install_id end) as s_transparency,
    count(distinct case when event='onboarding_step' and step='goal'                   then install_id end) as s_goal,
    count(distinct case when event='onboarding_step' and step='challenge'              then install_id end) as s_challenge,
    count(distinct case when event='onboarding_step' and step='commitment'             then install_id end) as s_commitment,
    count(distinct case when event='onboarding_step' and step='paywall'                then install_id end) as s_paywall,
    count(distinct case when event='onboarding_step' and step='ready'                  then install_id end) as s_ready,
    count(distinct case when event='first_scan'                                        then install_id end) as first_scan,
    count(distinct case when event='paywall_shown'                                     then install_id end) as saw_paywall,
    count(distinct case when event='purchase_started'                                  then install_id end) as tapped_subscribe,
    count(distinct case when event='purchase_completed'                                then install_id end) as subscribed
  from public.app_events
),
funnel (ord, stage, people) as (
  select  1, 'Opened the app',                     (select opened_app     from counts) union all
  select  2, 'Onboarding — Welcome screen',        (select s_welcome      from counts) union all
  select  3, 'Onboarding — Reveal screen',         (select s_reveal       from counts) union all
  select  4, 'Onboarding — Stats screen',          (select s_stats        from counts) union all
  select  5, 'Onboarding — Transparency screen',   (select s_transparency from counts) union all
  select  6, 'Onboarding — Goal screen',           (select s_goal         from counts) union all
  select  7, 'Onboarding — Challenge screen',      (select s_challenge    from counts) union all
  select  8, 'Onboarding — Commitment screen',     (select s_commitment   from counts) union all
  select  9, 'Onboarding — Paywall screen',        (select s_paywall      from counts) union all
  select 10, 'Onboarding — Ready (finished setup)',(select s_ready        from counts) union all
  select 11, 'Scanned their first product',        (select first_scan     from counts) union all
  select 12, 'Saw a paywall (anywhere in app)',    (select saw_paywall    from counts) union all
  select 13, 'Tapped Subscribe',                   (select tapped_subscribe from counts) union all
  select 14, 'Subscribed (paid)',                  (select subscribed     from counts)
)
-- "% of everyone who opened the app" is used instead of "% vs the row above"
-- on purpose: some rows (Saw a paywall, Tapped Subscribe, Subscribed) happen
-- DURING onboarding, not strictly after scanning, so a row-vs-row percentage
-- can read over 100% and mislead. Comparing every row to the same base — the
-- people who opened the app — is always honest and always <= 100%.
select
  stage                                              as "What they did",
  people                                             as "How many people",
  case
    when (select opened_app from counts) = 0 then null
    else round(100.0 * people / (select opened_app from counts), 0)
  end                                                as "% of everyone who opened the app"
from funnel
order by ord;


-- ════════════════════════════════════════════════════════════════════════════
-- QUERY 2 — WHO DID WHAT. One row per person (anonymous install), newest first.
-- Reads like a sentence: subscribed, or scanned but did not pay, or exactly
-- which setup screen they left on. "Person" is a short, meaningless code — it
-- is NOT a name, email, or anything traceable to a real human. It only lets you
-- tell two people apart.
-- ════════════════════════════════════════════════════════════════════════════
with per_install as (
  select
    install_id,
    bool_or(event = 'purchase_completed') as subscribed,
    bool_or(event = 'first_scan')         as scanned,
    max(created_at)                       as last_seen
  from public.app_events
  group by install_id
)
select
  left(pi.install_id, 8)                              as "Person (anonymous)",
  case
    when pi.subscribed              then 'Subscribed 🎉'
    when pi.scanned                 then 'Scanned products — no subscription yet'
    when fs.label is not null       then 'Left during setup — got as far as ' || fs.label
    else                                 'Opened the app, did nothing else'
  end                                                 as "What happened",
  to_char(pi.last_seen, 'Mon DD  HH24:MI')            as "Last active (UTC)"
from per_install pi
left join lateral (
  select o.label
  from public.app_events e
  join (values
    ('welcome',      'the Welcome screen',       1),
    ('reveal',       'the Reveal screen',        2),
    ('stats',        'the Stats screen',         3),
    ('transparency', 'the Transparency screen',  4),
    ('goal',         'the Goal screen',          5),
    ('challenge',    'the Challenge screen',      6),
    ('commitment',   'the Commitment screen',    7),
    ('paywall',      'the Paywall screen',       8),
    ('ready',        'the final Ready screen',   9)
  ) o(step, label, n) on o.step = e.step
  where e.install_id = pi.install_id
    and e.event = 'onboarding_step'
  order by o.n desc
  limit 1
) fs on true
order by pi.last_seen desc;


-- ════════════════════════════════════════════════════════════════════════════
-- QUERY 3 — QUICK GLANCE. One row, three numbers. Your 5-second daily check.
-- "Installs" = distinct devices that ever opened the app.
-- "Scanners" = how many of them scanned at least one product.
-- "Subscribers" = how many of them completed a paid subscription.
-- The two "%" columns turn those into the only rates that matter day to day:
-- what share of installs actually USE the app, and what share PAY.
-- ════════════════════════════════════════════════════════════════════════════
with c as (
  select
    count(distinct case when event = 'app_open'           then install_id end) as installs,
    count(distinct case when event = 'first_scan'         then install_id end) as scanners,
    count(distinct case when event = 'purchase_completed' then install_id end) as subscribers
  from public.app_events
)
select
  installs                                                        as "Installs",
  scanners                                                        as "Scanners",
  subscribers                                                     as "Subscribers",
  case when installs = 0 then null
       else round(100.0 * scanners    / installs, 0) end          as "% who scanned",
  case when installs = 0 then null
       else round(100.0 * subscribers / installs, 0) end          as "% who subscribed"
from c;
