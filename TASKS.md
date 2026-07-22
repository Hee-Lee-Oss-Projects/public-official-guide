# Public-Official-Guide — TASKS.md

> Status: Draft · Version: 0.2.0 · Last updated: 2026-06-28 · Owner: TBD (maintainer) · Lane: donated

Backlog for **Public-Official-Guide** (slug: `public-official-guide`), a non-partisan, open-source
AI guide that helps public/elected officials fulfill their statutory duties, serve constituents, and
govern ethically and transparently — adapting Ofelia's architecture but **inverting it from personal
advantage to fiduciary public duty**. See `PLAN.md` for full context.

The **guardrail / public-duty policy layer is the first build item** and a hard product requirement.
This is a **HIGH risk-tier** project on its legal/ethics/governance surface: those tasks require
credentialed expert sign-off (government-ethics professional / licensed attorney for the
jurisdiction) before content ships. No pilot office/expert is yet secured, so delivery-dependent
tasks carry `requestor: TO BE SECURED` and `verifiedNeed: false`.

## How these tasks map to Hee-Lee Oss

Each task below becomes a Hee-Lee Oss **Task JSON** validated against
`packages/schema/src/schemas.ts`. Field mapping:

- **id** — stable slug `public-official-guide-<area>-NNN` (e.g. `public-official-guide-guardrails-001`).
- **title** — the task title in the milestone table.
- **project** — `public-official-guide`.
- **type** — one of `code | research | writing | data | design-spec | maintenance`.
- **lane** — `donated` (default; no funded tasks planned. Any `funded` task must add
  `fundedBudgetUsd` with a hard cap).
- **priority** — `high | medium | low`.
- **domain** — array, e.g. `["civic","governance","public-service","software"]`.
- **riskTier** — `low | medium | high`. Anything stating a duty/legal/ethics rule or
  jurisdiction-specific obligation is `high`; constituent-data tasks are `medium`+; pure
  platform/UI/infra is `low`.
- **urgent** — boolean (no urgent tasks at cold-start; reserved for live legal-deadline support).
- **deliverable** — `pr | dataset | document | translation`.
- **tokenEstimate** — `small | medium | large` (maps to the Size column).
- **status** — `open | in-progress | review | delivered | done` (all start `open`).
- **context / objective / acceptanceCriteria[] / resources[] / output** — per task.
- **requestor** — partner/steward/expert; `TO BE SECURED` where unknown.
- **verifiedNeed** — `true` only once a specific partner/need is confirmed; otherwise `false`
  (currently `false` everywhere — no pilot secured).
- **outputLicense** — code: **AGPL-3.0 or MIT (TBD — governance decision)**, written `MIT-or-AGPL-3.0-TBD`
  below; content/data: `CC-BY-4.0`; docs: `CC-BY-4.0`.

Size legend: small ≈ tokenEstimate `small`, med ≈ `medium`, large ≈ `large`.
Reviewer "Expert (ethics/legal)" = credentialed government-ethics professional and/or licensed
attorney for the jurisdiction (HIGH-tier sign-off, **TO BE SECURED**).

---

## Milestone M0 — Guardrails & skeleton (cold-start)

| ID | Title | Type | Size | Risk | Deliverable | Depends on | Reviewer |
|---|---|---|---|---|---|---|---|
| public-official-guide-jurisdiction-000 | Pilot jurisdiction selection (scored against explicit criteria) — gates M2–M6 | research | small | medium | document | — | Maintainer + Expert (ethics/legal) |
| public-official-guide-guardrails-001 | Guardrail / public-duty policy specification (non-partisan, anti-evasion, anti-surveillance) | design-spec | medium | high | document | — | Expert (ethics/legal) + Guardrail reviewer |
| public-official-guide-repo-002 | Monorepo + pnpm + Next.js/TS/ESM + CI (build/test/lint) skeleton | code | small | low | pr | — | Maintainer |
| public-official-guide-guardrails-003 | Guardrail policy layer: intent classifier + system policy + output screening | code | large | high | pr | 001, 002 | Guardrail reviewer + Expert (ethics/legal) |
| public-official-guide-redteam-004 | Adversarial misuse red-team suite wired into CI (build fails on bypass) | code | medium | high | pr | 003 | Guardrail reviewer |
| public-official-guide-data-005 | Multi-tenant data model + AES-256-GCM at-rest encryption (Prisma/Postgres/pgvector) | code | medium | medium | pr | 002 | Maintainer |

