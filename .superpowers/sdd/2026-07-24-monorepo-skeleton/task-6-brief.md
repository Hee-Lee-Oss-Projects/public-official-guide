# Task 6: Create README with local setup instructions

**Files:**
- Create: `README.md` (if not exists; update if exists)

**Interfaces:**
- Produces: Local setup guide, architecture overview, contributing notes

## Steps

### Step 1: Create/update README.md

Create or update `README.md` in repo root with the following content:

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

### Step 2: Commit

```bash
git add README.md
git commit -m "docs: add local setup and architecture overview"
```
