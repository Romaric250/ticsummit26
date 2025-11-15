import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, ProjectStatus } from "@prisma/client"
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
      const status = searchParams.get('status') || ''
      
      // Build where clause for database filtering
      const whereClause: any = {}
      
      if (category && category !== 'all') {
        whereClause.category = category
      }
      
      if (status && status !== 'all') {
        whereClause.status = status as ProjectStatus
      }
      
      // Database-level search for title and description
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      // Get total count for all projects (for placeholder)
      const totalCount = await prisma.project.count({})
      
      // Get projects with database filtering
      let dbFilteredProjects = await prisma.project.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
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

      // If searching, also find projects matching members (since members is an array field)
      let memberMatchedProjects: typeof dbFilteredProjects = []
      if (search) {
        const searchLower = search.toLowerCase()
        // Get all projects (without search filter) to check members
        const memberSearchWhere: any = {}
        if (category && category !== 'all') {
          memberSearchWhere.category = category
        }
        if (status && status !== 'all') {
          memberSearchWhere.status = status as ProjectStatus
        }
        const allProjectsForMemberSearch = await prisma.project.findMany({
          where: Object.keys(memberSearchWhere).length > 0 ? memberSearchWhere : undefined,
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
        
        // Filter by members
        memberMatchedProjects = allProjectsForMemberSearch.filter(p => {
          return p.members && Array.isArray(p.members) && 
            p.members.some(member => member.toLowerCase().includes(searchLower))
        })
      }

      // Combine DB results with member matches, removing duplicates
      const projectIds = new Set(dbFilteredProjects.map(p => p.id))
      const combinedProjects = [...dbFilteredProjects]
      memberMatchedProjects.forEach(p => {
        if (!projectIds.has(p.id)) {
          combinedProjects.push(p)
          projectIds.add(p.id)
        }
      })
      
      const filteredProjects = combinedProjects

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