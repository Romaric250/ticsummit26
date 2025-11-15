import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient, ProjectStatus } from "@prisma/client"

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

    // Prevent caching
    const headers = new Headers()
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')

    // Get all project counts by status
    const [
      totalProjects,
      winners,
      approved,
      underReview,
      finalists,
      submitted,
      rejected
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: ProjectStatus.WINNER } }),
      prisma.project.count({ where: { status: ProjectStatus.APPROVED } }),
      prisma.project.count({ where: { status: ProjectStatus.UNDER_REVIEW } }),
      prisma.project.count({ where: { status: ProjectStatus.FINALIST } }),
      prisma.project.count({ where: { status: ProjectStatus.SUBMITTED } }),
      prisma.project.count({ where: { status: ProjectStatus.REJECTED } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        total: totalProjects,
        winners,
        approved,
        underReview,
        finalists,
        submitted,
        rejected
      }
    }, { headers })
  } catch (error) {
    console.error("Error fetching project stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch project stats" },
      { status: 500 }
    )
  }
}