**Acceptance criteria — key tasks**

- **public-official-guide-jurisdiction-000** (pilot jurisdiction selection)
  - Scores candidate jurisdictions against explicit criteria: (1) statutes/regulations reusable under
    the edict-of-government doctrine (no copyrighted compiled-code/annotation lock-in); (2) high
    density of small, under-resourced offices; (3) an available credentialed reviewer for that
    jurisdiction; (4) manageable ethics-code complexity.
  - Records the decision (or a shortlist + the decision deadline of 2026-08-31) with rationale; the
    chosen jurisdiction becomes a dependency for the M2 source/content tasks.
  - Note: the *specific* jurisdiction remains `TO BE SECURED` until confirmed, but the **decision
    rule and deadline are fixed**; this task gates M2–M6 sequencing.

- **public-official-guide-guardrails-001** (policy spec)
  - Enumerates the refused-use set in concrete, testable terms: campaign/electioneering,
    fundraising, partisan messaging, opposition research, re-election optimization;
    transparency/open-records/ethics evasion; constituent surveillance/profiling/targeting/
    manipulation; PR/optics/spin; autonomous action on the official's behalf.
  - Defines allowed public-service/duty/compliance categories and the fiduciary-duty framing.
  - Specifies the three enforcement points (intent classification, system policy, output screening),
    a quantified intent-classifier **false-negative target (< 1%; 0 for evasion & surveillance/
    targeting)**, a **fail-closed "when uncertain, refuse-and-explain" default**, **independent
    output screening as defense-in-depth**, and the redirect-to-lawful-alternative behavior.
  - Defines the adversarial test taxonomy the red-team suite must cover, **including insider-misuse
    vectors** (multi-turn social engineering, benign-looking decomposition, reframing/euphemism
    attacks), with a minimum number of cases per refused category.
  - Mandates the "informational, not legal advice" labeling and the expert-review gate.
  - Reviewed by a credentialed ethics/legal expert (sign-off recorded).

- **public-official-guide-guardrails-003** (policy layer)
  - Refused intents are classified and blocked **before** reaching any faculty; the classifier is
    **fail-closed** (ambiguous/low-confidence intent defaults to refuse-and-explain).
  - `PUBLIC_DUTY_SYSTEM` charter injected into every faculty prompt; cannot be overridden by user or
    document content (server-side enforced; injection-resistant); policy re-evaluated **per request**
    (stateless w.r.t. accrued conversational "trust").
  - **Independent** output screening (distinct logic from the input classifier) flags/blocks
    partisan/targeting/evasion leakage as defense-in-depth; refusals + flags logged **without**
    storing sensitive content; no PII/secrets in logs.
  - Refusals return a public-duty explanation **and a correct, cited lawful-alternative pointer**
    where one exists.

- **public-official-guide-redteam-004** (red-team suite)
  - Covers every refused category from the policy spec with **≥ 8 cases each** (multiple phrasings +
    injection attempts) **plus insider-misuse categories** (multi-turn social engineering,
    benign-looking decomposition, reframing/euphemism).
  - Runs in CI; a regression that bypasses any refusal **fails the build**; suite size is
    **non-decreasing** across versions and any newly-found bypass vector is added as a regression
    case **within one release** of discovery.
  - Reports the metric as **refused/total at version N** with a per-version changelog; target 100%
    refused/redirected, 0 known bypass.
  - **Evasion-category coverage:** asserts each evasion-category refusal emits a **correct, cited
    lawful-process pointer**; a missing or wrong redirect is a test failure (not just a bypass is).

- **public-official-guide-data-005** (data model + encryption)
  - Every row scoped to an office/official tenant; cross-tenant isolation test passes.
  - Sensitive content encrypted at rest (AES-256-GCM); key never committed.
  - Constituent schema has **no** political/affiliation/profiling fields.

