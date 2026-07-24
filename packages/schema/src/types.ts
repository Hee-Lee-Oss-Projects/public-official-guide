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
