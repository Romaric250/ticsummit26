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

    const { blogId } = await request.json()

    if (!blogId) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      )
    }

    const existing = await prisma.blogLike.findFirst({
      where: { blogId, userId: session.user.id }
    })

    let likesCount
    if (existing) {
      await prisma.blogLike.delete({ where: { id: existing.id } })
      const updated = await prisma.blogPost.update({
        where: { id: blogId },
        data: { likesCount: { decrement: 1 } },
        select: { likesCount: true }
      })
      likesCount = updated.likesCount
    } else {
      await prisma.blogLike.create({ data: { blogId, userId: session.user.id } })
      const updated = await prisma.blogPost.update({
        where: { id: blogId },
        data: { likesCount: { increment: 1 } },
        select: { likesCount: true }
      })
      likesCount = updated.likesCount
    }

    return NextResponse.json({ success: true, data: { likesCount, liked: !existing } })
  } catch (error) {
    console.error("Error toggling blog like:", error)
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
    const blogId = searchParams.get("blogId")
    if (!blogId) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      )
    }
    const existing = await prisma.blogLike.findFirst({
      where: { blogId, userId: session.user.id }
    })
    const post = await prisma.blogPost.findUnique({ where: { id: blogId }, select: { likesCount: true } })
    return NextResponse.json({ success: true, data: { likesCount: post?.likesCount ?? 0, liked: !!existing } })
  } catch (error) {
    console.error("Error getting like status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get like status" },
      { status: 500 }
    )
  }
}


