import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "6")

    // Get random alumni with profile images
    const alumni = await prisma.alumniProfile.findMany({
      where: {
        isActive: true,
        profileImage: { not: null }
      },
      take: limit * 2, // Get more to randomize
      orderBy: { createdAt: "desc" }
    })

    // Shuffle and take the requested limit
    const shuffled = alumni.sort(() => 0.5 - Math.random())
    const featuredAlumni = shuffled.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: featuredAlumni
    })
  } catch (error) {
    console.error("Error fetching featured alumni:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch featured alumni" },
      { status: 500 }
    )
  }
}
