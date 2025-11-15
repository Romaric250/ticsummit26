import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

// GET all blog posts
// - Admins: get all posts (published and draft)
// - Public: get only published posts
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth.api.getSession({ headers: request.headers })
    const isAdmin = session?.user?.role === "ADMIN"

    const blogPosts = await prisma.blogPost.findMany({
      where: isAdmin
        ? {} // Admin sees all posts
        : {
            published: true // Public sees only published posts
          },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ success: true, data: blogPosts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

// POST new blog post
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

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: `A blog post with the slug "${slug}" already exists. Please use a different slug.` },
        { status: 400 }
      )
    }

    // Prepare author data: either authorName OR authorId, never both
    const trimmedAuthorName = authorName?.trim() || null
    const authorData = trimmedAuthorName
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
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image: image || null,
        category,
        tags: tags || [],
        featured: featured || false,
        published: published || false,
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
    console.error("Error creating blog post:", error)
    
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
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}