**M0 Definition of Done:** guardrail policy spec (expert-reviewed) + policy layer merged with the
adversarial red-team suite passing in CI (no known bypass, reported as refused/total at version N);
Next.js/TS/ESM skeleton + green CI; tenant-scoped, encrypted data model in place; "informational, not
legal advice" framing wired in; **pilot jurisdiction selected (or shortlisted with a fixed
decision)** so M1+ content builds against the right corpus and reviewer profile.

---

## Milestone M1 — Imprint (office memory) + privacy foundation

| ID | Title | Type | Size | Risk | Deliverable | Depends on | Reviewer |
|---|---|---|---|---|---|---|---|
| public-official-guide-imprint-006 | Imprint office-memory models (Duties/Sources/Decisions/Meetings/Notes) + cited vector retrieval | code | large | medium | pr | 005 | Maintainer |
| public-official-guide-privacy-007 | Privacy-first constituent case model + retention windows/deletion SLA + records-law-hold exemption | code | medium | high | pr | 005 | Maintainer + Expert (ethics/legal) |
| public-official-guide-provenance-008 | Source/provenance + citation-coverage enforcement ("no source, no claim") + staleness fail-safe | code | medium | medium | pr | 006 | Maintainer |
| public-official-guide-eval-029 | Minimal grounded-vs-blank-slate eval as an early go/no-go kill-gate (handful of fixtures) | code | small | medium | pr | 006 | Maintainer |

**Acceptance criteria — key tasks**

- **public-official-guide-imprint-006** (office memory + retrieval)
  - Models for Duty, Source (citation+provenance), Decision/Vote, Meeting/Event, and Note with
    1536-dim embeddings; cosine retrieval via pgvector with keyword fallback.
  - Retrieval assembles a **cited** context block; tested on fixtures.
  - All rows tenant-scoped; sensitive fields encrypted.

- **public-official-guide-privacy-007** (privacy-first casework model)
  - Fields limited to service needs (issue, status, next step, outcome, minimal contact); **no**
    political/profiling fields exist.
  - PII encrypted at rest; **default retention window** (e.g. 24 months from case closure,
    expert-confirmable) auto-minimizes/purges non-records data; constituent/official deletion path
    works within a **deletion SLA** (e.g. 30 days) and is tested.
  - **Records-law collision resolved:** records tagged `recordsLawHold: true` are **EXEMPT from
    deletion/auto-purge** and dispositioned per the applicable records schedule, never silently
    deleted (to satisfy a privacy request) nor kept past schedule; the deletion job and retention job
    both honor the flag. Tested for both regimes.
  - Privacy review + expert sign-off recorded.

- **public-official-guide-provenance-008** (provenance + citation coverage + staleness)
  - No claim surfaces without an attached `Source` (citation-coverage test).
  - Each `Source` carries `lastVerified` + `validUntil` (per-source-type review interval); at runtime
    a claim past `validUntil` is **auto-flagged or withheld** until re-verified and **re-signed-off**.
    A staleness test asserts no claim serves as current past its window.

- **public-official-guide-eval-029** (minimal grounded-vs-blank-slate kill-gate)
  - Runs the office-memory faculties grounded+cited vs. blank-slate on a small fixture set; reports
    the delta as an early **go/no-go**: if grounded+cited does not at least trend ahead, HIGH-tier
    content work (M2) **pauses** for review rather than waiting for the full M4 eval (eval-018).

**M1 Definition of Done:** office-memory layer with cited vector retrieval working on fixtures;
PII-minimized constituent model with encryption, retention windows/deletion SLA, and the
records-law-hold exemption implemented and tested; citation-coverage + staleness fail-safe in place;
the **minimal grounded-vs-blank-slate kill-gate** passes (grounded+cited trends ahead) before M2
content investment; privacy review passed.

---

## Milestone M2 — Duties & Roles + Ethics & Compliance (expert-gated)

