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
      readTime,
      authorName 
    } = body

    // Check if slug already exists (excluding current post)
    if (slug) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug }
      })

      if (existingPost && existingPost.id !== id) {
        return NextResponse.json(
          { success: false, error: `A blog post with the slug "${slug}" already exists. Please use a different slug.` },
          { status: 400 }
        )
      }
    }

    // Prepare author data: either authorName OR authorId, never both
    // If authorName is provided (non-empty string), use it and set authorId to null
    // Otherwise, use the session user's ID and set authorName to null
    const trimmedAuthorName = authorName && typeof authorName === 'string' ? authorName.trim() : null
    const authorData = trimmedAuthorName && trimmedAuthorName.length > 0
      ? {
          authorName: trimmedAuthorName,
          authorId: null
        }
      : {
          authorName: null,
          authorId: session.user.id
        }

    // If authorName is provided, use it and set authorId to null
    // Otherwise, use the session user's ID
    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image: image || null,
        category,
        tags: tags || [],
        featured,
        published,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        readTime: readTime || null,
        ...authorData
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
  } catch (error: any) {
    console.error("Error updating blog post:", error)
    
    // Handle Prisma unique constraint errors
    if (error?.code === 'P2002') {
      const field = error?.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { success: false, error: `A blog post with this ${field} already exists. Please use a different ${field}.` },
        { status: 400 }
      )
    }

    // Handle other Prisma errors
    if (error?.code) {
      return NextResponse.json(
        { success: false, error: error.message || "Database error occurred" },
        { status: 400 }
      )
    }

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
