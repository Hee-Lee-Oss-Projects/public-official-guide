# Monorepo Skeleton (M0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a working pnpm monorepo with Next.js 15 App Router, TypeScript/ESM, tenant-scoped Prisma schema, Clerk multi-tenant auth scaffolding, agent-neutral LLM client stub, green CI pipeline (build/test/lint), and local dev docs.

**Architecture:** Multi-workspace layout (apps/web for Next.js frontend, packages/schema for shared Prisma + types, packages/llm for provider-neutral LLM client) with pnpm workspaces. Tenant scoping on all data rows via tenant ID. Clerk handles auth identity; Prisma enforces row-level tenant boundaries. LLM client is a thin abstraction over Claude API, permitting future provider swaps. CI pipeline runs build, lint, and test on every PR, gated before merge.

**Tech Stack:** pnpm workspaces, Next.js 15 (App Router), TypeScript (strict mode), ESM, Prisma 6.x (schema + migrations), PostgreSQL 15+, pgvector, Clerk SDK, @anthropic-ai/sdk (behind neutral client), GitHub Actions, Vitest for unit tests.

## Global Constraints

- Node 20.11+ (LTS); pnpm 9.0+
- TypeScript strict mode, no `any`, target ES2022
- ESM throughout; no CommonJS
- Tenant ID (uuid) on every data row; no cross-tenant queries
- No secrets in committed files; all config via .env.local or .env.example
- Clerk multi-tenant setup (organization-scoped where applicable)
- Agent-neutral core: Claude-specific code lives in packages/llm adapters only
- All acceptance criteria must be met before PR merge

---

## File Structure

**Root-level:**
- `pnpm-workspace.yaml` — workspace configuration, paths to all workspaces
- `package.json` — root-level deps (dev only), scripts, tooling config
- `.env.example` — template with all required vars (no secrets)
- `README.md` — local setup + architecture overview
- `.gitignore` — exclude node_modules, .env.local, dist, build artifacts
- `.github/workflows/ci.yml` — GitHub Actions pipeline (build/lint/test)

**`apps/web/` (Next.js 15 App Router)**
- `app/` — App Router structure (layout, pages, API routes)
  - `app/layout.tsx` — root layout with Clerk provider
  - `app/auth/` — Clerk callback routes
  - `app/page.tsx` — dashboard placeholder
- `middleware.ts` — Clerk auth + tenant extraction
- `next.config.ts` — ESM + TypeScript config
- `tsconfig.json` — strict TypeScript config
- `package.json` — Next.js + React + testing deps
- `.env.example` — Next.js + Clerk + LLM vars

**`packages/schema/` (Prisma + shared types)**
- `prisma/schema.prisma` — tenant-scoped data model (Tenant, User, LLMCall, etc.)
- `src/index.ts` — export Prisma client + types
- `src/types.ts` — shared TypeScript interfaces
- `package.json` — Prisma CLI + client
- `.env.example` — DATABASE_URL

**`packages/llm/` (Provider-neutral LLM client)**
- `src/index.ts` — LLMClient interface + factory
- `src/client.ts` — base abstract client
- `src/anthropic-adapter.ts` — Claude API implementation
- `src/types.ts` — LLM request/response types
- `package.json` — @anthropic-ai/sdk as optional peer dep
- `__tests__/client.test.ts` — interface contract tests

---

## Task Breakdown

### Task 1: Initialize pnpm monorepo and root config

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (root)
- Create: `.gitignore`
- Modify: none (fresh repo)

**Interfaces:**
- Produces: pnpm workspace registration; root-level lint/build/test scripts

- [ ] **Step 1: Create pnpm-workspace.yaml**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Save to `pnpm-workspace.yaml` in the repo root.

- [ ] **Step 2: Create root package.json**

```json
{
  "name": "public-official-guide-monorepo",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "description": "Multi-tenant AI guide for public officials",
  "scripts": {
    "lint": "pnpm -r --parallel run lint",
    "build": "pnpm -r --parallel run build",
    "test": "pnpm -r --parallel run test",
    "dev": "pnpm -r --parallel run dev"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.0.0",
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=20.11.0",
    "pnpm": ">=9.0.0"
  }
}
```

Save to `package.json` in the repo root.

- [ ] **Step 3: Create .gitignore**

