# Task 3: Create packages/llm with provider-neutral LLM client

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

## Steps

### Step 1: Create packages/llm/package.json

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

### Step 2: Create packages/llm/tsconfig.json

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

### Step 3: Create packages/llm/src/types.ts

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

### Step 4: Create packages/llm/src/client.ts

```typescript
import type { LLMRequest, LLMResponse } from "./types"

export abstract class LLMClient {
  abstract complete(request: LLMRequest): Promise<LLMResponse>
}
```

### Step 5: Create packages/llm/src/anthropic-adapter.ts

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

### Step 6: Create packages/llm/src/index.ts

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

### Step 7: Create packages/llm/__tests__/client.test.ts

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

### Step 8: Commit

```bash
git add packages/llm/
git commit -m "feat: add provider-neutral LLM client with Anthropic adapter"
```
