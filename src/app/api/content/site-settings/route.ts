import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: settings || {
        showTeamSection: true
      }
    })
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch site settings" },
      { status: 500 }
    )
  }
}

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
    const { showTeamSection } = body

    // Get existing settings or create new one
    const existing = await prisma.siteSettings.findFirst()
    
    let settingsData
    if (existing) {
      settingsData = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { showTeamSection: showTeamSection !== undefined ? showTeamSection : true }
      })
    } else {
      settingsData = await prisma.siteSettings.create({
        data: { showTeamSection: showTeamSection !== undefined ? showTeamSection : true }
      })
    }

    return NextResponse.json({
      success: true,
      data: settingsData
    })
  } catch (error) {
    console.error("Error saving site settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save site settings" },
      { status: 500 }
    )
  }
}

