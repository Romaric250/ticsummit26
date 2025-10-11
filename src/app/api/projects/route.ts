import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST new project
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
    const { title, description, image, techStack, category, status, phase } = body

    const project = await prisma.project.create({
      data: {
        title,
        description,
        image,
        techStack,
        category,
        status: status || "SUBMITTED",
        phase,
        authorId: session.user.id
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
    console.error("Error creating project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    )
  }
}