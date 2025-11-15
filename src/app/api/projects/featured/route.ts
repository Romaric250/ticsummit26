import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get 4 random projects from different categories
export async function GET(request: NextRequest) {
  try {
    // Get all available categories
    const categories = await prisma.project.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    })

    const availableCategories = categories.map(c => c.category).filter(Boolean)
    
    if (availableCategories.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No projects found"
      })
    }

    // Select 4 random categories (or all if less than 4)
    const selectedCategories = availableCategories
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)

    const projects = []

    // Get one random project from each selected category (only with images)
    for (const category of selectedCategories) {
      const allCategoryProjects = await prisma.project.findMany({
        where: {
          category: category
        },
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
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      })

      // Filter to only projects with images
      const categoryProjects = allCategoryProjects.filter(p => p.images && Array.isArray(p.images) && p.images.length > 0)

      if (categoryProjects.length > 0) {
        // Get a random project from this category
        const randomProject = categoryProjects[Math.floor(Math.random() * categoryProjects.length)]
        projects.push(randomProject)
      }
    }

    // If we don't have 4 projects yet, fill with random projects from any category
    if (projects.length < 4) {
      const remainingCount = 4 - projects.length
      const usedIds = projects.map(p => p.id)
      
      const allAdditionalProjects = await prisma.project.findMany({
        where: {
          id: {
            notIn: usedIds
          }
        },
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
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        take: remainingCount * 2 // Get more to filter
      })

      // Filter to only projects with images
      const additionalProjects = allAdditionalProjects.filter(p => p.images && Array.isArray(p.images) && p.images.length > 0).slice(0, remainingCount)

      projects.push(...additionalProjects)
    }

    return NextResponse.json({
      success: true,
      data: projects,
      message: "Random projects fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching random projects:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}
