import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all success stories for admin (including inactive)
export async function GET(request: NextRequest) {
  try {
    const stories = await prisma.techGirlsSuccessStory.findMany({
      where: {},
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json({
      success: true,
      data: stories
    })
  } catch (error: any) {
    console.error("Error fetching success stories:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch success stories" },
      { status: 500 }
    )
  }
}