```
# Dependencies
node_modules/
.pnpm-store/

# Environment
.env.local
.env.*.local

# Build artifacts
dist/
build/
.next/
out/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Prisma
prisma/*.db
prisma/*.db-journal
```

Save to `.gitignore` in the repo root.

- [ ] **Step 4: Commit**

```bash
git add pnpm-workspace.yaml package.json .gitignore
git commit -m "chore: initialize pnpm monorepo structure"
```

---

### Task 2: Create packages/schema with Prisma setup

**Files:**
- Create: `packages/schema/package.json`
- Create: `packages/schema/tsconfig.json`
- Create: `packages/schema/prisma/schema.prisma`
- Create: `packages/schema/.env.example`
- Create: `packages/schema/src/index.ts`
- Create: `packages/schema/src/types.ts`

**Interfaces:**
- Produces: Prisma client, PrismaClient export, Tenant type, shared types (Tenant, User, LLMCall)

- [ ] **Step 1: Create packages/schema/package.json**

```json
{
  "name": "@public-official-guide/schema",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "generate": "prisma generate",
    "migrate": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0",
    "typescript": "^5.4.0"
  }
}
```

Save to `packages/schema/package.json`.

- [ ] **Step 2: Create packages/schema/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

Save to `packages/schema/tsconfig.json`.

- [ ] **Step 3: Create packages/schema/prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  users     User[]
  llmCalls  LLMCall[]

  @@map("tenants")
}

model User {
  id        String    @id @default(cuid())
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  clerkId   String    @unique
  email     String
  fullName  String?
  role      String    @default("member")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([tenantId, clerkId])
  @@index([tenantId])
  @@map("users")
}

