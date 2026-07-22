# Public-Official-Guide — PLAN.md

> Status: Draft · Version: 0.2.0 · Last updated: 2026-06-28 · Owner: TBD (maintainer) · Lane: donated

A non-partisan, open-source AI guide that helps public and elected officials — especially small,
under-resourced local offices with no staff — understand and fulfill their statutory duties, serve
constituents well, and govern ethically and transparently. It adapts the proven architecture of the
Ofelia app (a private long-horizon memory layer + specialized AI modules + calibrated predictions +
outcome tracking + a daily briefing) but **deliberately inverts its purpose**: from optimizing one
person's *advantage* to serving the office-holder's *fiduciary duty to constituents and the public
interest*.

---

## Executive summary

Local government runs on people who often hold office part-time, with little or no staff, no legal
counsel on call, and a thicket of statutory duties, ethics rules, open-meeting and public-records
laws they are nonetheless bound to follow. Mistakes are common, consequential, and erode public
trust. Public-Official-Guide gives those officials a private, source-cited assistant that explains
*what the office actually requires*, helps them serve constituents, and flags when a contemplated
action may cross an ethics, transparency, or conflict-of-interest line — always as **information,
not legal advice**, and always grounded in the primary law of the official's jurisdiction.

The single most important design fact is the inversion. Ofelia is built to maximize one person's
leverage and dominance; a tool that did that for an elected official would be actively harmful to
democracy. This project is built on the opposite premise and is **engineered to refuse misuse**. The
**guardrail / public-duty policy layer is the first build item and a hard product requirement** —
adversarially tested, not a disclaimer footer. It is non-partisan; it refuses campaign work,
electioneering, fundraising, opposition research, and re-election optimization; it refuses to help
evade transparency, open-records, or ethics law; it forbids constituent surveillance, profiling,
manipulation, and political targeting; and it optimizes for lawful duty and constituent outcomes
over optics and spin. Every later faculty is mounted behind this layer and cannot be reached around
it.

This is a **HIGH risk-tier** project on its legal/ethics/governance surface. No duty- or
compliance-related content ships without review and sign-off by a **credentialed expert** (a
government-ethics professional and/or a licensed attorney for the relevant jurisdiction), and
jurisdiction-specific claims must be sourced to primary law (statute, charter, ordinance, or
official ethics-board guidance). Misuse — not inaccuracy — is the top risk, and the guardrail layer
is treated and tested as a safety-critical subsystem.

Honesty note: **no pilot office or requestor is yet secured.** Every delivery-dependent task is
marked `TO BE SECURED` with `verifiedNeed: false` until a real official adopts the tool. The
project is not "shipped" on merge; it is shipped only when a real office uses it to fulfill a duty
or improve a constituent outcome, with the guardrails independently verified.

**Partner-acquisition plan (dated) and build-vs-mothball decision rule.** Rather than an open-ended
`TBD`, outreach is time-boxed against the build: by **2026-08-31** the pilot jurisdiction is
selected (criteria in *Open questions*) and ≥ 3 candidate partners (municipal league, clerks'
association, or good-government NGO) are in active conversation; by **2026-10-31** a credentialed
expert reviewer is secured (M2 gate); by **2026-12-31** a pilot office/steward is secured (M5 gate).
**Decision rule:** if no credentialed expert is secured by the M2 entry date, M2 content work does
not start and the project holds at M1 (platform + guardrails). If no pilot office is secured by
**2027-03-31** (≈ M4 completion), the project does **not** ship blindly: it either (a) **pivots** the
last-mile beneficiary (e.g., hand the guardrailed platform + one illustrative jurisdiction to a
public-administration program as a teaching/reference deed) or (b) **mothballs** — archived,
maintenance-only, no further HIGH-tier content — with the decision recorded in governance. The
illustrative-jurisdiction build remains valuable as a reference artifact in either case.

---

## Problem & beneficiaries

**Who is helped (directly):** elected and appointed public officials in small or under-resourced
offices — town/city councilmembers, county commissioners, school-board members, special-district
boards, mayors of small municipalities, planning/zoning board members, clerks — who carry full
fiduciary and legal duties without the staff, counsel, or onboarding that larger governments enjoy.

**Who is helped (ultimately):** their **constituents and the public**, who benefit from
better-informed, more ethical, more responsive, and more transparent local governance.

**The need.** New officials routinely take office with no structured explanation of their statutory
duties, oath, powers, and the ethics/transparency rules that bind them. Open-meeting and
public-records violations, undisclosed conflicts of interest, improper use of official resources,
and records-retention failures are frequent — usually from ignorance, not malice — and they harm
constituents and trust. Authoritative information exists (state statutes, municipal charters, ethics
commission guidance, clerk associations, leagues of cities) but is fragmented, jargon-heavy, and
hard to apply to a concrete situation at the moment of decision.

