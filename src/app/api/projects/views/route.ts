import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Increment views (no auth required)
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Increment views count
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: { views: project.views } 
    })
  } catch (error) {
    console.error("Error incrementing views:", error)
    return NextResponse.json(
      { success: false, error: "Failed to increment views" },
      { status: 500 }
    )
  }
}
