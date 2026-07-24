import type { LLMRequest, LLMResponse } from "./types"

export abstract class LLMClient {
  abstract complete(request: LLMRequest): Promise<LLMResponse>
}