| ID | Title | Type | Size | Risk | Deliverable | Depends on | Reviewer |
|---|---|---|---|---|---|---|---|
| public-official-guide-sources-009 | Pilot jurisdiction source vetting: verify reuse terms + record provenance | data | medium | high | dataset | 000, 008 | Expert (ethics/legal) + Maintainer |
| public-official-guide-duties-010 | Duties & Roles faculty (statutory duties/oath/powers, source-cited) | code | large | high | pr | 003, 006, 008 | Expert (ethics/legal) |
| public-official-guide-duties-011 | Pilot jurisdiction Duties & Roles content (cited, expert-reviewed) | writing | medium | high | document | 009, 010 | Expert (ethics/legal) |
| public-official-guide-ethics-012 | Ethics & Compliance faculty (COI/open-meeting/records/gift/resource-separation), informational | code | large | high | pr | 003, 006, 008 | Expert (ethics/legal) |
| public-official-guide-ethics-013 | Pilot jurisdiction ethics/compliance content + flag rules (cited, expert-reviewed) | writing | medium | high | document | 009, 012 | Expert (ethics/legal) |

**Acceptance criteria — key tasks**

- **public-official-guide-sources-009** (source vetting)
  - Reuse terms verified and recorded per source (public-domain edict vs. copyrighted
    annotation/compiled code); only reusable primary law enabled.
  - Provenance recorded (source, jurisdiction, citation, retrieval date, URL, legal-status note).
  - Expert sign-off recorded before sources are enabled.

- **public-official-guide-duties-010** (Duties & Roles faculty)
  - Mounted behind the guardrail layer; returns only **source-cited** claims (citation-coverage test
    passes — no claim without a `Source`).
  - Structured output of duties, oath, and powers; "informational, not legal advice" surfaced.
  - Refuses out-of-scope (campaign/optics) framings.

- **public-official-guide-ethics-012** (Ethics & Compliance faculty)
  - Surfaces COI, open-meeting/sunshine, public-records, gift, campaign-vs-official-resource, and
    records-retention rules; flags when a contemplated action may violate them.
  - **Refuses** to help evade/minimize any transparency or ethics obligation; redirects to the
    lawful process and the ethics board/counsel.
  - Every rule cited to primary law; expert sign-off recorded before content ships.

**M2 Definition of Done:** Duties & Roles and Ethics & Compliance faculties live behind guardrails,
returning only primary-source-cited claims; the selected pilot jurisdiction's duty + ethics/compliance
content drafted, cited, and **expert-signed-off**; guardrails verified on these surfaces; all
surfaces labeled informational-not-legal-advice; the **minimal grounded-vs-blank-slate kill-gate
(eval-029), now run on real cited content, still shows grounded+cited ahead** — otherwise stop and
reassess before M3.

---

## Milestone M3 — Casework, briefings & outcomes

| ID | Title | Type | Size | Risk | Deliverable | Depends on | Reviewer |
|---|---|---|---|---|---|---|---|
| public-official-guide-casework-014 | Constituent Casework faculty (service-oriented, privacy-first) | code | medium | high | pr | 003, 007 | Maintainer + Expert (ethics/legal) |
| public-official-guide-briefings-015 | Meeting/Vote Briefing generator (cited, balanced, options+tradeoffs, no political recs) | code | medium | high | pr | 003, 010, 012 | Expert (ethics/legal) |
| public-official-guide-briefing-016 | Daily duty-focused briefing (deadlines, meetings, open cases, disclosures) | code | small | medium | pr | 014, 015 | Maintainer |
| public-official-guide-outcomes-017 | Constituent-impact outcome tracking (cases→outcomes; duty/compliance improvements) | code | medium | medium | pr | 014 | Maintainer |

**Acceptance criteria — key tasks**

- **public-official-guide-casework-014** (casework faculty)
  - Tracks cases with service fields only (issue/status/next step/outcome); **no** political/
    profiling/targeting fields or features.
  - Constituent data encrypted; retention + deletion enforced; never usable for political purposes
    (guardrail-enforced).

- **public-official-guide-briefings-015** (meeting/vote briefings)
  - Output is balanced and **cited**: question, applicable rules, options, tradeoffs — to inform,
    not replace, the official's judgment.
  - Does **not** produce a "winning political move" or partisan recommendation; refuses such framing.
  - Surfaces relevant ethics/COI flags for the matter.

