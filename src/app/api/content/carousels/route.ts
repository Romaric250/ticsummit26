import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const carousels = await prisma.homeCarousel.findMany({
      orderBy: [{ type: "asc" }, { order: "asc" }]
    })

    return NextResponse.json({
      success: true,
      data: carousels
    })
  } catch (error) {
    console.error("Error fetching carousels:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch carousels" },
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
    const { type, slides } = body

    if (!type || !Array.isArray(slides)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Delete existing carousels of this type
    await prisma.homeCarousel.deleteMany({
      where: { type }
    })

    // Create new slides
    const created = await prisma.homeCarousel.createMany({
      data: slides.map((slide: any) => ({
        type,
        imageUrl: slide.imageUrl,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        category: slide.category,
        order: slide.order,
        active: slide.active !== false
      }))
    })

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error("Error saving carousels:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save carousels" },
      { status: 500 }
    )
  }
}

