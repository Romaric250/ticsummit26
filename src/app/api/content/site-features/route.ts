import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const features = await prisma.siteFeature.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: features
    })
  } catch (error) {
    console.error("Error fetching site features:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch site features" },
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
    const { features } = body

    if (!Array.isArray(features)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Delete all existing features
    await prisma.siteFeature.deleteMany({})

    // Create new features
    const created = await prisma.siteFeature.createMany({
      data: features.map((feature: any) => ({
        title: feature.title,
        description: feature.description,
        iconName: feature.iconName,
        color: feature.color,
        order: feature.order,
        active: feature.active !== false
      }))
    })

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error("Error saving site features:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save site features" },
      { status: 500 }
    )
  }
}

