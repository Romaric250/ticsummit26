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
      // Get all projects with pagination support
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '6')
      const skip = (page - 1) * limit
      const search = searchParams.get('search') || ''
      const category = searchParams.get('category') || ''
      
      // Build category filter
      const categoryFilter: any = {}
      if (category && category !== 'all') {
        categoryFilter.category = category
      }
      
      // Get total count for all projects (for placeholder)
      const totalCount = await prisma.project.count({})
      
      // Get all projects (we'll filter search client-side to include members)
      const allProjects = await prisma.project.findMany({
        where: Object.keys(categoryFilter).length > 0 ? categoryFilter : undefined,
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

      // Filter by search term (title, description, or members)
      let filteredProjects = allProjects
      if (search) {
        const searchLower = search.toLowerCase()
        filteredProjects = allProjects.filter(p => {
          // Check if search matches title
          const matchesTitle = p.title.toLowerCase().includes(searchLower)
          
          // Check if search matches description
          const matchesDescription = p.description.toLowerCase().includes(searchLower)
          
          // Check if search matches any member name
          const matchesMembers = p.members && Array.isArray(p.members) && 
            p.members.some(member => member.toLowerCase().includes(searchLower))
          
          return matchesTitle || matchesDescription || matchesMembers
        })
      }

      // Separate projects with images and without images
      const projectsWithImages = filteredProjects.filter(p => p.images && Array.isArray(p.images) && p.images.length > 0)
      const projectsWithoutImages = filteredProjects.filter(p => !p.images || !Array.isArray(p.images) || p.images.length === 0)

      // Combine: projects with images first, then without
      const sortedProjects = [...projectsWithImages, ...projectsWithoutImages]
      
      // Apply pagination
      const paginatedProjects = sortedProjects.slice(skip, skip + limit)
      const filteredTotal = sortedProjects.length
      const hasMore = skip + limit < filteredTotal

      return NextResponse.json({ 
        success: true, 
        data: paginatedProjects,
        pagination: {
          page,
          limit,
          total: filteredTotal,
          totalCount, // Total projects in DB (for placeholder)
          hasMore,
          totalPages: Math.ceil(filteredTotal / limit)
        }
      })
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
    const { title, description, images, techStack, members, category, status, phase, year, demoUrl } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const project = await prisma.project.create({
      data: {
        title,
        description,
        images,
        techStack,
        members,
        category,
        status: status || "SUBMITTED",
        phase,
        year,
        demoUrl,
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