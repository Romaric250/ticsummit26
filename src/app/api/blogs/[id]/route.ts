import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// GET single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: blogPost })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
}

// PUT update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      image, 
      category, 
      tags, 
      featured, 
      published, 
      publishedAt,
      readTime 
    } = body

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        tags,
        featured,
        published,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        readTime
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: blogPost })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    )
  }
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}
