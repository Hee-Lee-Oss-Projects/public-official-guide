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
