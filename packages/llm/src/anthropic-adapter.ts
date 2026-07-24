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
