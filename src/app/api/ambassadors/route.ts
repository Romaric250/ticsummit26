import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Get all ambassadors (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const school = searchParams.get('school')
    const isActiveParam = searchParams.get('isActive')
    const isActive = isActiveParam === null || isActiveParam === 'true' // Default to true

    const whereClause: Record<string, unknown> = {
      isActive
    }

    // Add search filters
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { school: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (school) {
      whereClause.school = { contains: school, mode: 'insensitive' }
    }

    const ambassadors = await prisma.ambassadorProfile.findMany({
      where: whereClause,
      orderBy: {
        ticPoints: 'desc' // Order by TIC points (highest first)
      }
    })

    return NextResponse.json({
      success: true,
      data: ambassadors,
      message: "Ambassadors fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching ambassadors:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch ambassadors" },
      { status: 500 }
    )
  }
}

// Create new ambassador (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      slug,
      profileImage,
      bio,
      school,
      contactInfo,
      socialLinks,
      ticPoints = 0,
      spotlightContributions = [],
      isActive = true
    } = body

    // Validate required fields
    if (!name || !email || !slug || !school) {
      return NextResponse.json(
        { success: false, error: "Name, email, slug, and school are required" },
        { status: 400 }
      )
    }

    // Check if email is already taken
    const existingEmail = await prisma.ambassadorProfile.findFirst({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email is already taken" },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingSlug = await prisma.ambassadorProfile.findUnique({
      where: { slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug is already taken" },
        { status: 400 }
      )
    }

    const ambassador = await prisma.ambassadorProfile.create({
      data: {
        name,
        email,
        slug,
        profileImage,
        bio,
        school,
        contactInfo,
        socialLinks: socialLinks || {},
        ticPoints: ticPoints || 0,
        spotlightContributions: spotlightContributions || [],
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: ambassador,
      message: "Ambassador created successfully"
    })
  } catch (error) {
    console.error("Error creating ambassador:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create ambassador" },
      { status: 500 }
    )
  }
}

