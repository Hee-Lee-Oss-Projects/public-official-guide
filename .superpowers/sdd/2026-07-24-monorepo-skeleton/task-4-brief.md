# Task 4: Create apps/web (Next.js 15 App Router)

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

## Steps

### Step 1: Create apps/web/package.json

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

### Step 2: Create apps/web/tsconfig.json

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

### Step 3: Create apps/web/next.config.ts

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

### Step 4: Create apps/web/app/layout.tsx

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

### Step 5: Create apps/web/app/page.tsx

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

### Step 6: Create apps/web/app/auth/callback/route.ts

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

### Step 7: Create apps/web/middleware.ts

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

### Step 8: Create apps/web/.env.example

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

### Step 9: Commit

```bash
git add apps/web/
git commit -m "feat: set up Next.js 15 App Router with Clerk auth scaffolding"
```