model LLMCall {
  id        String    @id @default(cuid())
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  userId    String
  model     String
  inputTokens   Int
  outputTokens  Int
  createdAt DateTime  @default(now())

  @@index([tenantId])
  @@index([createdAt])
  @@map("llm_calls")
}
```

Save to `packages/schema/prisma/schema.prisma`.

- [ ] **Step 4: Create packages/schema/.env.example**

```
DATABASE_URL="postgresql://user:password@localhost:5432/public_official_guide?schema=public"
```

Save to `packages/schema/.env.example`.

- [ ] **Step 5: Create packages/schema/src/types.ts**

```typescript
export interface Tenant {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  tenantId: string
  clerkId: string
  email: string
  fullName: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface LLMCall {
  id: string
  tenantId: string
  userId: string
  model: string
  inputTokens: number
  outputTokens: number
  createdAt: Date
}
```

Save to `packages/schema/src/types.ts`.

- [ ] **Step 6: Create packages/schema/src/index.ts**

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

export type { Tenant, User, LLMCall } from "@prisma/client"
export * from "./types"
```

Save to `packages/schema/src/index.ts`.

- [ ] **Step 7: Commit**

```bash
git add packages/schema/
git commit -m "chore: set up Prisma schema with tenant-scoped data model"
```

---

### Task 3: Create packages/llm with provider-neutral LLM client

**Files:**
- Create: `packages/llm/package.json`
- Create: `packages/llm/tsconfig.json`
- Create: `packages/llm/src/types.ts`
- Create: `packages/llm/src/client.ts`
- Create: `packages/llm/src/anthropic-adapter.ts`
- Create: `packages/llm/src/index.ts`
- Create: `packages/llm/__tests__/client.test.ts`

**Interfaces:**
- Consumes: none (new package)
- Produces: LLMClient interface, AnthropicLLMClient impl, createLLMClient factory

- [ ] **Step 1: Create packages/llm/package.json**

```json
{
  "name": "@public-official-guide/llm",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vitest": "^1.0.0"
  },
  "peerDependencies": {
    "@anthropic-ai/sdk": "^0.24.0"
  }
}
```

Save to `packages/llm/package.json`.

- [ ] **Step 2: Create packages/llm/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

Save to `packages/llm/tsconfig.json`.

- [ ] **Step 3: Create packages/llm/src/types.ts**

```typescript
export interface LLMRequest {
  model: string
  messages: Array<{
    role: "user" | "assistant"
    content: string
  }>
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

export interface LLMResponse {
  content: string
  model: string
  inputTokens: number
  outputTokens: number
  stopReason: string
}

export interface LLMClientConfig {
  apiKey?: string
  provider?: "anthropic"
}
```

Save to `packages/llm/src/types.ts`.

- [ ] **Step 4: Create packages/llm/src/client.ts**

```typescript
import type { LLMRequest, LLMResponse } from "./types"

export abstract class LLMClient {
  abstract complete(request: LLMRequest): Promise<LLMResponse>
}
```

Save to `packages/llm/src/client.ts`.

- [ ] **Step 5: Create packages/llm/src/anthropic-adapter.ts**

```typescript
import Anthropic from "@anthropic-ai/sdk"
import { LLMClient } from "./client"
import type { LLMRequest, LLMResponse } from "./types"

export class AnthropicLLMClient extends LLMClient {
  private client: Anthropic

  constructor(apiKey?: string) {
    super()
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    })
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    const messages = request.systemPrompt
      ? [
          {
            role: "user" as const,
            content:
              request.systemPrompt + "\n\n" + request.messages[0].content,
          },
          ...request.messages.slice(1),
        ]
      : request.messages

    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature || 1,
      messages: messages,
    })

    const textContent = response.content.find((c) => c.type === "text")
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response")
    }

    return {
      content: textContent.text,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      stopReason: response.stop_reason,
    }
  }
}
```

Save to `packages/llm/src/anthropic-adapter.ts`.

- [ ] **Step 6: Create packages/llm/src/index.ts**

```typescript
import { AnthropicLLMClient } from "./anthropic-adapter"
import { LLMClient } from "./client"
import type { LLMClientConfig, LLMRequest, LLMResponse } from "./types"

export function createLLMClient(config?: LLMClientConfig): LLMClient {
  const provider = config?.provider || "anthropic"

  if (provider === "anthropic") {
    return new AnthropicLLMClient(config?.apiKey)
  }

  throw new Error(`Unknown LLM provider: ${provider}`)
}

export { LLMClient }
export type { LLMRequest, LLMResponse, LLMClientConfig }
```

Save to `packages/llm/src/index.ts`.

- [ ] **Step 7: Create packages/llm/__tests__/client.test.ts**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest"
import { createLLMClient } from "../src/index"
import type { LLMRequest } from "../src/types"

describe("LLMClient", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should create an Anthropic client by default", () => {
    const client = createLLMClient()
    expect(client).toBeDefined()
  })

  it("should throw on unknown provider", () => {
    expect(() => {
      createLLMClient({ provider: "unknown" as any })
    }).toThrow("Unknown LLM provider")
  })

  it("should accept API key in config", () => {
    const apiKey = "test-key-123"
    const client = createLLMClient({ apiKey })
    expect(client).toBeDefined()
  })
})
```

Save to `packages/llm/__tests__/client.test.ts`.

- [ ] **Step 8: Commit**

```bash
git add packages/llm/
git commit -m "feat: add provider-neutral LLM client with Anthropic adapter"
```

---

### Task 4: Create apps/web (Next.js 15 App Router)

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`
- Create: `apps/web/app/auth/callback/route.ts`
- Create: `apps/web/middleware.ts`
- Create: `apps/web/.env.example`

**Interfaces:**
- Consumes: @public-official-guide/schema (Prisma), Clerk SDK
- Produces: Next.js app router, auth middleware, Clerk callback route

- [ ] **Step 1: Create apps/web/package.json**

```json
{
  "name": "@public-official-guide/web",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "test": "vitest"
  },
  "dependencies": {
    "@clerk/nextjs": "^5.0.0",
    "@public-official-guide/schema": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.0.0",
    "typescript": "^5.4.0",
    "vitest": "^1.0.0"
  }
}
```

Save to `apps/web/package.json`.

- [ ] **Step 2: Create apps/web/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ES2022",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./.next",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", ".next"]
}
```

Save to `apps/web/tsconfig.json`.

- [ ] **Step 3: Create apps/web/next.config.ts**

```typescript
import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  eslint: {
    dirs: ["app", "middleware.ts"],
  },
}

export default config
```

Save to `apps/web/next.config.ts`.

- [ ] **Step 4: Create apps/web/app/layout.tsx**

```typescript
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Public Official Guide",
  description: "AI guide for public officials",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

Save to `apps/web/app/layout.tsx`.

