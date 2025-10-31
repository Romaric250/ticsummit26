import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get counts
    const [blogsCount, projectsCount, mentorsCount, alumniCount] = await Promise.all([
      prisma.blogPost.count(),
      prisma.project.count(),
      prisma.mentorProfile.count(),
      prisma.alumniProfile.count(),
    ])

    // Get published blogs count
    const publishedBlogsCount = await prisma.blogPost.count({
      where: { published: true }
    })

    // Get total views and likes
    const [totalBlogViews, totalProjectViews, totalBlogLikes, totalProjectLikes] = await Promise.all([
      prisma.blogView.aggregate({
        _count: { id: true }
      }),
      prisma.view.aggregate({
        _count: { id: true }
      }),
      prisma.blogLike.aggregate({
        _count: { id: true }
      }),
      prisma.like.aggregate({
        _count: { id: true }
      }),
    ])

    // Get recent blog posts (for chart data - last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentBlogs = await prisma.blogPost.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Get recent projects (for chart data - last 7 days)
    const recentProjects = await prisma.project.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by date for chart data
    const blogChartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const count = recentBlogs.filter(blog => {
        const blogDate = new Date(blog.createdAt)
        blogDate.setHours(0, 0, 0, 0)
        return blogDate >= date && blogDate < nextDate
      }).length

      return {
        date: date.toISOString().split('T')[0],
        count
      }
    })

    const projectChartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const count = recentProjects.filter(project => {
        const projectDate = new Date(project.createdAt)
        projectDate.setHours(0, 0, 0, 0)
        return projectDate >= date && projectDate < nextDate
      }).length

      return {
        date: date.toISOString().split('T')[0],
        count
      }
    })

    // Get projects by status for pie chart
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Get blogs by category for pie chart
    const blogsByCategory = await prisma.blogPost.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          blogs: blogsCount,
          publishedBlogs: publishedBlogsCount,
          projects: projectsCount,
          mentors: mentorsCount,
          alumni: alumniCount,
          totalViews: totalBlogViews._count.id + totalProjectViews._count.id,
          totalLikes: totalBlogLikes._count.id + totalProjectLikes._count.id,
        },
        charts: {
          blogsLast7Days: blogChartData,
          projectsLast7Days: projectChartData,
          projectsByStatus: projectsByStatus.map(item => ({
            status: item.status,
            count: item._count.id
          })),
          blogsByCategory: blogsByCategory.map(item => ({
            category: item.category,
            count: item._count.id
          })),
        }
      }
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

