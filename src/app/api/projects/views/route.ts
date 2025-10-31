import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Increment views (no auth required, but tracks unique views)
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

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    console.log(`Checking views for project ${projectId}, IP: ${ipAddress}`)

    // Check if this IP has already viewed this project
    const existingView = await prisma.view.findFirst({
      where: {
        projectId: projectId,
        ipAddress: ipAddress
      }
    })

    if (existingView) {
      console.log(`Already viewed by IP ${ipAddress}`)
      // Already viewed, return current count
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { views: true }
      })
      return NextResponse.json({ 
        success: true, 
        data: { views: project?.views || 0 },
        message: "Already viewed"
      })
    }

    console.log(`New view from IP ${ipAddress}, creating view record`)

    // Create new view record
    await prisma.view.create({
      data: {
        projectId: projectId,
        ipAddress: ipAddress,
        userAgent: userAgent
      }
    })

    // Get current views count and increment manually (MongoDB increment might not work)
    const currentProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { views: true }
    })
    
    const newViewsCount = (currentProject?.views || 0) + 1
    
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        views: newViewsCount
      },
      select: {
        id: true,
        views: true
      }
    })

    console.log(`View recorded successfully, new count: ${project.views}`)
    return NextResponse.json({ 
      success: true, 
      data: { views: project.views },
      message: "View recorded"
    })
  } catch (error) {
    console.error("Error incrementing views:", error)
    return NextResponse.json(
      { success: false, error: "Failed to increment views" },
      { status: 500 }
    )
  }
}