**M3 Definition of Done:** privacy-first casework, balanced/cited briefings (no political
recommendations), duty-focused daily briefing, and constituent-impact outcome tracking all live
behind the guardrail and privacy controls.

---

## Milestone M4 — Eval, hardening & pilot readiness

| ID | Title | Type | Size | Risk | Deliverable | Depends on | Reviewer |
|---|---|---|---|---|---|---|---|
| public-official-guide-eval-018 | Eval harness: memory-grounded+cited vs. blank-slate (accuracy/groundedness/fit) — full version of eval-029 | code | medium | medium | pr | 010, 012, 015, 029 | Maintainer + Expert (ethics/legal) |
| public-official-guide-hardening-019 | Hardening: expanded red-team, WCAG 2.2 AA, PWA, deletion/retention verification + pilot runbook | code | medium | high | pr | 004, 014, 016 | Guardrail reviewer + Maintainer |

**Acceptance criteria — key tasks**

- **public-official-guide-eval-018** (eval harness)
  - Runs faculties memory-grounded+cited vs. blank-slate on fixture scenarios; LLM judge scores
    accuracy, groundedness/citation, and fit.
  - Reports the delta; grounded+cited must clearly beat blank-slate or the thesis is flagged failing.

- **public-official-guide-hardening-019** (hardening + pilot readiness)
  - Expanded misuse red-team still 100% refused; injection attempts covered.
  - Core flows meet WCAG 2.2 AA; PWA works offline-friendly on mobile; deletion/retention verified
    end-to-end; pilot onboarding runbook written.

**M4 Definition of Done:** eval proves grounded+cited beats blank-slate; expanded red-team green;
accessibility + PWA + privacy controls verified; the tool is pilot-ready with an onboarding runbook.

---

## Milestone M5 — Pilot adoption & handoff (the deed)

| ID | Title | Type | Size | Risk | Deliverable | Depends on | Reviewer |
|---|---|---|---|---|---|---|---|
| public-official-guide-pilot-020 | Secure pilot office/steward + independent guardrail audit + expert sign-off of shipped content | research | medium | high | document | 011, 013, 018, 019 | Steward + Expert (ethics/legal) + Guardrail reviewer |
| public-official-guide-handoff-021 | Pilot adoption: official uses the tool to fulfill a duty / improve a constituent outcome (recorded) | maintenance | medium | high | document | 020 | Steward + Expert (ethics/legal) |

**Acceptance criteria — key tasks**

- **public-official-guide-pilot-020** (secure pilot + audits)
  - A real official/office (or sponsoring civic org) is secured as pilot; steward assigned;
    `verifiedNeed` flips to `true`.
  - Independent government-ethics reviewer audits guardrail refusal behavior; all shipped duty/
    compliance content has recorded expert sign-off; privacy controls confirmed in force.
  - Driven by the **dated partner-acquisition plan** (jurisdiction by 2026-08-31, expert by
    2026-10-31, pilot by 2026-12-31). If no pilot is secured by **~2027-03-31**, apply the
    **build-vs-mothball/pivot decision rule** (PLAN exec summary): pivot the last-mile beneficiary
    (e.g., hand the guardrailed platform + illustrative jurisdiction to a public-administration
    program as a reference deed) or mothball to maintenance-only — recorded in governance — rather
    than ship to no real beneficiary.

