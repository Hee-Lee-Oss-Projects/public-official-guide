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
