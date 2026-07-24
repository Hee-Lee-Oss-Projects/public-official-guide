# Task 2: Create packages/schema with Prisma setup

**Files:**
- Create: `packages/schema/package.json`
- Create: `packages/schema/tsconfig.json`
- Create: `packages/schema/prisma/schema.prisma`
- Create: `packages/schema/.env.example`
- Create: `packages/schema/src/index.ts`
- Create: `packages/schema/src/types.ts`

**Interfaces:**
- Produces: Prisma client, PrismaClient export, Tenant type, shared types (Tenant, User, LLMCall)

## Steps

### Step 1: Create packages/schema/package.json

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

### Step 2: Create packages/schema/tsconfig.json

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

### Step 3: Create packages/schema/prisma/schema.prisma

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

### Step 4: Create packages/schema/.env.example

```
DATABASE_URL="postgresql://user:password@localhost:5432/public_official_guide?schema=public"
```

### Step 5: Create packages/schema/src/types.ts

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

### Step 6: Create packages/schema/src/index.ts

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

export type { Tenant, User, LLMCall } from "@prisma/client"
export * from "./types"
```

### Step 7: Commit

```bash
git add packages/schema/
git commit -m "chore: set up Prisma schema with tenant-scoped data model"
```
