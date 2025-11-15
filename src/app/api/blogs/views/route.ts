import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Increment views uniquely by (blogId + IP)
export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json()
    if (!blogId) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      )
    }

    // Derive IP (works locally and behind proxies)
    const fwd = request.headers.get("x-forwarded-for") || ""
    const ip = (fwd.split(",")[0] || request.headers.get("x-real-ip") || (request as any).ip || "unknown").trim()
    const userAgent = request.headers.get("user-agent") || undefined

    // Check if blog exists and is published
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogId },
      select: { published: true, views: true }
    })
    
    if (!blogPost || !blogPost.published) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      )
    }

    // If already viewed from this IP, return current views without incrementing
    const existing = await prisma.blogView.findFirst({
      where: { blogId, ipAddress: ip }
    })

    if (existing) {
      const current = await prisma.blogPost.findUnique({ where: { id: blogId }, select: { id: true, views: true } })
      return NextResponse.json({ success: true, data: current })
    }

    // Record view and increment counter atomically (best-effort)
    await prisma.blogView.create({ data: { blogId, ipAddress: ip, userAgent } })
    const updated = await prisma.blogPost.update({
      where: { id: blogId },
      data: { views: { increment: 1 } },
      select: { id: true, views: true }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Error incrementing blog views:", error)
    return NextResponse.json(
      { success: false, error: "Failed to increment views" },
      { status: 500 }
    )
  }
}


