import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '3')
    const excludeId = searchParams.get('excludeId')

    // Get all published blog posts
    const allPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        ...(excludeId ? { id: { not: excludeId } } : {})
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        category: true,
        tags: true,
        featured: true,
        published: true,
        publishedAt: true,
        views: true,
        likesCount: true,
        readTime: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Shuffle array and take limit
    const shuffled = allPosts.sort(() => 0.5 - Math.random())
    const randomPosts = shuffled.slice(0, limit)

    return NextResponse.json({ success: true, data: randomPosts })
  } catch (error) {
    console.error("Error fetching random blog posts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

