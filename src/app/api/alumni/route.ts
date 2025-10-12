import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const graduationYear = searchParams.get("graduationYear") || ""
    const location = searchParams.get("location") || ""

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { currentRole: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { achievements: { hasSome: [search] } }
      ]
    }

    if (graduationYear) {
      where.graduationYear = parseInt(graduationYear)
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }

    const alumni = await prisma.alumniProfile.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: alumni
    })
  } catch (error) {
    console.error("Error fetching alumni:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch alumni" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      slug,
      profileImage,
      bio,
      graduationYear,
      currentRole,
      company,
      location,
      achievements,
      socialLinks
    } = body

    // Validation
    if (!name || !email || !slug) {
      return NextResponse.json(
        { success: false, error: "Name, email, and slug are required" },
        { status: 400 }
      )
    }

    // Check if email is already taken
    const existingEmail = await prisma.alumniProfile.findFirst({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email is already taken" },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingSlug = await prisma.alumniProfile.findFirst({
      where: { slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug is already taken" },
        { status: 400 }
      )
    }

    const alumni = await prisma.alumniProfile.create({
      data: {
        name,
        email,
        slug,
        profileImage,
        bio,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        currentRole,
        company,
        location,
        achievements: achievements || [],
        socialLinks: socialLinks || {}
      }
    })

    return NextResponse.json({
      success: true,
      data: alumni
    })
  } catch (error) {
    console.error("Error creating alumni:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create alumni" },
      { status: 500 }
    )
  }
}
