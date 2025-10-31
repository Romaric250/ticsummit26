import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const mvv = await prisma.missionVisionValues.findFirst({
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: mvv || {
        mission: "Empower young innovators through technology, mentorship, and hands-on learning experiences.",
        vision: "Create a thriving ecosystem where young minds can innovate and build the future of Cameroon.",
        values: "Innovation, collaboration, excellence, and impact drive everything we do.",
        introText: "The summit provides a platform for these brilliant minds to connect with industry experts, gain valuable mentorship, and win prizes for their innovative ideas. We believe that every young person has the potential to change the world through technology."
      }
    })
  } catch (error) {
    console.error("Error fetching mission/vision/values:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch mission/vision/values" },
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
    const { mission, vision, values, introText } = body

    if (!mission || !vision || !values) {
      return NextResponse.json(
        { success: false, error: "Mission, vision, and values are required" },
        { status: 400 }
      )
    }

    // Get existing or create new
    const existing = await prisma.missionVisionValues.findFirst()

    let mvvData
    if (existing) {
      mvvData = await prisma.missionVisionValues.update({
        where: { id: existing.id },
        data: {
          mission,
          vision,
          values,
          introText: introText || null
        }
      })
    } else {
      mvvData = await prisma.missionVisionValues.create({
        data: {
          mission,
          vision,
          values,
          introText: introText || null
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: mvvData
    })
  } catch (error) {
    console.error("Error saving mission/vision/values:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save mission/vision/values" },
      { status: 500 }
    )
  }
}

