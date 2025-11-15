import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH - Update applicant status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      )
    }

    const applicant = await prisma.techGirlsApplicant.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      data: applicant
    })
  } catch (error: any) {
    console.error("Error updating applicant:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update applicant" },
      { status: 500 }
    )
  }
}

// DELETE - Delete an applicant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.techGirlsApplicant.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Applicant deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting applicant:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete applicant" },
      { status: 500 }
    )
  }
}

