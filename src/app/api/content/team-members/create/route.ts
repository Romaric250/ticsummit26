import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// POST create new team member
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

    const {
      name,
      slug,
      role,
      bio,
      imageUrl,
      email,
      linkedin,
      twitter,
      github,
      activities,
      achievements,
      order,
      active
    } = body

    if (!name || !role) {
      return NextResponse.json(
        { success: false, error: "Name and role are required" },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

    // Check if slug already exists
    const existing = await prisma.teamMember.findUnique({
      where: { slug: generatedSlug }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A team member with this slug already exists" },
        { status: 400 }
      )
    }

    const created = await prisma.teamMember.create({
      data: {
        name,
        slug: generatedSlug,
        role,
        bio,
        imageUrl,
        email,
        linkedin,
        twitter,
        github,
        activities: activities || null,
        achievements: achievements || null,
        order: order || 0,
        active: active !== false
      }
    })

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create team member" },
      { status: 500 }
    )
  }
}

