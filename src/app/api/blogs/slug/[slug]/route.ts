import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const blogPost = await prisma.blogPost.findFirst({
      where: { slug: params.slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } }
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
    console.error("Error fetching blog by slug:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
}


