import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Get all stories for modal (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params // Not used but required for Next.js 15
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
  } catch (error: any) {
    console.error("Error fetching success stories:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch success stories" },
      { status: 500 }
    )
  }
}

// PATCH - Update a success story (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, age, school, achievement, quote, profilePhoto, fullStory, programYear, currentStatus, order, isActive } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name?.toString().trim() || ""
    if (age !== undefined) updateData.age = parseInt(age?.toString().trim() || "0")
    if (school !== undefined) updateData.school = school?.toString().trim() || ""
    if (achievement !== undefined) updateData.achievement = achievement?.toString().trim() || ""
    if (quote !== undefined) updateData.quote = quote?.toString().trim() || ""
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto?.toString().trim() || null
    if (fullStory !== undefined) updateData.fullStory = fullStory?.toString().trim() || ""
    if (programYear !== undefined) updateData.programYear = programYear?.toString().trim() || ""
    if (currentStatus !== undefined) updateData.currentStatus = currentStatus?.toString().trim() || ""
    if (order !== undefined) updateData.order = order ? parseInt(order.toString()) : 0
    if (isActive !== undefined) updateData.isActive = isActive

    const story = await prisma.techGirlsSuccessStory.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: story
    })
  } catch (error: any) {
    console.error("Error updating success story:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update success story" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a success story (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.techGirlsSuccessStory.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Success story deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting success story:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete success story" },
      { status: 500 }
    )
  }
}

