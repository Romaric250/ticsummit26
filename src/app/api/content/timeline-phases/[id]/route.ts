import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.timelinePhase.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error deleting timeline phase:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete phase" },
      { status: 500 }
    )
  }
}

