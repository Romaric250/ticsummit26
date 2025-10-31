import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const member = await prisma.teamMember.findUnique({
      where: { slug }
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

