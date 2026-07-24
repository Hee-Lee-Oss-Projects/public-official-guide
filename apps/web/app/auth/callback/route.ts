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
