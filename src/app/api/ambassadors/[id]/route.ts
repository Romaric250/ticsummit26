import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Get single ambassador by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ambassador = await prisma.ambassadorProfile.findUnique({
      where: { slug: id }
    })

    if (!ambassador) {
      return NextResponse.json(
        { success: false, error: "Ambassador not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: ambassador,
      message: "Ambassador fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching ambassador:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch ambassador" },
      { status: 500 }
    )
  }
}

// Update ambassador (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
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
      ticPoints,
      spotlightContributions,
      isActive
    } = body

    // Check if ambassador exists
    const existingAmbassador = await prisma.ambassadorProfile.findUnique({
      where: { slug: id }
    })

    if (!existingAmbassador) {
      return NextResponse.json(
        { success: false, error: "Ambassador not found" },
        { status: 404 }
      )
    }

    // Check if email is already taken by another ambassador
    if (email && email !== existingAmbassador.email) {
      const emailTaken = await prisma.ambassadorProfile.findFirst({
        where: { 
          email,
          NOT: { slug: id }
        }
      })

      if (emailTaken) {
        return NextResponse.json(
          { success: false, error: "Email is already taken" },
          { status: 400 }
        )
      }
    }

    // Check if slug is already taken by another ambassador
    if (slug && slug !== id) {
      const slugTaken = await prisma.ambassadorProfile.findUnique({
        where: { slug }
      })

      if (slugTaken) {
        return NextResponse.json(
          { success: false, error: "Slug is already taken" },
          { status: 400 }
        )
      }
    }

    const updatedAmbassador = await prisma.ambassadorProfile.update({
      where: { slug: id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(slug && { slug }),
        ...(profileImage !== undefined && { profileImage }),
        ...(bio !== undefined && { bio }),
        ...(school && { school }),
        ...(contactInfo !== undefined && { contactInfo }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(ticPoints !== undefined && { ticPoints }),
        ...(spotlightContributions !== undefined && { spotlightContributions }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedAmbassador,
      message: "Ambassador updated successfully"
    })
  } catch (error) {
    console.error("Error updating ambassador:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update ambassador" },
      { status: 500 }
    )
  }
}

// Delete ambassador (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const ambassador = await prisma.ambassadorProfile.findUnique({
      where: { slug: id }
    })

    if (!ambassador) {
      return NextResponse.json(
        { success: false, error: "Ambassador not found" },
        { status: 404 }
      )
    }

    await prisma.ambassadorProfile.delete({
      where: { slug: id }
    })

    return NextResponse.json({
      success: true,
      message: "Ambassador deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting ambassador:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete ambassador" },
      { status: 500 }
    )
  }
}

