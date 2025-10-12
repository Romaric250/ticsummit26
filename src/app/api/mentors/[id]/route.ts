import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Get single mentor by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mentor = await prisma.mentorProfile.findUnique({
      where: { slug: params.id }, // Using slug instead of id
    })

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mentor,
      message: "Mentor fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching mentor:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentor" },
      { status: 500 }
    )
  }
}

// Update mentor (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin (you can implement your own admin check)
    // For now, we'll allow any authenticated user to update mentors
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
      isActive
    } = body

    // Check if mentor exists
    const existingMentor = await prisma.mentorProfile.findUnique({
      where: { slug: params.id }
    })

    if (!existingMentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      )
    }

    const mentor = await prisma.mentorProfile.update({
      where: { slug: params.id },
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
        languages,
        achievements,
        socialLinks,
        isActive,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: mentor,
      message: "Mentor updated successfully"
    })
  } catch (error) {
    console.error("Error updating mentor:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update mentor" },
      { status: 500 }
    )
  }
}

// Delete mentor (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin (you can implement your own admin check)
    // For now, we'll allow any authenticated user to delete mentors
    // You can add admin role checking here

    // Check if mentor exists
    const existingMentor = await prisma.mentorProfile.findUnique({
      where: { slug: params.id }
    })

    if (!existingMentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      )
    }

    await prisma.mentorProfile.delete({
      where: { slug: params.id }
    })

    return NextResponse.json({
      success: true,
      message: "Mentor deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting mentor:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete mentor" },
      { status: 500 }
    )
  }
}
