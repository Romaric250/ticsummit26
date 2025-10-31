import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: partners
    })
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch partners" },
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
    const { partners } = body

    if (!Array.isArray(partners)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Delete all existing partners
    await prisma.partner.deleteMany({})

    // Create new partners
    const created = await prisma.partner.createMany({
      data: partners.map((partner: any) => ({
        name: partner.name,
        logoUrl: partner.logoUrl,
        website: partner.website,
        order: partner.order,
        active: partner.active !== false
      }))
    })

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error("Error saving partners:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save partners" },
      { status: 500 }
    )
  }
}

