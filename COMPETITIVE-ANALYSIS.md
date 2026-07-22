# Competitive + Improvement Analysis — `public-official-guide`

> Analyst review of `PLAN.md` v0.2.0 (2026-06-28) and `TASKS.md`. Web-grounded competitive
> research with cited sources. The project: a non-partisan, open-source AI guide that helps
> small/under-resourced public officials fulfill statutory duties, serve constituents, and govern
> ethically — Ofelia's architecture (memory + faculties + calibration) inverted from personal
> advantage to fiduciary public duty. HIGH risk-tier; guardrail layer is the first build item;
> informational, not legal advice; ethics/legal expert review required.

---

## 1. Correctness & completeness review of PLAN.md

The plan is unusually mature for a draft: the guardrail-first sequencing, fail-closed classifier,
insider-misuse threat model, runtime staleness fail-safe, `recordsLawHold` tag, dated
partner-acquisition plan, and build-vs-mothball/pivot rule are all genuinely strong and rare in
civic-tech proposals. The gaps below are about rigor, not direction.

**A. Guardrail layer — adversarial testing is under-specified where it matters most.**
- The plan asserts a classifier **false-negative rate "< 1%, with 0 for evasion & surveillance"**
  but never defines the *denominator's validity*. A red-team suite the team writes itself measures
  only *known* attack classes; "0% FN on our own suite" can coexist with real-world bypasses. There
  is no **held-out / third-party adversarial set**, no **bug-bounty or external red-team** channel,
  and no plan for **LLM-generated novel attacks** (using a separate model to auto-generate paraphrase
  and decomposition attacks against the classifier). "≥ 8 cases per category" is a floor, not
  evidence of coverage — recommend specifying a target *attack diversity* metric and an external
  audit cadence, not just an internal CI count.
- The classifier itself is presumably a Claude call. The plan does not address **prompt-injection of
  the classifier** (vs. of the faculties), **classifier non-determinism** (same input, different
  verdict across runs → flaky CI and unreproducible safety), or a **canary/regression baseline** for
  when a model version upgrade silently changes refusal behavior. Model-version pinning + a re-run
  gate on upgrade should be an explicit requirement.
- "Cumulative intent" / multi-turn screening is named as a goal but has **no mechanism**. Detecting
  benign-decomposition across turns requires conversation-level state, yet the policy is also
  "stateless w.r.t. trust." These two requirements are in tension and the plan does not reconcile
  *how* you remember enough to catch decomposition without accruing "trust." This is the single
  thorniest unsolved design problem and it is hand-waved.
- **No false-positive / over-blocking budget or test.** Fail-closed is correct, but a tool that
  refuses legitimate duty questions ("how do I properly notice a special meeting?") because they
  pattern-match "meeting + avoid quorum" will be abandoned by the very under-resourced officials it
  targets. There is a FN target but no **FP ceiling** and no usability metric for wrongful refusals.
  Adoption risk lives here.

**B. Jurisdiction accuracy & primary-law sourcing.**
- The edict-of-government reliance (*Georgia v. Public.Resource.Org*, 590 U.S. ___ (2020)) is correct
  in principle but the plan **overstates its breadth**. That ruling covers official annotations
  authored under government authority; **municipal ordinances, charters, and many compiled codes are
  published by private vendors (Municode/CivicPlus, American Legal Publishing, General Code) under
  asserted copyright and restrictive ToS**. Since the target beneficiary is *local* offices, the
  most-needed corpus (local ordinances) is exactly the part *least* protected by the edict doctrine.
  The plan's "verify per source" is right but the criteria-(1) jurisdiction-selection optimism about
  reusability should be tempered: at the *local* level the reusable-primary-law assumption frequently
  fails.
- **No versioning/diffing of law over time.** Statutes are amended mid-session; the plan tracks
  `validUntil` (a review timer) but not *which version/edition* a citation refers to, nor a
  pin-to-effective-date. "Cited" is necessary but not sufficient — a citation to a superseded
  subsection is a confident, sourced error the staleness timer won't catch (the source isn't past
  its window; it's just been amended).
