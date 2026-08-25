// PepsiCo — GMO-labeling ballot-measure opposition
// Agent 3 (Legal Writer) final output. Legal-separation pipeline: /political-analysis.
// Built ONLY from VERIFIED facts in pepsico_gmo_labeling_factcheck.md.
// Flag handling applied: UNVERIFIED items (the ~$45.6M "opposition raised" figure,
// the Jan 20 2022 standalone SCOTUS ruling, the extra departed-members list, the
// 2023 "16%" trade-association PDF figure) are OMITTED. DISPUTED items (the Oregon
// recount vote margin and the DARK Act House vote tally) are OMITTED per instruction.
// No election OUTCOMES are placed adjacent to any spending figure (causation-by-
// juxtaposition rule) — outcomes are left out of the user-facing entry entirely.
// PepsiCo was a GMA member-CONTRIBUTOR, not the defendant, in the concealment case;
// the adjudicated violation and $9M resolution are attributed to GMA, not PepsiCo.

// ── ISSUE ENTRY (drop into PepsiCo's issues array in companies.js) ──────────────
export const gmoLabelingIssue = {
  id: 'gmo-labeling-opposition',
  title: 'Funded opposition to GMO-labeling ballot measures',
  // 'medium': PepsiCo's OWN conduct here is lawful, disclosed political spending —
  // no conviction, consent order, or adjudicated penalty against PepsiCo. Rated
  // medium as a "documented pattern with multiple [primary] sources" (four states),
  // NOT high — the $18M/$9M adjudication was against GMA, not PepsiCo.
  severity: 'medium',
  description:
    "Between 2012 and 2014, PepsiCo made more than $8 million in disclosed contributions to campaigns opposing mandatory GMO-labeling ballot measures in California, Washington, Colorado, and Oregon, per state campaign-finance filings. Part of PepsiCo's Washington spending flowed through the Grocery Manufacturers Association's \"Defense of Brands\" account; the association — not PepsiCo — was later found by Washington courts to have violated state campaign-disclosure law and resolved the matter for $9 million in 2022. PepsiCo, a member of GMA's successor the Consumer Brands Association, states that bioengineered ingredients are safe and that it complies with applicable labeling requirements.",
  // Legal Reviewer (Agent 4) fix applied 2026-07-19: removed the standalone $2.696M
  // figure + additive "also" from this field — it double-counted the $8M sum's WA
  // component. The $2.696M remains available below as a STANDALONE-only alternative.
  source:
    'State campaign-finance filings via Ballotpedia (CA SOS 2012, WA PDC 2013, CO TRACER 2014, OR 2014); Washington State Attorney General press releases (2016–2022); PepsiCo ESG disclosure (2025)',
};

/* ── ONBOARDING COPY FACTS ───────────────────────────────────────────────────────
   VERIFIED figures only. Each is a name-matched, primary-sourced PepsiCo dollar
   amount. Use these directly in onboarding copy.

   FOUR DIRECT STATE CONTRIBUTIONS (each = money attributed to "PepsiCo" by name in
   that state's own campaign-finance system, opposing the measure):
     • CA Proposition 37 (2012):      $2,430,675   — "No on 37"   (CA SOS via Ballotpedia)
     • WA Initiative 522 (2013):      $1,620,899   — "No on 522"  (WA PDC via Ballotpedia)
     • CO Proposition 105 (2014):     $1,650,000   — "No on 105"  (CO TRACER via Ballotpedia)
     • OR Measure 92 (2014):          $2,350,000   — "No on 92"   (Ballotpedia / OR filings)
     ---------------------------------------------------------------------------------
     SUM OF THE FOUR DIRECT FIGURES = $8,051,574  →  supports "more than $8 million."

   FIFTH FIGURE — DO NOT ADD IT TO THE $8,051,574 (double-count hazard):
     • WA "Defense of Brands" account (2013):  $2.696 million
       This is PepsiCo's TOTAL payment into GMA's Defense-of-Brands account through
       12/3/2013 — a SECOND accounting of PepsiCo's SAME Washington I-522 effort, not
       a fifth separate campaign. The $1,620,899 above is the portion disclosed under
       PepsiCo's name in WA filings (as of 10/30/2013); the $2.696M is PepsiCo's full
       payment into the GMA account that itself routed member money to "No on 522."
       They describe the SAME Washington opposition money at two different cut points.
       RULE: use exactly ONE Washington figure in any single statement. Never sum
       $1,620,899 + $2.696M, and never present the $2.696M as PepsiCo "concealing"
       anything — the concealment finding was against GMA, not PepsiCo.

   STRONGEST DEFENSIBLE ONBOARDING LINE (arithmetically checked):
     "PepsiCo contributed more than $8 million to campaigns opposing mandatory
      GMO-labeling ballot measures in four states (2012–2014)."
     → Verified: $2,430,675 + $1,620,899 + $1,650,000 + $2,350,000 = $8,051,574,
       i.e. > $8,000,000. Uses only the four DIRECT state figures; the WA $2.696M
       account figure is NOT included, so there is no double-count.

   Alternative phrasing that is also true (single state, no summing):
     "In Washington alone, PepsiCo contributed $2.696 million toward defeating the
      2013 GMO-labeling initiative (Initiative 522)."   ← uses the account figure by
      itself; do NOT combine with the $8M line or with the $1,620,899 figure.

   DO NOT USE in onboarding copy:
     • Any election vote margin (Oregon recount margin was DISPUTED — omitted).
     • Any House/Senate vote tally for the 2016 federal law (DISPUTED — omitted).
     • The "$45.6M opposition raised" total (UNVERIFIED).
     • Any wording that says PepsiCo hid, concealed, or was penalized for donors —
       that adjudicated finding belongs to GMA, not PepsiCo.
─────────────────────────────────────────────────────────────────────────────────── */