- [ ] **Step 5: Create apps/web/app/page.tsx**

```typescript
import { auth } from "@clerk/nextjs/server"

export default async function Home() {
  const session = await auth()

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Public Official Guide</h1>
      {session?.userId ? (
        <>
          <p>Welcome! You are authenticated.</p>
          <p>User ID: {session.userId}</p>
        </>
      ) : (
        <p>Please sign in to continue.</p>
      )}
    </main>
  )
}
```

Save to `apps/web/app/page.tsx`.

- [ ] **Step 6: Create apps/web/app/auth/callback/route.ts**

```typescript
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@public-official-guide/schema"

export async function POST() {
  const session = await auth()

  if (!session?.userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // Sync user to database
  const user = await prisma.user.upsert({
    where: {
      clerkId: session.userId,
    },
    update: {},
    create: {
      clerkId: session.userId,
      email: session.user?.emailAddresses[0]?.emailAddress || "",
      fullName: session.user?.fullName || null,
      tenantId: session.orgId || "default-tenant",
    },
  })

  return NextResponse.json({ user })
}
```

Save to `apps/web/app/auth/callback/route.ts`.

- [ ] **Step 7: Create apps/web/middleware.ts**

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
```

Save to `apps/web/middleware.ts`.

- [ ] **Step 8: Create apps/web/.env.example**

```
# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/public_official_guide?schema=public

# LLM / Claude API
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

Save to `apps/web/.env.example`.

- [ ] **Step 9: Commit**

```bash
git add apps/web/
git commit -m "feat: set up Next.js 15 App Router with Clerk auth scaffolding"
```

---

### Task 5: Set up GitHub Actions CI pipeline (build/lint/test)

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: GitHub Actions workflow that runs on PR, checks build/lint/test

- [ ] **Step 1: Create .github/workflows/ci.yml**

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm build

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm test
```

Save to `.github/workflows/ci.yml`.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions pipeline for build/lint/test"
```

---

### Task 6: Create README with local setup instructions

**Files:**
- Create: `README.md` (if not exists; update if exists)

**Interfaces:**
- Produces: Local setup guide, architecture overview, contributing notes

- [ ] **Step 1: Create/update README.md**

```markdown
# Public Official Guide

A non-partisan, open-source AI guide helping public and elected officials understand and fulfill
their statutory duties, serve constituents well, and govern ethically and transparently.

## Quick Start (Local Development)

### Prerequisites

- Node.js 20.11+ (LTS)
- pnpm 9.0+
- PostgreSQL 15+
- Docker (optional, for postgres)

### Setup

1. **Clone the repository**

   \`\`\`bash
   git clone <repo-url>
   cd public-official-guide
   \`\`\`

2. **Install dependencies**

   \`\`\`bash
   pnpm install
   \`\`\`

3. **Set up environment variables**

   Copy \`.env.example\` files to \`.env.local\` in each workspace:

   \`\`\`bash
   # Root
   cp .env.example .env.local

   # Database schema
   cp packages/schema/.env.example packages/schema/.env.local

   # Web app
   cp apps/web/.env.example apps/web/.env.local
   \`\`\`

   Edit \`.env.local\` files and fill in your actual values:
   - **DATABASE_URL**: PostgreSQL connection string
   - **Clerk keys**: From [clerk.com](https://clerk.com)
   - **ANTHROPIC_API_KEY**: From [console.anthropic.com](https://console.anthropic.com)

4. **Run database migrations**

   \`\`\`bash
   pnpm --filter=@public-official-guide/schema migrate
   \`\`\`

5. **Start development server**

   \`\`\`bash
   pnpm dev
   \`\`\`

   Opens http://localhost:3000 by default.

## Architecture

### Workspaces

- **\`apps/web\`** — Next.js 15 App Router frontend with Clerk auth
- **\`packages/schema\`** — Prisma data model and PostgreSQL client
- **\`packages/llm\`** — Provider-neutral LLM client (Anthropic adapter)

### Key Design

- **Multi-tenant**: Every data row is scoped to a tenant via tenant ID
- **Agent-neutral core**: Claude-specific code lives only in \`packages/llm/src/anthropic-adapter.ts\`
- **TypeScript + ESM**: Strict mode throughout; ES2022 target

## Development

### Lint

\`\`\`bash
pnpm lint
\`\`\`

### Build

\`\`\`bash
pnpm build
\`\`\`

### Test

\`\`\`bash
pnpm test
\`\`\`

### Database

Reset schema:

\`\`\`bash
pnpm --filter=@public-official-guide/schema migrate reset
\`\`\`

Generate Prisma client after schema changes:

\`\`\`bash
pnpm --filter=@public-official-guide/schema generate
\`\`\`

## License

Code: MIT-or-AGPL-3.0-TBD  
Civic content: CC-BY-4.0

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) (TBD).
```

