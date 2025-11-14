import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Toggle like (no auth required - IP-based)
export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Check if this IP already liked this project
    const existingLike = await prisma.like.findFirst({
      where: {
        projectId: projectId,
        ipAddress: ipAddress
      }
    })

    let project
    if (existingLike) {
      // Unlike: remove the like and decrement count
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      
      project = await prisma.project.update({
        where: { id: projectId },
        data: {
          likes: {
            decrement: 1
          }
        },
        select: {
          id: true,
          likes: true
        }
      })
    } else {
      // Like: create new like and increment count
      await prisma.like.create({
        data: {
          projectId: projectId,
          ipAddress: ipAddress,
          userAgent: userAgent
        }
      })
      
      project = await prisma.project.update({
        where: { id: projectId },
        data: {
          likes: {
            increment: 1
          }
        },
        select: {
          id: true,
          likes: true
        }
      })
    }

    // Double-check: count actual likes in database to ensure accuracy
    const actualLikesCount = await prisma.like.count({
      where: { projectId: projectId }
    })

    // If there's a mismatch, fix it
    if (actualLikesCount !== project.likes) {
      project = await prisma.project.update({
        where: { id: projectId },
        data: {
          likes: actualLikesCount
        },
        select: {
          id: true,
          likes: true
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        likes: project.likes,
        liked: !existingLike
      } 
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { success: false, error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}

// Get like status (no auth required - IP-based)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Check if this IP liked this project
    const existingLike = await prisma.like.findFirst({
      where: {
        projectId: projectId,
        ipAddress: ipAddress
      }
    })

    // Get actual likes count from database
    const actualLikesCount = await prisma.like.count({
      where: { projectId: projectId }
    })

    // Update project likes count if it's different
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        likes: true
      }
    })

    if (project && actualLikesCount !== project.likes) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          likes: actualLikesCount
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        likes: actualLikesCount,
        liked: !!existingLike
      } 
    })
  } catch (error) {
    console.error("Error getting like status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get like status" },
      { status: 500 }
    )
  }
}