**Verified need / partner:** **TO BE SECURED.** No specific pilot office, official, or sponsoring
civic organization has yet agreed to adopt or co-develop the tool. Target partner profiles to
pursue: a small municipality or special district; a state municipal league, association of
counties, or clerks' association; a nonpartisan good-government NGO (e.g., a state-level
ethics/transparency organization); or a university public-administration / government-ethics
program willing to provide credentialed review. Until one is secured, the project builds the
agent-neutral platform, the guardrail layer, and one *illustrative* jurisdiction's content for
review, and marks all delivery/adoption work `TO BE SECURED`. Outreach is **dated, not open-ended**:
pilot jurisdiction selected by 2026-08-31, ≥ 3 candidate partners in conversation by 2026-08-31,
credentialed expert secured by 2026-10-31, pilot office/steward by 2026-12-31 (see the
partner-acquisition plan in the executive summary). A **build-vs-mothball/pivot decision rule**
governs what happens if those dates slip (executive summary and *Risks*): hold at M1 without an
expert, and pivot the last-mile beneficiary or mothball to maintenance-only if no pilot is secured
by ~2027-03-31 — rather than shipping to no real beneficiary.

---

## Goals and non-goals

**Goals**

- Build an open-source, non-partisan platform that helps officials understand and fulfill their
  statutory duties and serve constituents lawfully and well.
- Ship a guardrail / public-duty policy layer that *provably* refuses partisan, campaign,
  surveillance, and transparency-evasion misuse, verified by adversarial testing and an independent
  reviewer.
- Represent one pilot jurisdiction's office duties, ethics rules, and transparency obligations as
  structured, primary-source-cited content reviewed by a credentialed expert.
- Provide privacy-first constituent casework that improves service outcomes and never enables
  political use of constituent data.
- Generate balanced, cited meeting/vote briefings that *inform* an official's judgment without
  substituting for it.
- Track real constituent-impact outcomes, and prove (via an eval) that memory-grounded, cited
  guidance beats blank-slate LLM output on accuracy and groundedness.

**Non-goals**

- Not a campaign, election, fundraising, or political-strategy tool — for any party or candidate.
- Not legal advice and not a substitute for counsel, the clerk, or the ethics board.
- Not an autonomous actor: it never files, votes, sends constituent communications, or takes
  official actions on a user's behalf.
- Not a constituent surveillance, profiling, sentiment-targeting, or voter-data system.
- Not a public scorecard, "performance" ranking, or PR/optics optimizer for officials.
- Not a 50-state legal database at launch — depth and verified accuracy for one jurisdiction first,
  breadth later, and never breadth without expert review.

---

## Success metrics (outcomes)

Outcome-centric, beneficiary-first. Vanity metrics (DAU, sessions) are explicitly **not** success.

