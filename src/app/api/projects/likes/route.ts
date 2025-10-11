import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// Toggle like (auth required)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const { projectId } = await request.json()
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Check if user already liked this project
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        postId: projectId
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
          id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: session.user.id,
          postId: projectId
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

// Get like status (auth required)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Check if user liked this project
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        postId: projectId
      }
    })

    // Get current likes count
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        likes: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: { 
        likes: project?.likes || 0,
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
