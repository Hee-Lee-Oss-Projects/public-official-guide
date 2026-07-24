import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

export type { Tenant, User, LLMCall } from "@prisma/client"
export * from "./types"
