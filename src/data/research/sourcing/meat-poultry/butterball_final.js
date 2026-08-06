// src/data/research/sourcing/meat-poultry/butterball_final.js
module.exports = {
  companyId: 'butterball',
  sourcing: {
    industry: 'meat-poultry',
    lastVerified: '2026-08-05',

    model: 'unknown',
    modelSource: {
      name: "Butterball's sourcing model (company-owned flocks vs. contract growers) was not resolved in this research pass. Seaboard Corporation's FY2021-FY2023 10-K filings (Seaboard holds a noncontrolling equity interest in Butterball — see practices[] — and does not consolidate Butterball's financials, since it is an equity-method investee) contain no turkey-specific sourcing-model disclosure. The only 'contract grower' language found in the FY2023 10-K explicitly describes Seaboard's separate PORK segment, not Butterball/turkey, and should not be inferred to apply to Butterball. No Butterball-direct source describing its own sourcing model was found.",
      url: 'https://www.sec.gov/Archives/edgar/data/88121/000008812124000025/seb-20231231x10k.htm',
      date: '2026-08-05',
      basis: 'company-disclosure',
    },

    certifications: [
      {
        name: 'American Humane Certified',
        verifier: 'American Humane Association, via its American Humane Certified™ Farm program',
        scope: "Per Butterball's own description, the certification covers 'contract farmers, operations team, transportation partners and harvest facilities' — i.e., described by Butterball as covering its full turkey supply chain. The certification's existence and AHA as verifier are independently confirmed (certifier's own materials plus Butterball's own press release); this specific SCOPE claim is Butterball's own statement, recorded as company-disclosure even though the certification itself is third-party.",
        standard: "The certifier's own description of its standard, quoted and attributed rather than adopted: AHA's materials describe '200 rigorous, science-based standards,' annually audited (audits may be unannounced). 'Rigorous' is AHA's word, not this record's. That rigor has been publicly contested: in a 2014 FTC complaint (see enforcement[]), PETA characterized the certified standard as close to standard industry practice. No agency or court has ruled on either characterization, so both are recorded and neither is endorsed here.",
        verifiedDate: '2026-08-05',
        source: {
          name: 'American Humane Society, "American Humane Certified™ Producer Spotlight: Butterball"; Butterball Foodservice press release, "Butterball to Earn American Humane Certified™ Program Recognition for Third Consecutive Year." Exact first-certification year is disputed across sources (2013 vs. 2014) — not asserted here.',
          url: 'https://www.americanhumane.org/article/american-humane-certified-producer-spotlight-butterball/',
        },
      },
    ],

    welfareMeatPoultry: {
      gapStep: 'none',
      gapStepSource: {
        name: "Confirmed absent via direct search of GAP's own public directories: the 'For Shoppers' full partner/brand directory (globalanimalpartnership.org/shoppers/) does not list Butterball among its turkey partners (Diestel Turkey, Mary's Turkey, JD Farms Specialty Turkey, and others are listed; Butterball is not). Independently re-fetched and confirmed at fact-check (separate fetch, same result).",
        url: 'https://globalanimalpartnership.org/shoppers/',
        date: '2026-08-05',
        basis: 'third-party-audit',
      },
      grassFinished: 'not-applicable',
      grassFinishedSource: {
        name: 'Butterball is a turkey producer/processor; grass-fed/grass-finished is a beef/lamb claim type and does not apply to its product line.',
        url: 'https://www.butterball.com/',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      gestationCrateStatus: 'not-applicable',
      gestationCrateSource: {
        name: 'Butterball is a turkey producer/processor; gestation-crate status is a pork-industry claim type and does not apply to its product line.',
        url: 'https://www.butterball.com/',
        date: '2026-08-05',
        basis: 'company-disclosure',
      },
      chillMethod: 'unknown',
      chillMethodSource: {
        name: "Butterball's company-wide chilling method is unresolved. The only chilling-method evidence found is scoped to one plant: a MEAT+POULTRY trade-press profile reports that the Mount Olive, NC plant uses a water-chilled (immersion) system (recorded as a plant-scoped, secondary-sourced claim in practices[]). No equivalent report was found for the Huntsville, AR or Raeford, NC plants, and no company-wide statement was found on Butterball's own sites, so this field stays 'unknown' rather than generalizing the single-plant finding.",
        url: 'https://www.meatpoultry.com/articles/29906-butterball-implements-controlled-growth',
        date: '2026-08-05',
        basis: 'investigative-journalism',
      },
      scorecards: [],
    },

    enforcement: [
      {
        year: 2026,
        body: 'U.S. Court of Appeals for the Fourth Circuit — Figueroa v. Butterball, LLC, No. 24-1861',
        action:
          "Osvaldo Figueroa, a Butterball turkey loader paid on a piece-rate basis, brought FLSA and North Carolina Wage and Hour Act claims alleging Butterball owed him unpaid overtime, framed as a proposed collective/class action (E.D.N.C., filed 2020). The district court ruled against Figueroa's claims (finding his own paystubs reflected a piece-rate, not hourly, pay scheme), and on Jan. 13, 2026 a Fourth Circuit panel affirmed, per Bloomberg Law, Law360, and Littler Mondaq legal-press coverage (the primary docket/opinion could not be independently fetched — CourtListener and Justia both blocked direct requests). Figueroa filed a petition for rehearing en banc on Jan. 26, 2026; as of this record's research date (2026-08-05), no outcome of that petition has been confirmed, so this case's final resolution is not yet settled.",
        status: 'pending',
        amount: null,
        source: {
          name: 'Bloomberg Law, "Butterball Gets Poultry Worker\'s Would-Be OT Class Suit Tossed"; corroborated by Law360 ("4th Circ. Keeps Butterball\'s Win In Wage Dispute") and Littler Mondaq\'s "January 2026 Appellate Roundup" — all secondary legal press; primary CourtListener docket/opinion not independently confirmed (blocked fetch on both research and fact-check passes)',
          url: 'https://news.bloomberglaw.com/litigation/butterball-gets-poultry-workers-would-be-ot-class-suit-tossed',
        },
      },
      {
        year: 2014,
        body: 'NO AGENCY ACTION — third-party complaint filed by PETA (People for the Ethical Treatment of Animals). The Federal Trade Commission is named here only as the office the complaint was mailed to; the FTC is not a party to this entry, opened no confirmed proceeding, and made no finding. This entry records a private advocacy group\'s filing, not a government enforcement action.',
        action:
          "NOT AN ENFORCEMENT ACTION. No FTC investigation, enforcement action, consent order, or public finding on this complaint has ever been confirmed — anyone reading this entry should not infer that any federal agency acted, reviewed, or agreed with the complaint. What is confirmed is only this: PETA, an advocacy organization, filed a complaint with the FTC around Nov. 2014, in which PETA argued that Butterball's American Humane Certified label was misleading and characterized the certified standard as close to standard industry practice. Those are PETA's own contentions, not findings by anyone. The fact that the filing occurred is independently confirmed via PETA's own press release and contemporaneous Washington Post coverage; the contentions themselves remain unadjudicated. The FTC does not make complaint status public, so the absence of any FTC record is not evidence in either direction.",
        status: 'alleged',
        amount: null,
        source: {
          name: 'PETA press release, "PETA Files FTC Complaint Over Inhumane Treatment of Butterball Birds"; corroborated by Washington Post, "PETA wants \'humanely raised\' label stripped from Butterball turkeys" (Nov. 2014)',
          url: 'https://www.peta.org/news/consumer-alert-dont-fooled-butterballs-humane-label/',
        },
      },
    ],

    recalls: [
      {
        year: 2019,
        agency: 'USDA-FSIS',
        product: 'Raw ground turkey products (multiple fat percentages, including a Food Lion-branded line)',
        reason: 'Possible Salmonella Schwarzengrund contamination',
        scope: 'Approximately 78,164 lbs, produced at the Mount Olive, NC establishment (sell/freeze-by 7/26/18, lot code 8188), shipped to institutional and retail locations nationwide',
        scale: 'own-facility',
        healthImpact: { illnesses: 7, hospitalizations: 1, deaths: 0 },
        source: {
          name: "CDC's own archived outbreak page (primary government source, final tally: 7 illnesses, 3 states — MN/NC/WI, 1 hospitalization, 0 deaths). Note: contemporaneous Food Safety News reporting from March 2019 cited an early count of 6 illnesses before the investigation closed; CDC's 7 is used here as the final, authoritative figure.",
          url: 'https://archive.cdc.gov/www_cdc_gov/salmonella/schwarzengrund-03-19/index.html',
          date: '2019-03-13',
        },
      },
    ],

    practices: [
      {
        claim:
          "Butterball holds an active USDA AMS Process Verified Program listing covering its Huntsville, AR (Est. P7174), Mount Olive, NC (Est. P7345), and Raeford, NC (Est. P46870) plants, with a verified process point: 'No Antibiotics Ever – from the egg to the day of hatch to processing, these birds receive absolutely no antibiotics of any kind.' This is a government-audited claim (USDA AMS auditors verify compliance against a company-submitted quality manual) for output from these three plants, not merely a company disclosure; whether it covers 100% of Butterball's company-wide turkey output was not confirmed.",
        basis: 'government-record',
        source: {
          name: 'USDA Agricultural Marketing Service, "Butterball, LLC Process Verified Program" (direct fetch blocked, HTTP 403; page content independently corroborated via WebSearch on both the research and fact-check passes)',
          url: 'https://www.ams.usda.gov/content/butterball-llc-process-verified-program',
          date: '2026-08-05',
        },
      },
      {
        claim:
          "No GAP (Global Animal Partnership), Certified Humane, or A Greener World (Animal Welfare Approved) certification was found for Butterball as of 2026-08-05, based on direct searches of each certifier's own public directory.",
        basis: 'third-party-audit',
        source: {
          name: "Global Animal Partnership 'For Shoppers' directory; Certified Humane 'Who's Certified' database; A Greener World directory search. GAP and Certified Humane absences were independently re-confirmed at fact-check via separate direct re-fetches; the AGW re-fetch returned HTTP 403 on retry, but is corroborated by an independent WebSearch turning up no connection and by the same methodology succeeding for the other two certifiers.",
          url: 'https://globalanimalpartnership.org/shoppers/',
          date: '2026-08-05',
        },
      },
      {
        claim:
          "According to an on-site MEAT+POULTRY trade-press profile citing named Butterball plant staff, Butterball's Mount Olive, NC plant uses a water-chilled (immersion/agitation) processing system — a 'Morris chilling system' with a peracetic acid additive, bringing carcass temperature from 104°F to 40°F over approximately 5 hours. This is a single secondary source, not a primary record, and it describes the Mount Olive plant only; no equivalent report was found for the Huntsville, AR or Raeford, NC plants, and it is NOT a company-wide claim about Butterball.",
        basis: 'investigative-journalism',
        source: {
          name: 'MEAT+POULTRY (Sosland Publishing), "Controlled growth" — on-site trade-press profile based on an interview with named Butterball plant staff; a secondary source, not independently re-fetched by the fact-checker',
          url: 'https://www.meatpoultry.com/articles/29906-butterball-implements-controlled-growth',
          date: '2026-08-05',
        },
      },
      {
        claim:
          "Seaboard Corporation holds a 52.5% noncontrolling equity interest in Butterball, LLC as of its FY2022 and FY2023 10-K filings, increased from a 50% interest reported in the FY2021 10-K. Trade press (WATTPoultry.com) attributes at least part of the increase to Seaboard's exercise of warrants held since the original 2010 investment, allowing it to acquire an additional 5% equity interest for a nominal price — not a renegotiated buy-in. Seaboard accounts for its Butterball stake as an equity-method investee, not a consolidated subsidiary.",
        basis: 'company-disclosure',
        source: {
          name: "Seaboard Corporation FY2021, FY2022, and FY2023 10-K filings, Item 1 (Business) (direct SEC.gov fetch blocked, HTTP 403 on both research and fact-check passes; exact quoted 10-K language independently corroborated via WebSearch on both passes); WATTPoultry.com, \"Did Seaboard up Butterball investment at an opportune time?\" for the warrant-exercise mechanism",
          url: 'https://www.sec.gov/Archives/edgar/data/88121/000008812123000020/seb-20221231x10k.htm',
          date: '2026-08-05',
        },
      },
    ],
  },
};
