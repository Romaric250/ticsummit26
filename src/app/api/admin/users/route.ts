import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET all users with search support
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("search") || ""

    // Build where clause for search
    const where = searchQuery
      ? {
          OR: [
            { email: { contains: searchQuery, mode: "insensitive" as const } },
            { name: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to first 20 results
    })

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// PATCH update user role
export async function PATCH(request: NextRequest) {
  let userId: string | undefined
  let role: string | undefined
  
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    userId = body.userId
    role = body.role

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "Missing userId or role" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ["STUDENT", "MENTOR", "VOLUNTEER", "ADMIN"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      )
    }

    // Prevent removing admin role from yourself
    if (userId === session.user.id && role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Cannot remove admin role from yourself" },
        { status: 400 }
      )
    }

    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    })

    if (!existingUser) {
      console.error(`User not found with ID: ${userId} (type: ${typeof userId})`)
      
      // Debug: Try to find any user to see what IDs look like
      const sampleUser = await prisma.user.findFirst({
        select: { id: true, email: true },
      })
      if (sampleUser) {
        console.error(`Sample user ID format: ${sampleUser.id} (type: ${typeof sampleUser.id})`)
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: `User not found with ID: ${userId}`,
          debug: {
            userId,
            userIdType: typeof userId,
            sampleUserId: sampleUser?.id
          }
        },
        { status: 404 }
      )
    }

    // Use the existing user's ID to ensure we have the correct format
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: role as "STUDENT" | "MENTOR" | "VOLUNTEER" | "ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (error: any) {
    console.error("Error updating user role:", error)
    console.error("User ID attempted:", userId)
    console.error("Role attempted:", role)
    
    // If it's a Prisma error about record not found, provide more context
    if (error?.code === "P2025") {
      console.error("P2025 Error - Record not found")
      console.error("Attempted userId:", userId)
      
      // Try to find what users exist
      try {
        const allUsers = await prisma.user.findMany({
          select: { id: true, email: true },
          take: 5,
        })
        console.error("Sample user IDs in database:", allUsers.map(u => ({ id: u.id, email: u.email })))
      } catch (e) {
        console.error("Could not fetch sample users:", e)
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: `User not found with ID: ${userId}. The user may have been deleted or the ID format is incorrect.` 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update user role" },
      { status: 500 }
    )
  }
}