- **Hallucinated-but-plausible citations** are the dominant failure mode of legal AI: the Stanford
  RegLab study found leading *grounded* legal tools (Lexis+ AI, Westlaw AI) still hallucinate
  **17–33%** of the time despite RAG over authoritative databases. The plan's "no-source-no-claim"
  rule reduces but does not eliminate this; it needs an explicit **citation-verification step**
  (does the cited text actually say what the answer claims? — a separate check, not just "a citation
  is attached").

**C. Ethics/legal expert review process.**
- The governance is thoughtful (version-scoped sign-off, recusal, veto, name-use limits) but the
  **single-expert single-point-of-failure** is acknowledged then not resolved — "prefers securing a
  second expert" is aspirational. For a HIGH-tier legal product, one volunteer reviewer for an entire
  jurisdiction's duties + ethics + open-meeting + records corpus is both a **bottleneck** (review
  throughput will gate M2–M6) and a **liability concentration**. No estimate of review *hours per
  content unit* or reviewer-capacity model exists; M2 could stall purely on review bandwidth.
- **Compensation is an open question**, but unpaid expert review of safety-critical legal content is
  historically unreliable and slow. The plan should treat reviewer capacity as a hard scheduling
  input, not a footnote.
- **No malpractice/UPL (unauthorized practice of law) liability analysis.** "Informational, not legal
  advice" is a mitigation, not a legal shield; some bar jurisdictions take an expansive UPL view.
  This deserves its own risk row and a counsel review of the *product's own* legal exposure
  (distinct from the content's accuracy).

**D. Constituent-PII × records-retention-law interaction.**
- The `recordsLawHold: true|false` design is genuinely good. But the plan makes the **classification
  itself a per-record manual/expert call** ("expert-reviewed mapping") — at constituent-casework
  volume this is unscalable and error-prone. Whether a given constituent email is a "public record"
  is often fact-specific and contested; a binary flag set at creation will be wrong sometimes, and a
  wrong `false` means **illegal premature destruction of a public record** (a far worse outcome than
  a privacy over-retention). The plan needs a *default-to-hold-when-uncertain* rule mirroring its
  fail-closed guardrail philosophy, plus a litigation/FOIA **legal-hold override** that freezes
  auto-purge entirely when a request or litigation is pending. Neither is specified.
- **The tool may itself become a records custodian.** If casework notes live in the app, the app's
  data may be subject to FOIA/records requests *against the office*. The plan treats records law as
  something the official complies with elsewhere; it does not address the tool's own discoverability,
  export-for-FOIA, or e-discovery posture.

**E. "Not legal advice" boundaries.**
- The boundary is asserted via labeling + routing, but there is **no operational definition of where
  "explaining the law" ends and "advising on this specific situation" begins.** "Does my situation
  create a conflict of interest?" is exactly the question officials will ask, and a substantive
  answer *is* advice. The Ethics & Compliance faculty's whole value proposition ("flags when a
  contemplated action may violate them") sits right on the UPL line. The plan needs concrete
  **response-shaping rules** (e.g., surface the rule + the test + "here is the body that makes the
  binding determination," never a yes/no verdict) baked into the system prompt and *tested* in the
  red-team suite as its own category — not just a footer label.

**F. Pilot-office dependency.**
- Honestly handled (best part of the plan), but two thin spots: (1) the **illustrative jurisdiction
  is built before any partner**, so the team may invest M0–M4 of HIGH-tier work against a corpus that
  the eventual real partner doesn't use — the pivot value ("reference artifact") is real but the
  *content* may be largely throwaway. (2) The decision rule pivots to "a public-administration program
  as a teaching deed," but that beneficiary's needs (teaching) differ from the design center
  (operational duty support); the pivot is a different product, not a graceful degrade.

**G. Metrics weaknesses.**
- "Grounded clearly beats blank-slate" is the thesis metric but **blank-slate is a weak baseline** —
  a modern frontier model with web/search is not blank-slate. Beating an intentionally hobbled
  baseline proves little. The eval should compare against (a) frontier-model-with-retrieval and
  (b) the *status quo* (official Googling / calling the clerk), or the headline "thesis proven" claim
  is hollow.
- Several targets are unfalsifiable as written ("clearly beats," "trend ahead"). No effect-size or
  inter-rater threshold for the LLM judge; **LLM-judge eval has no human-calibration / judge-bias
  check**, which for a safety product is a gap.
- "≥ 10 cases tracked," "≥ 3 documented improvements" — reasonable but **attribution is unverifiable
  by anyone but the single pilot official** (self-attested). Fine for a pilot, but should be labeled
  as low-confidence evidence, not outcome proof.

**H. Smaller gaps.** No accessibility/plain-language *reading-level* target beyond WCAG (officials
vary widely in literacy/first-language; a Flesch-Kincaid target matters for this audience).
No **incident-response/kill-switch** plan for a discovered live bypass in a deployed pilot (how do
you take a faculty offline fast?). No **cost-per-official / sustainability funding model** for the
donated lane post-pilot (who pays the Claude API + Postgres bill when it scales to office #2?).
Calibration/predictions module is flagged as possibly-cut in Open Questions but still carries build
weight in the architecture — decide before M0, not later.

---

## 2. Competitive landscape

No existing product occupies this exact niche (non-partisan, fiduciary-duty, open-source, AI duty/
ethics guide for *individual small-office officials*). The space is a patchwork of adjacent
categories, each of which solves a slice. Mapped below.

### Legislative / policy intelligence (for staffed orgs & lobbyists)
- **Quorum** — all-in-one public-affairs workspace: 50-state + federal + ~9,750 local governments and
  3,000+ school districts bill/regulation tracking, AI relevance-ranking, stakeholder/advocacy/PAC
  tools; 1,800+ teams incl. >50% of Fortune 100. Strengths: deep legislative data, AI triage,
  scale. Weaknesses for our beneficiary: **enterprise-priced, built for advocacy/lobbying/PAC
  ("winning") — the opposite framing of fiduciary duty**; nothing about a *single official's*
  statutory duties or ethics compliance. https://www.quorum.us/products/state/ ,
  https://www.quorum.us/products/federal/
- **FiscalNote / PolicyNote** — comparable policy-tracking + analysis incumbent. Same enterprise/
  GR audience and "advantage" framing. https://fiscalnote.com/products/policynote ,
  https://fiscalnote.com/blog/fiscalnote-vs-quorum

### Clerk / meetings / records compliance software (for the office, not the official)
- **Granicus** (incl. Legistar, OneMeeting, Peak agenda mgmt; Operations Cloud) — ~4,500 agencies,
  200M+ citizen subscribers; agenda/meeting automation, transparency portals, records-request
  automation; claims up to 87% agenda-prep reduction. Strengths: dominant incumbent, real
  compliance/transparency tooling, small-gov tier (Peak). Weaknesses: **process automation, not duty
  explanation**; assumes staff/clerk operating it; no "what does my office require of me" guidance;
  proprietary, expensive. https://granicus.com/solution/agenda-meeting-management/ ,
  https://granicus.com/operations-cloud/
- **CivicPlus** (Clerk suite + **NextRequest** public-records software, social-media archiving) —
  records-request workflow, FOIA management, compliance bundles. Strengths: clerk-focused, compliance-
  oriented. Weaknesses: **manages the workflow, doesn't teach the law**; org buyer, not the lone
  official. https://www.civicplus.com/clerk/ , https://www.civicplus.com/nextrequest-public-records-software/
- **GovPilot** — OPRA/FOIA + clerk modules, deadline automation. Same "workflow not guidance" gap.
  https://www.govpilot.com/public-records-management-software
- **CityGrows / ClearForms (now ClearGov)** — no-code workflow/permitting automation for local gov;
  any employee builds online processes. Strength: cheap, easy, transparency-friendly. Weakness: forms/
  workflow, zero legal-duty/ethics content. https://citygrows.com/

### Constituent engagement / community sentiment
- **Polco** — community-alignment, budget/housing simulations, resident-perception analytics.
  https://info.polco.us/consistuent-engagement
- **Zencity** — always-on sentiment analysis, benchmarking surveys, public-safety confidence index.
  Strengths: real constituent-voice data. **Weakness *and warning*: sentiment-mining of residents is
  precisely the "constituent surveillance/profiling/targeting" our guardrail must refuse** — Zencity
  is a useful contrast for what we are *not*. https://zencity.io/ ,
  https://help.zencity.io/hc/en-us/articles/34647681640849-Listen-Sentiment-Model

### AI assistants for government
- **Polimorphic** — AI "Answers Engine" for municipalities; ingests municipal code + GIS to answer
  address-specific regulatory questions; redaction/HIPAA-aware constituent-data handling; debuting
  with City of Denton. Strengths: **closest architectural cousin** — municipal-code RAG, citizen-
  facing, data-redaction. Weaknesses: aimed at **resident self-service and staff deflection**, not at
  *the official's own duties/ethics*; proprietary; partisan/fiduciary framing absent.
  https://www.polimorphic.com/platform
- Broad municipal genAI trend (drafting, meeting summaries, grants): EY survey cited that 67% of
  municipal leaders are integrating AI — mostly *ad hoc, ungoverned* use, which is the risk our
  guardrail/governance posture answers. https://smartdev.com/ai-use-cases-in-local-government/ ,
  ClerkBase municipal AI guidelines: https://clerkbase.com/municipal-ai-guidelines/

### Legal-research AI (the accuracy/UPL cautionary tier)
- **CoCounsel** (Thomson Reuters, ex-Casetext) & **Harvey AI** — GPT-class legal research/drafting;
  CoCounsel touts Westlaw-grounded citations to curb hallucination. Strengths: deep primary-law
  grounding, professional QA. Weaknesses for us: **lawyer audience, enterprise pricing, and even so
  the Stanford RegLab study found grounded legal AI hallucinates 17–33% of queries** — the headline
  reason our "not legal advice + expert sign-off + citation-verification" posture is mandatory, not
  optional. https://reglab.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools/ ,
  https://hai.stanford.edu/news/ai-trial-legal-models-hallucinate-1-out-6-or-more-benchmarking-queries

### Authoritative non-software resources (the real status-quo "competitor")
- **ICMA** — local-gov ethics training, Code of Ethics, *Leading Your Community: A Guide for Local
  Elected Leaders* (with NLC). https://icma.org/local-government-ethics-training ,
  https://icma.org/documents/leading-your-community-guide-local-elected-leaders
- **NLC**, **NCSL** (ethics resources, ethics-legislation database), state **municipal leagues**,
  **clerks' associations**. https://www.ncsl.org/ethics
- **State ethics commissions** — advisory opinions + online disclosure filing (MA, NY, SC, VA, MD…).
  Authoritative but fragmented, jargon-heavy, and reactive (you must already know to ask).
  https://www.mass.gov/orgs/state-ethics-commission , https://ethics.dls.virginia.gov/
- **PolicyEngine** — open-source, nonprofit, NSF-funded tax/benefit microsimulation; *the model for
  open civic infrastructure* (and a spin-off ally), not a competitor. https://www.policyengine.org/us/model

**Landscape summary:** incumbents automate the *office's workflows* (Granicus/CivicPlus/GovPilot),
sell *advantage* to staffed orgs (Quorum/FiscalNote), mine *constituents* (Zencity/Polco), or serve
*lawyers* (CoCounsel/Harvey). **None gives the individual under-resourced official a private, cited,
non-partisan "what does my duty require, and am I about to cross an ethics line?" assistant.** The
authoritative knowledge exists but is fragmented and passive. That seam is the opportunity.

---

## 3. Gaps we can fill

1. **The lone official with no staff/counsel.** Every incumbent assumes an organizational buyer
   (clerk, IT dept, GR team). The part-time school-board member or special-district trustee with a
   personal phone and no budget is unserved. Our PWA-on-a-phone, single-official tenancy targets
   exactly them.
2. **Duty/ethics *explanation*, not workflow automation.** Granicus posts the agenda; nobody explains
   *why* the notice timing matters or *that the official personally* may have a COI on item 4. We sit
   upstream of the workflow, at the moment of decision.
3. **Non-partisan, fiduciary framing as a hard product constraint.** Quorum/FiscalNote optimize
   "winning"; we provably refuse it. A tool whose business model *can't* be campaign/optics is a
   genuine market gap and a trust differentiator.
4. **Anti-evasion + lawful-process redirect.** No competitor turns "help me dodge this records
   request" into "here is the lawful records process and the right office." Transparency-positive by
   construction.
5. **Privacy-by-schema constituent casework.** A casework tool with *no* political/profiling fields
   is the structural opposite of Zencity/Polco sentiment-mining — fillable only with service data.
6. **Open-source + CC-BY civic content commons.** Incumbents are closed/SaaS-locked. An open,
   primary-source-cited corpus is reusable by leagues, clerks' associations, and other tools.
7. **Citation-grounded honesty in a domain where AI is known to hallucinate 17–33%** — our
   no-source-no-claim + staleness fail-safe + expert sign-off is a differentiated *trust* posture for
   a high-stakes audience burned by generic chatbots.
8. **Cold-start cheap.** Donated lane, no per-seat enterprise contract — accessible to the offices
   that can least afford Granicus/Quorum.

---

## 4. Differentiators to win

1. **Provable non-partisanship as architecture, not policy** — the guardrail subsystem (fail-closed
   classifier + independent output screen + CI-gating red-team incl. insider vectors) is the product's
   spine. No competitor can credibly claim "this tool *cannot* be used for campaigning."
2. **Fiduciary-duty inversion of a proven design** — reusing Ofelia's memory+faculties+calibration
   architecture but pointed at public duty is a defensible, hard-to-copy thesis.
3. **The lawful-alternative redirect** — refusals that *teach the lawful process* (cited) instead of
   bare "no." Ethically and practically superior; uniquely ours.
4. **Primary-law grounding + runtime staleness fail-safe + expert sign-off** — trustworthy where
   generic municipal genAI is reckless; honest about its limits ("informational, not legal advice"
   wired in, not bolted on).
5. **Privacy-by-construction casework** — the schema literally cannot hold a profiling field; the
   `recordsLawHold` design reconciles privacy with records law rather than ignoring one.
6. **Open civic commons** — AGPL/MIT code + CC-BY content; reusable by the very associations that are
   our acquisition channel, creating a flywheel incumbents can't match.
7. **Serves the under-resourced, not the well-staffed** — the deliberate anti-enterprise positioning
   is the moat: the audience nobody else finds worth selling to.

---

## 5. Claude API leverage

**Where Claude clearly improves the product (high-value, bounded uses):**
1. **Duty & ethics explainers** — Claude turns dense statute/charter text into plain-language,
   reading-level-controlled explanations of *what the office requires*, **strictly over a
   retrieved, cited context block** (RAG), with the citation surfaced. Claude's instruction-following
   and refusal behavior also make it a good fit for the *system-charter* enforcement.
2. **Meeting/vote prep briefings** — synthesize the question + applicable rules + balanced options +
   tradeoffs from sourced material into a short pre-meeting brief that *informs without recommending
   a political "winning" move*. High leverage for the no-staff official.
3. **Plain-language drafting** — draft proper public notices, agenda items, records-request
   acknowledgments, recusal statements, constituent replies — lawful, transparent, template-grounded
   (never spin/optics, never campaign).
4. **Constituent-casework triage** — extract issue/status/next-step from a messy constituent message
   into the privacy-minimized schema, suggest the responsible department/process, draft a service
   reply — over service data only.
5. **Guardrail components** — Claude as the intent classifier and the *independent* output screen
   (different prompt/logic), and as the **adversarial-case generator** that auto-expands the red-team
   suite (paraphrase/decomposition attacks) so coverage isn't limited to human imagination.
6. **Citation-verification check** — a separate Claude pass that asks "does the cited source text
   actually support this claim?" to attack the 17–33% hallucination problem head-on.

(Model selection/pricing/caching per the Claude API skill; all calls behind the provider-neutral LLM
client per Hee-Lee Oss core/adapter rules. Prompt-cache the `PUBLIC_DUTY_SYSTEM` charter + jurisdiction
corpus; pin model versions and re-run the red-team gate on any model upgrade.)

**Where Claude must NOT decide (hard boundaries — enforced + tested):**
- **No legal advice / no verdicts.** Claude never answers "you have a conflict / you may legally do X"
  as a determination. It surfaces the rule + the test + routes to counsel/ethics board/clerk. This is
  a *tested* red-team category, not a footer.
- **The non-partisan / anti-evasion / anti-surveillance guardrail is non-negotiable and adversarially
  tested** — Claude's *own* outputs are screened by an independent pass; the policy is server-side and
  injection-resistant; refusals are fail-closed. Claude is never trusted to "decide it's fine."
- **Jurisdiction facts must be sourced to primary law and expert-reviewed** — Claude may *explain*
  cited text but may not *assert* a duty/citation from parametric memory (no-source-no-claim). A
  staleness/`validUntil` gate withholds claims past review; an expert signs off before ship.
- **Never campaign/electioneering/fundraising/opposition research/optics, and never constituent
  surveillance/profiling/targeting.** These are refused intents, blocked before reaching a faculty
  and screened on output. Constituent data is never sent to Claude for any non-service purpose and
  never used for training.
- **Never autonomous** — Claude drafts; it never files, votes, sends, or publishes on the official's
  behalf.

---

## 6. Ten concrete optimizations

1. **Add a held-out + external adversarial layer.** Beyond the internal CI suite: an LLM-generated
   novel-attack generator, a small external red-team/bug-bounty channel, and an independent held-out
   set the authors never see. Report bypass rate on *unseen* attacks, not just the regression suite.
2. **Set a false-positive (over-block) ceiling + usability test.** Add a "legitimate duty questions
   wrongly refused" metric with a hard ceiling, using a curated benign-but-adjacent suite ("how do I
   lawfully notice a special meeting?"). Protects adoption from a too-trigger-happy classifier.
3. **Add a citation-verification pass.** A separate check that the cited source *text* supports the
   claim (not merely that a citation is attached). Directly targets the 17–33% legal-AI hallucination
   reality. Make it a coverage metric like the redirect assertion.
4. **Pin law versions / effective dates, not just review timers.** Store the edition/version and
   effective date of each cited provision; detect amendment (not just review-window expiry). Catches
   the "sourced but superseded" error the `validUntil` timer misses.
5. **Default-to-hold records classification + legal-hold override.** Make `recordsLawHold` *default
   true when uncertain*, and add a global legal-hold/FOIA freeze that suspends auto-purge during a
   pending request or litigation. Treat wrongful deletion of a public record as the catastrophic error
   (mirror the fail-closed guardrail philosophy).
6. **Operationalize the "not legal advice" line in the prompt + tests.** Concrete response-shaping
   rules (rule + test + binding-authority routing; never yes/no) plus a dedicated UPL red-team
   category. Commission a counsel review of the *product's own* UPL/liability exposure.
7. **Strengthen the eval baseline.** Compare grounded+cited against (a) frontier-model-with-retrieval
   and (b) the real status quo (official Googling / calling the clerk) — not a hobbled blank-slate.
   Add LLM-judge human-calibration and an effect-size threshold so "clearly beats" is falsifiable.
8. **Model expert-reviewer capacity as a scheduling input.** Estimate review-hours per content unit;
   plan for a second reviewer from the start (the single-expert SPOF is named but unresolved); decide
   the compensation model before M2 since throughput gates M2–M6.
9. **Harden the classifier as software.** Pin model versions; add a determinism/regression baseline so
   a model upgrade can't silently change refusal behavior; make the classifier itself injection-
   resistant; define multi-turn/cumulative-intent state explicitly (reconcile with "stateless trust").
10. **Add an incident-response kill-switch + plain-language reading-level target.** A fast per-faculty
    disable for a discovered live bypass in a deployed pilot, plus a Flesch-Kincaid/reading-level
    target appropriate to a varied-literacy, sometimes-ESL official audience.

---

## 7. Parallel & perpendicular spin-offs

**Parallel (same architecture, adjacent beneficiary):**
- **Know-Your-Rights guide for *constituents*** — invert again: same cited-RAG + guardrail engine
  pointed at residents ("how do I file a public-records request / speak at a meeting / report an
  ethics concern"). Natural complement to the official-facing tool; ties to the lawful-process
  redirects we already build.
- **Nonprofit-board / HOA / co-op fiduciary-duty guide** — same fiduciary-duty inversion for
  volunteer board members (open-meeting analogs, COI, recordkeeping) in a lower-stakes legal tier.
- **New-official onboarding companion** co-branded with a municipal league / clerks' association /
  ICMA-style program — packaged "first 90 days in office" duty walkthrough.

**Perpendicular (reusable infrastructure / multipliers):**
- **`@hee-lee-oss/guardrails` — a standalone public-duty / non-partisan guardrail library.** The most
  reusable artifact: a fail-closed intent-classifier + independent output-screen + red-team harness,
  publishable for *any* civic AI tool that must refuse partisan/evasion/surveillance misuse. This is
  potentially bigger than the app.
- **MCP server exposing the cited civic corpus** — a "public-duty / primary-law" MCP server so other
  agents (and Claude Desktop/Code users) can query jurisdiction duties/ethics rules *with citations
  and staleness flags*. Turns the CC-BY content into shared infrastructure.
- **Open civic-law provenance dataset** — the `Source` records (citation + provenance + verified
  legal status + `validUntil`) as a reusable open dataset of "which jurisdictions' primary law is
  edict-of-government-reusable," valuable to every downstream civic-tech project (a known pain point).
- **Open-spending / budget explainer** tie-in with **PolicyEngine** — pair duty/ethics guidance with
  open budget/fiscal-impact microsimulation so an official can see the *fiscal* as well as the
  *legal* dimension of a decision, all open-source. https://www.policyengine.org/us/model
- **Meeting/agenda + records-request *compliance-coach* layer** that sits *atop* existing Granicus/
  CivicPlus workflows (integration, not replacement) — coaches the lawful timing/notice/retention the
  incumbent tools assume you already know.

---

## 8. Open questions for the maintainer

1. **How do you measure guardrail coverage against *unknown* attacks?** Is there budget/appetite for
   an external red-team or bug-bounty, and an LLM-driven novel-attack generator — or is CI-on-our-own-
   suite the ceiling? (Today the plan can only prove "0% on attacks we thought of.")
2. **What is the multi-turn/cumulative-intent mechanism**, and how does it coexist with "stateless
   w.r.t. trust"? This is the hardest unsolved design point.
3. **What is the over-block (false-positive) budget?** A fail-closed classifier that refuses
   legitimate duty questions will lose the under-resourced audience. Where's the usability line?
4. **At the *local* level, how much primary law is actually edict-of-government-reusable** vs. locked
   in private vendor (Municode/American Legal/General Code) compiled codes? This may force the pilot
   toward *state-level* offices or a jurisdiction with truly open ordinances — does it reshape the
   beneficiary?
5. **Who is the second expert, and what's the compensation/throughput model?** Review bandwidth, not
   a missing partner, may be the real M2–M6 bottleneck. Volunteer-only is risky for safety-critical
   legal content.
6. **What is the product's own UPL / malpractice exposure**, independent of content accuracy? Has
   counsel reviewed the *tool* (not just the content)? Does "informational, not legal advice" hold in
   the strictest pilot-jurisdiction UPL regime?
7. **Is the tool itself a records custodian?** Does casework data stored in-app become subject to
   FOIA/records requests against the office, and is there an export/legal-hold/e-discovery posture?
8. **AGPL vs MIT** — given the spin-off ambition (guardrail library, MCP server, dataset), does AGPL
   on the app but a more permissive license on the *library* maximize both commons-protection and
   reuse? Decide before M0 ships code.
9. **Keep or cut the calibration/predictions module?** It carries architectural weight but its
   fiduciary-duty value is unclear — decide before M0, not "later."
10. **What's the post-pilot sustainability model?** Who pays the Claude API + Postgres + hosting bill
    when it scales to office #2 on a donated lane? Is there a funded lane (hard-capped) for expert
    review hours?
