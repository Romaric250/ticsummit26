import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: members
    })
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch team members" },
      { status: 500 }
    )
  }
}

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
    const { members } = body

    if (!Array.isArray(members)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Delete all existing members
    await prisma.teamMember.deleteMany({})

    // Create new members
    const created = await prisma.teamMember.createMany({
      data: members.map((member: any) => ({
        name: member.name,
        slug: member.slug || member.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
        role: member.role,
        bio: member.bio,
        imageUrl: member.imageUrl,
        email: member.email,
        linkedin: member.linkedin,
        twitter: member.twitter,
        github: member.github,
        activities: member.activities || null,
        achievements: member.achievements || null,
        order: member.order,
        active: member.active !== false
      }))
    })

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error("Error saving team members:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save team members" },
      { status: 500 }
    )
  }
}

