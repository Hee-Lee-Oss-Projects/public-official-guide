# Task 7: Verify acceptance criteria and final integration

**Files:**
- Modify: none (verification only)

**Interfaces:**
- Consumes: all prior tasks
- Produces: passing CI, ready-to-merge state

## Acceptance Criteria Checklist

Before marking complete, verify ALL of the following:

### Step 1: Install all dependencies

```bash
pnpm install
```

Expected: pnpm resolves all workspaces and installs deps without errors.

### Step 2: Run linter

```bash
pnpm lint
```

Expected: no lint errors (all workspaces pass ESLint).

### Step 3: Run build

```bash
pnpm build
```

Expected: no build errors (TS compiles, Next.js builds successfully).

### Step 4: Run tests

```bash
pnpm test
```

Expected: all tests pass (packages/llm test suite green).

### Step 5: Verify environment template

Check that `.env.example` files document all required variables:
- Root `.env.example` (if created): at least DATABASE-related docs
- `packages/schema/.env.example`: `DATABASE_URL`
- `apps/web/.env.example`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `ANTHROPIC_API_KEY`

Expected: no secrets in any file (all are placeholders).

### Step 6: Verify tenant scoping in schema

Open `packages/schema/prisma/schema.prisma` and verify:
- User model has `tenantId` field with FK to Tenant
- LLMCall model has `tenantId` field with FK to Tenant
- Unique constraints include tenantId (prevents cross-tenant collisions)

Expected: @@index on tenantId; @@unique([tenantId, ...]) where needed.

### Step 7: Verify agent-neutral LLM client

Open `packages/llm/src/index.ts` and confirm:
- Abstract `LLMClient` base class is provider-agnostic
- `createLLMClient()` factory supports swapping implementations
- `AnthropicLLMClient` is the current implementation (adapter pattern)

Expected: core types in `src/types.ts` and `src/client.ts` contain no Anthropic imports.

### Step 8: Verify CI configuration

Open `.github/workflows/ci.yml` and confirm:
- Jobs: lint, build, test
- Each job installs pnpm, Node 20, and runs the corresponding root script
- All three jobs run on PR

Expected: all jobs trigger on pull_request and push to main.

### Step 9: Verify README completeness

Check `README.md` contains:
- Prerequisites (Node, pnpm, PostgreSQL)
- Setup steps (clone, install, env vars, migrations, dev server)
- Architecture overview (workspace structure)
- Development commands (lint, build, test, db commands)
- License note

Expected: reader can follow steps 1-5 to have a working local dev environment.

### Step 10: Create PR

Once all verifications pass, create a PR:

```bash
git log --oneline -7
```

Expected: 6 commits (one per task 1-6, plus any setup commits).

Push to remote:

```bash
git push -u origin HEAD
```

Then create a PR via gh:

```bash
gh pr create \
  --title "feat: monorepo skeleton with Next.js, TypeScript, ESM, Clerk, and CI" \
  --body "Bootstraps M0 skeleton:
- pnpm workspaces with Next.js 15 App Router
- TypeScript strict mode, ESM throughout
- Tenant-scoped Prisma schema (PostgreSQL + pgvector ready)
- Clerk multi-tenant auth scaffolding
- Agent-neutral LLM client (Anthropic adapter)
- GitHub Actions CI (build/lint/test green)
- .env.example documents all required vars
- README with local setup guide

All acceptance criteria met. Ready to merge."
```

Expected: PR created with green CI checks.

---

## Summary

All acceptance criteria from the task spec must be met:
- [ ] pnpm monorepo with Next.js 15 App Router, TypeScript, ESM config committed and **building without errors** (run \`pnpm build\`)
- [ ] CI pipeline (build + test + lint) **green on the PR** (.github/workflows/ci.yml runs all three jobs successfully)
- [ ] Clerk multi-tenant auth scaffolding present; **every data row scoped to a tenant** (User and LLMCall models have tenantId FK)
- [ ] Agent-neutral LLM client stub in place (**no vendor-specific code in core packages**; Anthropic only in adapter)
- [ ] **No secrets, tokens, or API keys committed**; .env.example documents all required variables
- [ ] README documents how to run locally (prerequisites, env var setup, dev server start)
