import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch success stories (public endpoint, returns 3 random active stories)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get("all") === "true"

    if (all) {
      // Return all active stories (for modal navigation)
      const stories = await prisma.techGirlsSuccessStory.findMany({
        where: {
          isActive: true
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" }
        ]
      })

      return NextResponse.json({
        success: true,
        data: stories
      })
    } else {
      // Public endpoint - return 3 random active stories
      const activeStories = await prisma.techGirlsSuccessStory.findMany({
        where: {
          isActive: true
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" }
        ]
      })

      // Shuffle and take 3 random stories (or all if less than 3)
      const shuffled = [...activeStories].sort(() => 0.5 - Math.random())
      const randomStories = shuffled.slice(0, Math.min(3, shuffled.length))

      return NextResponse.json({
        success: true,
        data: randomStories
      })
    }
  } catch (error: any) {
    console.error("Error fetching success stories:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch success stories" },
      { status: 500 }
    )
  }
}

// POST - Create a new success story (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, age, school, achievement, quote, profilePhoto, fullStory, programYear, currentStatus, order, isActive } = body

    // Trim string fields and validate required fields
    const trimmedName = name?.toString().trim() || ""
    const trimmedSchool = school?.toString().trim() || ""
    const trimmedAchievement = achievement?.toString().trim() || ""
    const trimmedQuote = quote?.toString().trim() || ""
    const trimmedFullStory = fullStory?.toString().trim() || ""
    const trimmedProgramYear = programYear?.toString().trim() || ""
    const trimmedCurrentStatus = currentStatus?.toString().trim() || ""
    const ageValue = age?.toString().trim() || ""

    // Validate required fields with detailed error messages
    const missingFields: string[] = []
    if (!trimmedName) missingFields.push("name")
    if (!ageValue || isNaN(parseInt(ageValue))) missingFields.push("age")
    if (!trimmedSchool) missingFields.push("school")
    if (!trimmedAchievement) missingFields.push("achievement")
    if (!trimmedQuote) missingFields.push("quote")
    if (!trimmedFullStory) missingFields.push("fullStory")
    if (!trimmedProgramYear) missingFields.push("programYear")
    if (!trimmedCurrentStatus) missingFields.push("currentStatus")

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(", ")}`,
          missingFields 
        },
        { status: 400 }
      )
    }

    // Create success story
    const story = await prisma.techGirlsSuccessStory.create({
      data: {
        name: trimmedName,
        age: parseInt(ageValue),
        school: trimmedSchool,
        achievement: trimmedAchievement,
        quote: trimmedQuote,
        profilePhoto: profilePhoto?.toString().trim() || null,
        fullStory: trimmedFullStory,
        programYear: trimmedProgramYear,
        currentStatus: trimmedCurrentStatus,
        order: order ? parseInt(order.toString()) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      data: story
    })
  } catch (error: any) {
    console.error("Error creating success story:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create success story" },
      { status: 500 }
    )
  }
}