- **public-official-guide-handoff-021** (closed loop — the deed)
  - The pilot official demonstrably uses the tool to fulfill a duty more completely or improve a
    constituent outcome; the outcome is recorded (with the official's confirmation).
  - Guardrails independently verified; "informational, not legal advice" upheld throughout.

**M5 Definition of Done:** project-level **Definition of Shipped** met — a real office adopts the
tool and uses it to fulfill a duty/improve a constituent outcome, guardrails independently verified,
shipped content expert-signed-off, privacy controls in force, outcome recorded. *(Gated on a secured
partner — TO BE SECURED.)*

---

## Milestone M6 — Sustain & scale (post-delivery)

| ID | Title | Type | Size | Risk | Deliverable | Depends on | Reviewer |
|---|---|---|---|---|---|---|---|
| public-official-guide-ops-022 | Ops runbook + outcome dashboard + maintenance rotation + content review cadence | maintenance | medium | medium | document | 021 | Maintainer + Steward |

**Acceptance criteria — public-official-guide-ops-022**
- Runbook covers deploy, incident response, source re-verification, and pilot support.
- Dashboard tracks cases resolved, duty/compliance improvements, and guardrail-audit status (not DAU).
- Named maintenance rotation; content review cadence (law-change re-verification + re-sign-off)
  defined; documented, expert-gated process for adding a second jurisdiction.

**M6 Definition of Done:** project sustainably maintained with outcomes tracked, a rotation owning
it, a review cadence for legal content, and a gated expansion process.

---

## Backlog / future

| ID | Title | Type | Size | Risk | Deliverable | Notes |
|---|---|---|---|---|---|---|
| public-official-guide-jurisdiction-023 | Second jurisdiction content pack | data | large | high | dataset | Only after M6; full source-vetting + expert sign-off |
| public-official-guide-i18n-024 | Internationalization + community translations | writing | medium | medium | translation | Constituent-facing materials; review per language |
| public-official-guide-calibration-025 | Optional calibration/predictions for duty-relevant forecasts | code | medium | low | pr | Open question whether core to fiduciary duty |
| public-official-guide-records-026 | Public-records request workflow helper (compliance-positive only) | code | medium | high | pr | Helps fulfill requests; never evade; expert-gated |
| public-official-guide-accessibility-027 | Plain-language mode for constituents + officials | code | small | low | pr | Readability + literacy benefit |
| public-official-guide-export-028 | Export an office "duty + compliance" handbook (CC-BY) | writing | medium | high | document | Derived from cited content; expert sign-off |

---

## Generated task index

> Auto-generated by Hee-Lee Oss task-decomposition agent on 2026-06-29. All 30 files in `tasks/` are schema-valid.

| File | Milestone | Type | Risk | Deliverable | Status |
|---|---|---|---|---|---|
| tasks/public-official-guide-jurisdiction-000.json | M0 | research | medium | document | open |
| tasks/public-official-guide-guardrails-001.json | M0 | design-spec | high | document | open |
| tasks/public-official-guide-repo-002.json | M0 | code | low | pr | open |
| tasks/public-official-guide-guardrails-003.json | M0 | code | high | pr | open |
| tasks/public-official-guide-redteam-004.json | M0 | code | high | pr | open |
| tasks/public-official-guide-data-005.json | M0 | code | medium | pr | open |
| tasks/public-official-guide-imprint-006.json | M1 | code | medium | pr | open |
| tasks/public-official-guide-privacy-007.json | M1 | code | high | pr | open |
| tasks/public-official-guide-provenance-008.json | M1 | code | medium | pr | open |
| tasks/public-official-guide-eval-029.json | M1 | code | medium | pr | open |
| tasks/public-official-guide-sources-009.json | M2 | data | high | dataset | open |
| tasks/public-official-guide-duties-010.json | M2 | code | high | pr | open |
| tasks/public-official-guide-duties-011.json | M2 | writing | high | document | open |
| tasks/public-official-guide-ethics-012.json | M2 | code | high | pr | open |
| tasks/public-official-guide-ethics-013.json | M2 | writing | high | document | open |
| tasks/public-official-guide-casework-014.json | M3 | code | high | pr | open |
| tasks/public-official-guide-briefings-015.json | M3 | code | high | pr | open |
| tasks/public-official-guide-briefing-016.json | M3 | code | medium | pr | open |
| tasks/public-official-guide-outcomes-017.json | M3 | code | medium | pr | open |
| tasks/public-official-guide-eval-018.json | M4 | code | medium | pr | open |
| tasks/public-official-guide-hardening-019.json | M4 | code | high | pr | open |
| tasks/public-official-guide-pilot-020.json | M5 | research | high | document | open |
| tasks/public-official-guide-handoff-021.json | M5 | maintenance | high | document | open |
| tasks/public-official-guide-ops-022.json | M6 | maintenance | medium | document | open |
| tasks/public-official-guide-jurisdiction-023.json | Backlog | data | high | dataset | open |
| tasks/public-official-guide-i18n-024.json | Backlog | writing | medium | translation | open |
| tasks/public-official-guide-calibration-025.json | Backlog | code | low | pr | open |
| tasks/public-official-guide-records-026.json | Backlog | code | high | pr | open |
| tasks/public-official-guide-accessibility-027.json | Backlog | code | low | pr | open |
| tasks/public-official-guide-export-028.json | Backlog | writing | high | document | open |

---

## Example task JSON

Complete, schema-valid Task JSON for the first M0 task (`public-official-guide-guardrails-001`):

```json
{
  "id": "public-official-guide-guardrails-001",
  "title": "Guardrail / public-duty policy specification (non-partisan, anti-evasion, anti-surveillance)",
  "project": "public-official-guide",
  "type": "design-spec",
  "lane": "donated",
  "priority": "high",
  "domain": ["civic", "governance", "public-service", "ethics", "software"],
  "riskTier": "high",
  "urgent": false,
  "deliverable": "document",
  "tokenEstimate": "medium",
  "status": "open",
  "context": "Public-Official-Guide adapts the Ofelia app's architecture (private long-horizon memory + specialized AI faculties + outcome tracking + briefing) but deliberately INVERTS its purpose: from optimizing one person's advantage to serving an official's fiduciary duty to constituents and the public interest. A tool that optimized an elected official's advantage would harm democracy, so misuse is the project's top risk and the guardrail / public-duty policy layer is a hard product requirement built FIRST — adversarially tested, not a disclaimer. This is the cold-start task that specifies that layer before any feature is built. No pilot office or credentialed expert reviewer is yet secured.",
  "objective": "Write the authoritative guardrail / public-duty policy specification that all later code and content must implement and be tested against: the fiduciary-duty framing, the concrete refused-use set, the allowed public-service categories, the three enforcement points (intent classification, system policy, output screening), the refusal/redirect behavior, the adversarial test taxonomy, and the expert-review and 'informational, not legal advice' gates.",
  "acceptanceCriteria": [
    "Enumerates the refused-use set in concrete, testable terms: campaign/electioneering/partisan messaging, fundraising, opposition research, re-election optimization; evasion of open-meeting/public-records/ethics/disclosure law; constituent surveillance/profiling/targeting/manipulation; PR/optics/spin; and any autonomous action on the official's behalf",
    "Defines the allowed public-service/duty/compliance categories and the fiduciary-duty (duty-over-optics, transparency-positive) framing",
    "Specifies three enforcement points - input intent classification, injected PUBLIC_DUTY_SYSTEM policy, and output screening - and requires server-side, injection-resistant enforcement that user/document content cannot override",
    "Defines the refusal behavior: refuse the offending part, explain in public-duty terms, and offer a lawful/transparent alternative where one exists",
    "Defines the adversarial test taxonomy the red-team suite must cover (multiple phrasings + prompt-injection per refused category) and the 100%-refused / zero-bypass target",
    "Mandates the persistent 'informational, not legal advice' labeling and the credentialed-expert sign-off gate for any duty/compliance content",
    "Reviewed and signed off by a credentialed government-ethics professional and/or licensed attorney (recorded in the reviewers ledger)"
  ],
  "resources": [
    "planning/projects/public-official-guide/PLAN.md",
    "governance/proposals/public-official-guide.md",
    "CLAUDE.md",
    "docs/good-deed-definition.md",
    "packages/schema/src/schemas.ts",
    "C:\\code\\Ofelia/src/lib/faculties/guardrails.ts"
  ],
  "output": "A reviewed policy-specification document (the guardrail / public-duty charter) defining the refused-use set, allowed categories, three enforcement points, refusal/redirect behavior, adversarial test taxonomy, and review/labeling gates - the contract that public-official-guide-guardrails-003 (policy layer) and public-official-guide-redteam-004 (red-team suite) implement and verify.",
  "requestor": "TO BE SECURED",
  "verifiedNeed": false,
  "outputLicense": "CC-BY-4.0"
}
```