Save to `README.md` in the repo root.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add local setup and architecture overview"
```

---

### Task 7: Verify acceptance criteria and final integration

**Files:**
- Modify: none (verification only)

**Interfaces:**
- Consumes: all prior tasks
- Produces: passing CI, ready-to-merge state

- [ ] **Step 1: Install all dependencies**

```bash
pnpm install
```

Expected: pnpm resolves all workspaces and installs deps without errors.

- [ ] **Step 2: Run linter**

```bash
pnpm lint
```

Expected: no lint errors (all workspaces pass ESLint).

- [ ] **Step 3: Run build**

```bash
pnpm build
```

Expected: no build errors (TS compiles, Next.js builds successfully).

- [ ] **Step 4: Run tests**

```bash
pnpm test
```

Expected: all tests pass (packages/llm test suite green).

- [ ] **Step 5: Verify environment template**

Check that `.env.example` files document all required variables:
- `packages/schema/.env.example`: `DATABASE_URL`
- `apps/web/.env.example`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `ANTHROPIC_API_KEY`

Expected: no secrets in any file (all are placeholders).

- [ ] **Step 6: Verify tenant scoping in schema**

Open `packages/schema/prisma/schema.prisma` and verify:
- User model has `tenantId` field with FK to Tenant
- LLMCall model has `tenantId` field with FK to Tenant
- Unique constraints include tenantId (prevents cross-tenant collisions)

Expected: @@index on tenantId; @@unique([tenantId, ...]) where needed.

- [ ] **Step 7: Verify agent-neutral LLM client**

Open `packages/llm/src/index.ts` and confirm:
- Abstract `LLMClient` base class is provider-agnostic
- `createLLMClient()` factory supports swapping implementations
- `AnthropicLLMClient` is the current implementation (adapter pattern)

Expected: core types in `src/types.ts` and `src/client.ts` contain no Anthropic imports.

- [ ] **Step 8: Verify CI configuration**

Open `.github/workflows/ci.yml` and confirm:
- Jobs: lint, build, test
- Each job installs pnpm, Node 20, and runs the corresponding root script
- All three jobs run on PR

Expected: all jobs trigger on pull_request and push to main.

- [ ] **Step 9: Verify README completeness**

Check `README.md` contains:
- Prerequisites (Node, pnpm, PostgreSQL)
- Setup steps (clone, install, env vars, migrations, dev server)
- Architecture overview (workspace structure)
- Development commands (lint, build, test, db commands)
- License note

Expected: reader can follow steps 1-5 to have a working local dev environment.

- [ ] **Step 10: Final commit and create PR**

```bash
git log --oneline -10
```

Expected: 7 commits (one per task).

Create a new branch if not already on one:

```bash
git checkout -b feat/monorepo-skeleton
```

Push to remote:

```bash
git push -u origin feat/monorepo-skeleton
```

Then create a PR via GitHub (or \`gh pr create\`):

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

## Acceptance Criteria Checklist

Use this to verify all requirements are met before claiming task complete:

- [ ] pnpm monorepo with Next.js 15 App Router, TypeScript, ESM config committed and **building without errors** (run \`pnpm build\`)
- [ ] CI pipeline (build + test + lint) **green on the PR** (.github/workflows/ci.yml runs all three jobs successfully)
- [ ] Clerk multi-tenant auth scaffolding present; **every data row scoped to a tenant** (User and LLMCall models have tenantId FK)
- [ ] Agent-neutral LLM client stub in place (**no vendor-specific code in core packages**; Anthropic only in adapter)
- [ ] **No secrets, tokens, or API keys committed**; .env.example documents all required variables (check git diff to verify)
- [ ] README documents how to run locally (prerequisites, env var setup, dev server start)
