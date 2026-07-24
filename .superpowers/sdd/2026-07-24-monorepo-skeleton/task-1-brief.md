# Task 1: Initialize pnpm monorepo and root config

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (root)
- Create: `.gitignore`
- Modify: none (fresh repo)

**Interfaces:**
- Produces: pnpm workspace registration; root-level lint/build/test scripts

## Steps

### Step 1: Create pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Save to `pnpm-workspace.yaml` in the repo root.

### Step 2: Create root package.json

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

### Step 3: Create .gitignore

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

### Step 4: Commit

```bash
git add pnpm-workspace.yaml package.json .gitignore
git commit -m "chore: initialize pnpm monorepo structure"
```
