import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get similar projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '3')
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Get similar projects (same category, excluding current project)
    const similarProjects = await prisma.project.findMany({
      where: {
        id: { not: projectId },
        category: category || undefined,
        status: { in: ["APPROVED", "FINALIST", "WINNER"] }
      },
      orderBy: [
        { likes: "desc" },
        { views: "desc" },
        { createdAt: "desc" }
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        images: true,
        techStack: true,
        members: true,
        category: true,
        status: true,
        slug: true,
        year: true,
        demoUrl: true,
        views: true,
        likes: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: similarProjects 
    })
  } catch (error) {
    console.error("Error fetching similar projects:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch similar projects" },
      { status: 500 }
    )
  }
}
