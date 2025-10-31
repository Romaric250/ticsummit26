import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


export async function GET() {
  try {
    const phases = await prisma.timelinePhase.findMany({
      orderBy: { order: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: phases
    })
  } catch (error) {
    console.error("Error fetching timeline phases:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch timeline phases" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { phases } = body

    if (!Array.isArray(phases)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Delete all existing phases
    await prisma.timelinePhase.deleteMany({})

    // Create new phases
    const created = await prisma.timelinePhase.createMany({
      data: phases.map((phase: any) => ({
        title: phase.title,
        duration: phase.duration,
        status: phase.status,
        description: phase.description,
        details: phase.details || [],
        iconName: phase.iconName,
        color: phase.color,
        participants: phase.participants,
        order: phase.order
      }))
    })

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error("Error saving timeline phases:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save timeline phases" },
      { status: 500 }
    )
  }
}

