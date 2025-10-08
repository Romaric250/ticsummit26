import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, image, techStack, category, status, phase } = body

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title,
        description,
        image,
        techStack,
        category,
        status,
        phase
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
