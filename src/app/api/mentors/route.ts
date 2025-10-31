import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Get all mentors (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const specialty = searchParams.get('specialty')
    const location = searchParams.get('location')
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
        { specialties: { has: search } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (specialty) {
      whereClause.specialties = { has: specialty }
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' }
    }

    const mentors = await prisma.mentorProfile.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: mentors,
      message: "Mentors fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching mentors:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentors" },
      { status: 500 }
    )
  }
}

// Create new mentor (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin (you can implement your own admin check)
    // For now, we'll allow any authenticated user to create mentors
    // You can add admin role checking here

    const body = await request.json()
    const {
      name,
      email,
      slug,
      profileImage,
      bio,
      specialties,
      experience,
      company,
      location,
      education,
      languages,
      achievements,
      socialLinks,
      yearJoined,
      isActive = true
    } = body

    // Validate required fields
    if (!name || !email || !slug || !specialties || specialties.length === 0) {
      return NextResponse.json(
        { success: false, error: "Name, email, slug, and specialties are required" },
        { status: 400 }
      )
    }

    // Check if email is already taken
    const existingEmail = await prisma.mentorProfile.findFirst({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email is already taken" },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingSlug = await prisma.mentorProfile.findUnique({
      where: { slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug is already taken" },
        { status: 400 }
      )
    }

    const mentor = await prisma.mentorProfile.create({
      data: {
        name,
        email,
        slug,
        profileImage,
        bio,
        specialties,
        experience,
        company,
        location,
        education,
        languages: languages || [],
        achievements: achievements || [],
        socialLinks: socialLinks || {},
        yearJoined: yearJoined ? parseInt(yearJoined) : null,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: mentor,
      message: "Mentor created successfully"
    })
  } catch (error) {
    console.error("Error creating mentor:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create mentor" },
      { status: 500 }
    )
  }
}