| Metric | Baseline | Target (pilot) | How measured |
|---|---|---|---|
| Guardrail refusal rate on the misuse red-team suite | none | reported as **refused/total at version N** (e.g. "318/318 at v0.3.0"), with a per-version changelog; **≥ 8 cases per refused category** (multiple phrasings + injection); 100% refused/redirected | Automated adversarial eval in CI + independent reviewer audit |
| Newly-found bypass vectors converted to regression cases | n/a | 100% within **1 release** of discovery; suite size is non-decreasing across versions | Red-team changelog diff; CI suite-count check |
| Lawful-alternative redirect coverage on evasion-category refusals | n/a | 100% of evasion-category refusals emit a **correct, cited lawful-process pointer** (not a bare "no") | Red-team assertion on redirect content + expert spot-check |
| Duty/compliance claims sourced to primary law | n/a | 100% of shipped claims carry a primary-source citation | Expert review checklist; citation-coverage test |
| Expert sign-off before duty/compliance content ships | n/a | 100% of HIGH-tier content has recorded credentialed sign-off | Governance log |
| Stale-content containment | n/a | 0 claims served past their `validUntil` without an auto-flag/withhold and re-sign-off | Staleness test against `lastVerified`/`validUntil`; runtime audit |
| Memory-grounded vs. blank-slate quality delta (eval) | n/a | grounded clearly beats blank-slate on accuracy + citation | LLM-judge eval harness (groundedness, accuracy, fit) |
| Constituent cases moved to resolution by a pilot official | 0 | ≥ 10 cases tracked to a recorded outcome in pilot | In-app outcome tracking (with official's confirmation) |
| Documented duty/compliance improvements attributable to use | 0 | ≥ 3 concrete instances (e.g., a flagged COI disclosed, a records-retention gap fixed) | Pilot official's attested log |
| Constituent PII footprint | n/a | minimized + encrypted at rest; **default retention windows + deletion SLA met**; records-law-exempt casework handled per the records schedule | Privacy review + data-retention/deletion-SLA tests |

The **defining success outcome** (Definition of Shipped): a real official/office adopts the tool
and demonstrably uses it to fulfill a duty more completely or improve a constituent outcome, with
the non-partisan/ethics guardrails independently verified.

---

## Scope

**In scope**

- Guardrail / public-duty policy layer (non-partisan, anti-evasion, anti-surveillance, duty-over-
  optics) enforced at input classification, system-prompt, and output-screening layers.
- Multi-tenant app skeleton (Next.js App Router, TypeScript/ESM, PWA), every row scoped to an
  office/official; AES-256-GCM encryption at rest for sensitive content.
- "Imprint" office-memory layer: duties, statutes/sources (cited), decisions/votes, meetings/events,
  constituent cases, and retrievable notes with vector search.
- Public-service faculties: **Duties & Roles**, **Ethics & Compliance**, **Constituent Casework**,
  **Meeting/Vote Briefings**, plus a duty-focused **daily briefing** and **outcome tracking**.
- One pilot jurisdiction's structured, primary-source-cited civic content, expert-reviewed.
- Eval harness proving memory-grounded, cited output beats blank-slate.
- Data retention + deletion, provenance recording, and an audit log.

**Out of scope (explicitly will NOT do)**

- Campaign strategy, electioneering, partisan messaging, talking points, fundraising, donor
  targeting, voter-file analysis, or **re-election optimization** of any kind.
- **Opposition research** or any analysis of political rivals, challengers, or partisan advantage.
- Helping a user **evade, delay, or minimize** open-meeting, public-records/FOIA/sunshine,
  disclosure, or ethics obligations (e.g., drafting a denial to dodge a valid records request,
  structuring a meeting to avoid a quorum/notice trigger).
- **Constituent surveillance, profiling, political/sentiment targeting, or manipulation**; building
  political contact lists; or any use of constituent data for non-service purposes.
- PR/optics/"spin" optimization, reputation management, or self-promotion content.
- Acting autonomously on the official's behalf (filing, voting, sending, publishing).
- Definitive legal advice, verdicts, or jurisdiction-specific claims that are not sourced to primary
  law and expert-reviewed.

When a request falls in the out-of-scope/refused set, the tool refuses that part, explains why in
public-duty terms, and where possible offers a lawful, transparent alternative (e.g., "I can't help
minimize this records request, but here is how the public-records process works and who can advise
you").

The **lawful-alternative redirect is the project's ethical differentiator**, not a nicety, so it is
held to explicit acceptance criteria and a coverage metric (see *Success metrics*): for every
**evasion-category** refusal the red-team suite asserts the response contains a **correct, cited
lawful-process pointer** (the actual transparency/ethics process and the right office — e.g., the
public-records request procedure or the ethics board), not a bare refusal. A refusal that fails to
emit a correct cited redirect is a test failure, the same as a bypass.

---

## Solution approach & architecture

**Stack.** TypeScript, ESM. Next.js 15 (App Router) + React, deployable as a PWA for offline-
friendly use on a councilmember's phone. PostgreSQL + `pgvector` via Prisma. Anthropic Claude as the
reasoning layer (model selection and pricing per the Claude API skill; all calls behind a thin
provider-neutral LLM client so the core stays vendor-neutral). Clerk for authentication, multi-
tenant from the first commit. AES-256-GCM for sensitive content at rest. Code license **TBD (AGPL
vs MIT — open question)**; civic content **CC-BY-4.0**.

**Components**

1. **Guardrail / public-duty policy layer (`lib/guardrails`) — built first.** A safety-critical
   subsystem, not a prompt suffix. Three enforcement points:
   - *Intent classification*: an input classifier tags requests against a public-duty policy
     taxonomy (allowed service/duty/compliance vs. refused campaign/evasion/surveillance/optics).
     Refused categories never reach a faculty. The safety-relevant target is the **false-negative
     rate** (a refused-category request wrongly allowed): **< 1% on the red-team suite, with 0
     tolerated for the highest-severity categories** (evasion, surveillance/targeting). The
     classifier is **fail-closed**: when its confidence is below threshold or the intent is
     ambiguous, the default is **refuse-and-explain** (with a lawful-alternative pointer) rather than
     allow — under-blocking is treated as the dangerous error, over-blocking as a recoverable one.
   - *System policy*: a `PUBLIC_DUTY_SYSTEM` charter injected into every faculty prompt establishing
     fiduciary-duty framing, non-partisanship, transparency-positive defaults, and hard refusals.
   - *Output screening*: an **independent** post-generation screen (not sharing the input
     classifier's logic, so it catches what the classifier misses) for partisan/targeting/evasion
     leakage — **defense-in-depth**, on the assumption the input classifier will occasionally
     false-negative. Flags route to a review queue and block delivery. All refusals and flags are
     logged (without storing the sensitive content) for audit. This layer ships with its own
     adversarial red-team suite run in CI; a regression that bypasses a refusal **fails the build**.

2. **Imprint — office memory layer (`lib/imprint`).** The inverse of Ofelia's personal memory: it
   stores the *office's* working memory, not a person's leverage. Entities/records: Duties,
   Sources/Statutes (with citation + provenance), Decisions/Votes, Meetings/Events, Constituent
   Cases (PII-minimized, encrypted), and retrievable Notes with 1536-dim embeddings queried via
   pgvector cosine similarity (keyword fallback). Retrieval assembles a cited context block; every
   faculty answer must carry its sources.

3. **Faculties — public-service modules (`lib/faculties`)** behind a router/factory and the
   guardrail layer:
   - **Duties & Roles** — structured, source-cited representation of the office's statutory duties,
     oath, and powers for the pilot jurisdiction.
   - **Ethics & Compliance** — conflict-of-interest, open-meeting/sunshine, public-records, gift
     rules, campaign-vs-official-resource separation, and records retention; flags when a
     contemplated action may violate them. Informational; routes to the ethics board / counsel.
   - **Constituent Casework** — service-oriented case tracking with privacy-first fields only
     (issue, status, next step, resolution); **no political affiliation, no profiling, no
     targeting fields**; encrypted; retention + deletion enforced.
   - **Meeting/Vote Briefings** — balanced, cited briefings that lay out the question, the
     applicable rules, options, and tradeoffs to inform (not replace) the official's judgment;
     explicitly avoids recommendations framed as the "winning" political move.
   - **Daily briefing** — a short, duty-focused digest (upcoming meetings, notice/records
     deadlines, open cases, pending disclosures) — never campaign or optics items.

4. **Outcomes & calibration (`lib/outcomes`, `lib/calibration`).** Tracks constituent-impact
   outcomes and (optionally) forecast calibration for the official's own predictions about
   duty-relevant matters — reframed from personal edge to honest self-assessment and service
   follow-through.

5. **Eval harness (`scripts/eval-grounded.ts`).** Runs faculties memory-grounded vs. blank-slate on
   fixture scenarios; an LLM judge scores accuracy, groundedness/citation, and fit. The headline
   metric is the delta: if grounded + cited does not clearly beat blank-slate, the thesis fails.

**Key decisions**

- Guardrails are a first-class, tested subsystem and a release gate — not documentation.
- Agent-neutral core; any Anthropic/Claude specifics sit behind the LLM client (mirrors Hee-Lee Oss's
  core/adapter rule).
- Depth-first on one jurisdiction with expert sign-off before any breadth.
- Privacy by construction: constituent data model has no political fields to misuse in the first
  place; encryption + retention + deletion are built in, not bolted on.

---

## Data, licensing & compliance

**Source material.** Primary law and official guidance: state statutes and constitutions, municipal
charters and ordinances, state ethics-commission rules and advisory opinions, open-meeting/sunshine
and public-records statutes, records-retention schedules, and official clerk/secretary-of-state
guidance. These are generally government works; many U.S. state statutes/regulations are in the
public domain or are government edicts not subject to copyright (per the *Public.Resource.Org*
edict-of-government principle), but **this varies by state and source** (some states assert
copyright in annotations or compiled codes). **Every source's reuse terms must be verified and
recorded before its content ships**; we cite and link primary law and store provenance (source name,
jurisdiction, citation, retrieval date, URL, license/legal-status note).

**Provenance model.** Each duty/compliance claim is backed by a `Source` record (citation +
provenance + verified legal status). The Duties & Roles and Ethics & Compliance faculties may not
surface a claim without an attached source; a citation-coverage test enforces this.

**Staleness is fail-safe, not best-effort.** Every `Source` carries a **`lastVerified`** date and a
**`validUntil`** (derived from a per-source-type **review interval** — e.g., statutes re-verified
annually, ethics advisory opinions and retention schedules on a shorter cadence). At **runtime**, a
claim whose backing source is **past its `validUntil`** is **not served as current**: the faculty
either **auto-flags** it ("this citation is past its review window — verify before relying") or
**withholds** the claim for HIGH-severity surfaces, and routes the source into the re-verification
queue. A stale claim cannot return to normal service until a reviewer re-verifies it and an expert
**re-signs-off**, which writes a fresh `lastVerified`/`validUntil`. This makes the common failure
mode (law changed; content silently went stale) a visible, gated event rather than a silent error,
and is checked by a staleness test (see *Success metrics*).

**Output licensing.** Code: **TBD — AGPL-3.0 vs MIT (open question;** AGPL better protects an open
civic commons from closed re-hosting, MIT maximizes adoption/reuse — needs a governance decision).
Civic content/datasets: **CC-BY-4.0** (attribution to primary sources preserved). Docs: CC-BY-4.0.

**Privacy / PII stance (conservative).** Constituent PII is **minimized by design** — only what is
needed to provide the service (name/contact, the issue, status, next step, outcome). **No political
affiliation, voting history, ideology, or profiling fields exist in the schema.** Sensitive content
is **encrypted at rest (AES-256-GCM)**; every row is tenant-scoped to an office/official. A
**data-retention policy** with automatic minimization and a **constituent/official deletion path**
is required before any real PII is stored. Constituent data is **never** used for political
targeting, surveillance, training, or any non-service purpose — enforced by the guardrail layer and
the schema. No secrets, tokens, or PII are written to logs, receipts, or committed files (Hee-Lee Oss
rule).

**Resolving the PII-minimization vs. records-law collision.** Privacy minimization and public
records-retention law pull in opposite directions, so the policy is explicit rather than
contradictory. Default rule: non-records constituent data (e.g., transient service notes,
auto-minimizable contact details) carries a **default retention window** (proposal: **24 months**
from case closure, expert-confirmable per jurisdiction) after which it is auto-minimized/purged, and
constituent/official deletion requests are honored within a **deletion SLA (proposal: 30 days)**.
**Exemption:** casework records that are themselves **subject to a public-records retention schedule**
(some constituent communications are public records by law) are **EXEMPT from deletion/auto-purge**
and are instead retained, classified, and dispositioned **per the applicable records schedule** —
never silently deleted to satisfy a privacy request, and never quietly kept past their schedule
either. Each record is tagged `recordsLawHold: true|false` at creation (expert-reviewed mapping), so
the deletion path and the retention job both know which regime applies. Concrete windows and the SLA
are confirmed with the credentialed expert for the pilot jurisdiction.

**Attribution.** Civic content cites primary sources; redistribution preserves attribution per
CC-BY. Expert reviewers are credited (with consent) in a reviewers ledger.

---

## Quality, review & risk gates

**Risk tier: HIGH** across the legal/ethics/governance surface (per
`docs/good-deed-definition.md`: legal/safety domains require credentialed expert sign-off before
merge). Pure platform/UI/infra tasks are low–medium; anything that states a duty, a legal/ethics
rule, or a jurisdiction-specific obligation is HIGH.

**Required reviews before a deed is "done":**

- **Maintainer** review on all PRs (engineering quality, agent-neutral core, no secrets/PII in
  logs, tests/CI green).
- **Credentialed expert sign-off** — a government-ethics professional and/or a licensed attorney for
  the jurisdiction — recorded before *any* duty/compliance/jurisdiction content ships. No expert,
  no ship.
- **Guardrail/red-team review** — the adversarial misuse suite passes in CI **and** an independent
  reviewer audits refusal behavior before the guardrail layer or any new faculty is released.
- **Privacy review** for anything touching constituent data (PII minimization, encryption,
  retention, deletion).

**Every duty/compliance surface is labeled "Informational, not legal advice"** and routes the user
to counsel / the ethics board / the clerk for binding determinations.

**Definition of Shipped (project):** adopted by a real official/office (pilot) and demonstrably used
to fulfill a duty more completely or improve a constituent outcome, with non-partisan/ethics
guardrails verified by an independent government-ethics reviewer, all shipped legal content
expert-signed-off and primary-source-cited, and the privacy controls in force.

---

## Roadmap & milestones

Phased: guardrails + skeleton first; faculties and content only behind the guardrails; pilot
adoption last and gated on a secured partner.

- **M0 — Guardrails & skeleton (cold-start).**
  *Goal:* the safety subsystem and an agent-neutral, multi-tenant skeleton exist before any feature.
  *Exit:* guardrail policy spec + policy layer merged with an adversarial red-team suite passing in
  CI (no known bypass); monorepo + CI green; tenant-scoped data model + at-rest encryption in place;
  "informational, not legal advice" framing wired in. **Pilot jurisdiction selected** (criteria in
  *Open questions*) so M1+ content is built against a real corpus and reviewer profile.

- **M1 — Imprint (office memory) + privacy foundation.**
  *Goal:* cited office-memory layer with privacy-first constituent model.
  *Exit:* duties/sources/decisions/cases/notes models + vector retrieval working on fixtures;
  PII-minimized constituent schema (no political fields); encryption, retention (with `recordsLawHold`
  exemption), and deletion paths implemented and tested; privacy review passed. **Kill-gate:** a
  **minimal grounded-beats-blank-slate eval** (a handful of fixture scenarios) runs here as an early
  **go/no-go** — if grounded+cited does not at least trend ahead of blank-slate on the small set, the
  thesis is in doubt and HIGH-tier content investment (M2) pauses pending review, rather than waiting
  for the full M4 eval to discover it.

- **M2 — Duties & Roles + Ethics & Compliance (expert-gated content).**
  *Goal:* the two HIGH-tier faculties, mounted behind guardrails, with the selected pilot
  jurisdiction's cited content.
  *Exit:* faculties return only source-cited claims (citation-coverage test passing); the pilot
  jurisdiction's Duties & Roles and core Ethics/Compliance content drafted, primary-source-cited,
  and **expert-signed-off**; guardrails verified on these surfaces. **Kill-gate confirmed:** the
  minimal grounded-vs-blank-slate eval, now run on real cited content, still shows grounded+cited
  ahead — otherwise stop and reassess before M3.

- **M3 — Casework, Briefings, briefing & outcomes.**
  *Goal:* service-oriented modules and the outcomes loop.
  *Exit:* privacy-first casework tracker; balanced/cited meeting-vote briefings (no political
  recommendations); duty-focused daily briefing; constituent-impact outcome tracking — all behind
  guardrails and privacy controls.

- **M4 — Eval, hardening & pilot readiness.**
  *Goal:* prove the thesis and harden for a real user.
  *Exit:* eval shows grounded+cited clearly beats blank-slate; expanded red-team suite green;
  accessibility (WCAG 2.2 AA) + PWA + deletion/retention verified; pilot onboarding runbook ready.

- **M5 — Pilot adoption & handoff (the deed).**
  *Goal:* a real office adopts and benefits.
  *Exit (Definition of Shipped):* a secured pilot official uses the tool to fulfill a duty more
  completely or improve a constituent outcome; guardrails independently verified; content
  expert-signed-off; outcomes recorded. *(Gated on a secured partner — TO BE SECURED.)*

- **M6 — Sustain & scale (post-delivery).**
  *Goal:* durable maintenance and (only then) careful expansion to a second jurisdiction.
  *Exit:* maintenance rotation + ops runbook + outcome dashboard; second-jurisdiction expansion
  process defined and expert-gated.

Dependencies flow M0 → M1 → M2 → M3 → M4 → M5; the **pilot-jurisdiction decision is made in M0 and
gates M2–M6** (it determines the content corpus, the source-reuse legality, and the reviewer
profile); M2 content tasks block on M0 guardrails, the chosen jurisdiction, and the secured expert
reviewer; M5 blocks on a secured pilot office.

---

## Work breakdown

The itemized, schema-mapped backlog lives in **`TASKS.md`**: ~21 tasks across milestones M0–M6 plus
a future backlog, each mapped to the Hee-Lee Oss Task JSON schema, with per-task acceptance criteria for
the most important items, milestone Definitions of Done, and a complete example Task JSON for the
first M0 task (the guardrail policy spec). The first build item in TASKS.md is the guardrail / public-
duty policy specification, reflecting its status as a hard product requirement; an early
**pilot-jurisdiction selection** and a **minimal grounded-vs-blank-slate kill-gate eval** at M1 are
sequenced so HIGH-tier content investment is gated on both a chosen corpus and an early thesis check.

---

## Governance, roles & stakeholders

- **Maintainer (Owner): TBD.** Owns architecture, the agent-neutral core, CI, and merge quality.
- **Reviewers / rotation:** at least one engineering reviewer plus a designated **guardrail/red-team
  reviewer** who audits refusal behavior independently of feature authors.
- **Credentialed expert reviewers (HIGH tier): TO BE SECURED** — a government-ethics professional
  and/or a licensed attorney for the pilot jurisdiction; signs off all duty/compliance/jurisdiction
  content before it ships. Tracked in a reviewers ledger with credentials and consent.
  **Independence / conflict-of-interest mechanism:** a reviewer **recuses** from any matter touching
  an office they currently hold, seek, or advise in the pilot jurisdiction (and discloses other
  material COIs). Sign-off is **version-scoped** — it attaches to a specific content version and
  citation set and does **not** carry forward to later edits, which require re-sign-off (this dovetails
  with the `lastVerified`/`validUntil` staleness model). **Name-use limits:** a reviewer's name and
  credentials may be published in the reviewers ledger only for the specific versions they approved,
  with consent, and may not be used to imply endorsement of the product as a whole or of content they
  did not review. **Disagreement fallback (sole expert vs. maintainer):** the expert holds a **veto
  on whether HIGH-tier content is legally/ethically safe to ship** — a maintainer cannot override a
  "do not ship" on substance. If the maintainer disagrees, the content **does not ship**; the
  disagreement is logged and escalated to **Hee-Lee Oss governance / a second credentialed reviewer** for a
  tie-break, and where a single reviewer is a single point of failure the project prefers securing a
  **second expert** before relying on contested content.
- **Steward (last-mile owner): TO BE SECURED** — owns the pilot relationship and the
  hand-off/adoption that constitutes shipping.
- **Partner / requestor: TO BE SECURED** — the pilot office/official or sponsoring civic
  organization (municipal league, clerks' association, good-government NGO, or public-administration
  program).
- **Community / board:** edge-cases and the AGPL-vs-MIT license decision go through Hee-Lee Oss governance.

---

## Dependencies & integrations

- **External services:** Anthropic Claude API (reasoning, behind the neutral LLM client); Clerk
  (auth/multi-tenant); managed PostgreSQL with `pgvector`; hosting/PWA delivery.
- **Datasets / sources:** the pilot jurisdiction's primary law and official guidance (statutes,
  charter/ordinances, ethics rules + advisory opinions, open-meeting/records statutes, retention
  schedules) — each with verified reuse terms and recorded provenance.
- **Upstream/reference:** the Ofelia app (`C:\code\Ofelia`) as the architectural basis to adapt and
  invert; public-domain legal corpora (e.g., Public.Resource.Org) for sourcing.
- **Hee-Lee Oss pieces:** `packages/schema` (Task JSON), `CLAUDE.md` work rules + refusal guardrails,
  `docs/good-deed-definition.md` (risk tiers), Hee-Lee Oss governance for license/edge-case decisions.
- **Human/decision dependencies (critical path):** the **pilot-jurisdiction decision (made in M0,
  gates M2–M6)** — it fixes the source corpus, source-reuse legality, and the reviewer profile; a
  secured credentialed expert reviewer (blocks M2 content); and a secured pilot office/steward
  (blocks M5).

---

## Risks & mitigations

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Tool is steered to partisan/campaign/electioneering use | High | Critical | Guardrail layer built first; intent classifier + system policy + output screening; adversarial red-team suite gates CI; independent reviewer audit; refused categories never reach a faculty | Guardrail reviewer |
| Used to evade transparency/open-records/ethics law | Medium | Critical | Transparency-positive defaults; hard refusal of evasion requests with a **correct, cited lawful-process redirect** (asserted by red-team coverage metric — a missing/incorrect redirect fails CI); expert review of compliance content | Guardrail reviewer / Expert |
| Constituent data used for surveillance/profiling/targeting | Medium | Critical | Schema has no political/profiling fields; PII minimized + encrypted; retention + deletion; guardrail prohibits non-service use; privacy review gate | Maintainer / Steward |
| Inaccurate or outdated jurisdiction-specific legal claim | High | High | Primary-source citation required (coverage test); credentialed expert sign-off before ship; "informational, not legal advice"; **runtime staleness fail-safe** (`lastVerified`/`validUntil` auto-flags or withholds claims past their review window until re-signed-off) | Expert reviewer |
| No pilot office secured → cannot reach Definition of Shipped | High | High | Honest `TO BE SECURED`/`verifiedNeed:false`; **dated partner-acquisition plan** (jurisdiction by 2026-08-31, expert by 2026-10-31, pilot by 2026-12-31) + an explicit **build-vs-mothball/pivot decision rule** at ~2027-03-31 (pivot last-mile beneficiary or mothball to maintenance-only rather than ship to no one); build platform + one illustrative jurisdiction meanwhile | Steward / Maintainer |
| No credentialed expert secured → M2 content blocked | Medium | High | Recruit via public-administration programs, bar associations, ethics commissions; do not ship HIGH content without sign-off (hard gate) | Maintainer |
| Source license/copyright on compiled codes/annotations | Medium | Medium | Verify + record reuse terms per source before shipping; prefer edict-of-government primary law; cite, don't copy proprietary annotations | Expert / Maintainer |
| Over-reliance: official treats output as legal advice | Medium | High | Persistent "informational, not legal advice" labeling; route to counsel/ethics board; briefings inform not decide | Maintainer / Expert |
| Multi-tenant data leakage across offices | Low | Critical | Tenant scoping on every row + query; tests for isolation; least-privilege auth | Maintainer |
| LLM hallucination of duties/citations | Medium | High | Retrieval-grounded answers only; no-source-no-claim rule; eval harness; output screening | Maintainer |

---

## Security & privacy

**Threat surface.** Misuse for partisan/political ends (primary threat); cross-tenant data leakage;
exposure of constituent PII; exfiltration of sensitive case content; prompt-injection attempting to
bypass the guardrail layer; secrets leakage.

**Insider-misuse threat model (the primary adversary is the authenticated official).** Unlike a
typical app where the attacker is an outsider, here the **legitimately authenticated user is the
most likely adversary** of the guardrail — they want a refused outcome (campaign help, an evasion
strategy, constituent targeting) and have unlimited authenticated attempts. The red-team suite and
guardrail design therefore explicitly model **insider attacks**, not just injection:
- **Multi-turn social engineering of the guardrail** — building rapport or context over several
  turns, then asking for the refused thing once "trust" is established; the policy layer must be
  **stateless w.r.t. trust** and re-evaluate each request on its own merits.
- **Benign-looking decomposition** — splitting a refused task into individually innocuous sub-steps
  (e.g., "list active voters by precinct" + "draft outreach copy" + "filter by issue stance") that
  only compose into surveillance/campaign work; screening must consider **cumulative intent**, not
  just the current message.
- **Reframing / euphemism attacks** — relabeling campaign work as "community outreach,"
  records-evasion as "managing the request queue," or opposition research as "stakeholder analysis"
  to dodge the classifier; the taxonomy and red-team cases cover these paraphrases, and the
  fail-closed default applies when a reframing is ambiguous.
These insider vectors are first-class red-team categories with their own cases and regression
coverage.

**Controls.** Guardrail layer as a safety-critical, adversarially tested subsystem (the top
control). Multi-tenant isolation — every row scoped by office/official, enforced in queries and
tested. AES-256-GCM encryption at rest for sensitive content; encryption key never committed.
Clerk-based auth with least privilege. **PII minimization by schema** (no political/profiling
fields) plus retention limits and a deletion path. Output screening blocks partisan/targeting/
evasion leakage. **No secrets, tokens, or PII in logs, receipts, or committed files** (Hee-Lee Oss rule);
guardrail logs record refusal reasons/flags, not the sensitive content. Prompt-injection resistance:
the policy layer is enforced server-side and cannot be overridden by user/document content; the
red-team suite includes injection attempts. Dependency and secret scanning in CI.

**Abuse/misuse prevention.** The refused-use set (campaign, electioneering, fundraising, opposition
research, re-election optimization, transparency/records/ethics evasion, constituent surveillance/
profiling/targeting/manipulation, optics/spin) is enforced, tested, and logged — not merely
documented — and the tool never acts autonomously on the official's behalf.

---

## Sustainability & maintenance

After delivery, a named **maintenance rotation** owns the platform; the **steward** owns the pilot
relationship and outcome tracking. Civic content carries a **review cadence** (law changes; sources
re-verified and re-dated) — expert sign-off is required again for material legal updates. The cadence
is **enforced at runtime, not just on a calendar**: each source's `lastVerified`/`validUntil` drives
the fail-safe staleness behavior (see *Provenance model*) so that a source past its review interval
is **auto-flagged or withheld** until a reviewer re-verifies it and an expert re-signs-off — stale
content cannot silently keep serving as current. Outcomes
are tracked in-app (cases resolved, duty/compliance improvements, guardrail-audit status) and
surfaced on an outcomes dashboard — **not** engagement metrics. Expansion to a second jurisdiction
follows a documented, expert-gated process and only after the first is stable. The guardrail
red-team suite is maintained as living tests and expanded as new misuse vectors are found.

---

## Open questions

- **Code license: AGPL-3.0 vs MIT?** AGPL protects an open civic commons from closed re-hosting;
  MIT maximizes reuse/adoption. Needs a Hee-Lee Oss governance decision. (Content: CC-BY-4.0.)
- **Which pilot jurisdiction / office type first? — decided in M0, not deferred,** because it gates
  M2–M6 (content corpus, source-reuse legality, reviewer profile). Explicit **selection criteria**,
  scored before M1 content work: (1) the jurisdiction's statutes/regulations are reusable under the
  **edict-of-government** doctrine (primary law in the public domain; no copyrighted compiled-code /
  annotation lock-in); (2) **high density of small, under-resourced offices** (the target
  beneficiary); (3) an **available credentialed reviewer** (ethics professional / licensed attorney)
  for that jurisdiction; (4) **manageable ethics-code complexity** (a tractable, well-documented
  ethics/open-meeting/records regime rather than the most labyrinthine one). The specific
  jurisdiction is still TO BE SECURED, but the **decision rule and deadline (by 2026-08-31) are
  fixed**.
- **How is the credentialed expert reviewer compensated/credited?** Crediting, version-scoped
  sign-off, name-use limits, recusal/COI rules, and the disagreement fallback are now specified in
  *Governance*; open item is the **compensation model** (volunteer vs. a future funded lane for
  review hours with a hard budget cap — see below) without compromising independence.
- **State-by-state source reuse terms** — which jurisdictions' compiled codes/annotations carry
  copyright constraints that limit reuse?
- **Lane:** donated by default; is there a future funded lane for expert review hours (with a hard
  budget cap) without compromising independence?
- **Constituent consent & records-law interaction** — how does casework data interact with public-
  records obligations (some constituent communications may themselves be public records)?
- **Scope of calibration/predictions** — keep, or drop as not core to fiduciary duty?

---

## References

- Proposal: `governance/proposals/public-official-guide.md`
- Hee-Lee Oss work rules & refusal guardrails: `CLAUDE.md`
- Good-deed definition & risk tiers: `docs/good-deed-definition.md`
- Task JSON schema: `packages/schema/src/schemas.ts`
- Architectural basis (to adapt + invert): Ofelia app at `C:\code\Ofelia`
  (`src/lib/faculties/*`, `src/lib/imprint/*`, `src/lib/guardrails`, `prisma/schema.prisma`,
  `scripts/eval-leverage.ts`)
- Sibling Hee-Lee Oss plan for house style: `planning/projects/beacon-game/{PLAN,TASKS}.md`
- Edict-of-government doctrine (source reuse): *Georgia v. Public.Resource.Org* (U.S. 2020)
