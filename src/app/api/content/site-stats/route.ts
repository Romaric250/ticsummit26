import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const stats = await prisma.siteStats.findFirst({
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: stats || {
        studentsReached: 1500,
        schoolsVisited: 28,
        successfulProjects: 150,
        daysOfInnovation: 3
      }
    })
  } catch (error) {
    console.error("Error fetching site stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch site stats" },
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
    const { studentsReached, schoolsVisited, successfulProjects, daysOfInnovation } = body

    if (!studentsReached || !schoolsVisited || !successfulProjects || !daysOfInnovation) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Get existing stats or create new one
    const existing = await prisma.siteStats.findFirst()
    
    let statsData
    if (existing) {
      statsData = await prisma.siteStats.update({
        where: { id: existing.id },
        data: { studentsReached, schoolsVisited, successfulProjects, daysOfInnovation }
      })
    } else {
      statsData = await prisma.siteStats.create({
        data: { studentsReached, schoolsVisited, successfulProjects, daysOfInnovation }
      })
    }

    return NextResponse.json({
      success: true,
      data: statsData
    })
  } catch (error) {
    console.error("Error saving site stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save site stats" },
      { status: 500 }
    )
  }
}

