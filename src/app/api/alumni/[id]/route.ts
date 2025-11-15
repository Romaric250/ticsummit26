import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const alumni = await prisma.alumniProfile.findUnique({
      where: { slug: id }
    })

    if (!alumni) {
      return NextResponse.json(
        { success: false, error: "Alumni not found" },
        { status: 404 }
      )
    }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if alumni exists
    const existingAlumni = await prisma.alumniProfile.findUnique({
      where: { slug: id }
    })

    if (!existingAlumni) {
      return NextResponse.json(
        { success: false, error: "Alumni not found" },
        { status: 404 }
      )
    }

    // Check if email is already taken by another alumni
    if (email && email !== existingAlumni.email) {
      const existingEmail = await prisma.alumniProfile.findFirst({
        where: { 
          email,
          id: { not: existingAlumni.id }
        }
      })

      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: "Email is already taken" },
          { status: 400 }
        )
      }
    }

    // Check if slug is already taken by another alumni
    if (slug && slug !== existingAlumni.slug) {
      const existingSlug = await prisma.alumniProfile.findFirst({
        where: { 
          slug,
          id: { not: existingAlumni.id }
        }
      })

      if (existingSlug) {
        return NextResponse.json(
          { success: false, error: "Slug is already taken" },
          { status: 400 }
        )
      }
    }

    // Validate biography word count (must not exceed 75 words)
    if (bio !== undefined) {
      if (!bio || bio.trim() === "") {
        return NextResponse.json(
          { success: false, error: "Biography is required" },
          { status: 400 }
        )
      }
      const wordCount = bio.trim().split(/\s+/).filter((word: string) => word.length > 0).length
      if (wordCount > 75) {
        return NextResponse.json(
          { success: false, error: `Biography must not exceed 75 words. Current: ${wordCount} words` },
          { status: 400 }
        )
      }
    }

    const alumni = await prisma.alumniProfile.update({
      where: { slug: id },
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
    console.error("Error updating alumni:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update alumni" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const alumni = await prisma.alumniProfile.findUnique({
      where: { slug: id }
    })

    if (!alumni) {
      return NextResponse.json(
        { success: false, error: "Alumni not found" },
        { status: 404 }
      )
    }

    await prisma.alumniProfile.delete({
      where: { slug: id }
    })

    return NextResponse.json({
      success: true,
      message: "Alumni deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting alumni:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete alumni" },
      { status: 500 }
    )
  }
}
