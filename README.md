# public-official-guide

> Non-partisan AI guide helping public officials fulfill duties, serve constituents, and govern ethically.  ·  **Risk tier:** high  ·  **Status:** proposed (planning)

An open, **non-partisan** AI guide that helps public and elected officials do their job
optimally — understand and fulfill their statutory duties, serve constituents well, and govern
ethically and transparently. It reuses the architecture of the Ofelia app (a private long-horizon
memory layer + specialized AI "faculties" + calibrated predictions + outcome tracking + briefings)
but **deliberately inverts its purpose**: from *personal advantage* to *public duty*.

**Definition of shipped:** Adopted by a pilot office and used to improve a constituent outcome / fulfill a duty, with guardrails verified by an independent ethics reviewer.

This is an **Hee-Lee Oss** good-deed project. Contributors pull a task, do it with their own coding agent, and open a PR. Platform: https://github.com/jdev1977/hee-lee-oss

## Planning
- [PROPOSAL.md](./PROPOSAL.md) — why this qualifies as a good deed (Good Deed Definition)
- [PLAN.md](./PLAN.md) — architecture, roadmap & milestones, risks
- [TASKS.md](./TASKS.md) — the full task backlog
- [tasks/](./tasks/) — ready-to-pull task JSON(s)

## Contribute
```bash
hee-lee-oss browse
hee-lee-oss pull --task-file tasks/public-official-guide-guardrails-001.json --repo Hee-Lee-Oss-Projects/public-official-guide
# do the work with your own agent, then:
hee-lee-oss submit public-official-guide-guardrails-001 --repo Hee-Lee-Oss-Projects/public-official-guide
```

## Licensing & review
- **Licensing:** Code: AGPL-3.0. Civic content: CC-BY-4.0.
- **Review:** risk tier **high** — deeds are *delivered, not merged*; **credentialed expert (ethics/legal) sign-off is required before merge**.

> Status: this project is in **planning** and not yet ratified through Hee-Lee Oss governance; no adopting partner/requestor is secured yet (`verifiedNeed: false` on delivery-dependent tasks).
