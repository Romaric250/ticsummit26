import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// GET all projects or single project by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      // Get single project by slug
      const project = await prisma.project.findFirst({
        where: { slug },
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

      return NextResponse.json({ success: true, data: [project] })
    } else {
      // Get all projects
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
    }
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
    const { title, description, image, techStack, members, category, status, phase } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const project = await prisma.project.create({
      data: {
        title,
        description,
        image,
        techStack,
        members,
        category,
        status: status || "SUBMITTED",
        phase,
        slug,
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