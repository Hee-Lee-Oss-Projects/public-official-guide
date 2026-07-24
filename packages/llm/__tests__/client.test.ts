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
