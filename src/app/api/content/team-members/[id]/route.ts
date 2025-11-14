import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Helper function to check if string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// GET single team member by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if it's a valid ObjectId (ID) or a slug
    const where = isValidObjectId(id) 
      ? { id } 
      : { slug: id }
    
    const member = await prisma.teamMember.findUnique({
      where
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: member
    })
  } catch (error) {
    console.error("Error fetching team member:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch team member" },
      { status: 500 }
    )
  }
}

// PUT update team member (by ID only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // PUT operations should only use ID, not slug
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format. Use team member ID for updates." },
        { status: 400 }
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

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        slug,
        role,
        bio,
        imageUrl,
        email,
        linkedin,
        twitter,
        github,
        activities: activities ? activities : undefined,
        achievements: achievements ? achievements : undefined,
        order,
        active
      }
    })

    return NextResponse.json({
      success: true,
      data: updated
    })
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 }
    )
  }
}

// DELETE team member (by ID only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // DELETE operations should only use ID, not slug
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format. Use team member ID for deletion." },
        { status: 400 }
      )
    }

    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 }
    )
  }
}

