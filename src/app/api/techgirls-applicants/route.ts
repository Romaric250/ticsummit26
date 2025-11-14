import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST - Create a new applicant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, age, phone, school, currentGrade, message } = body

    // Validate required fields
    if (!name || !email || !age || !phone || !school || !currentGrade) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      )
    }

    // Create applicant
    const applicant = await prisma.techGirlsApplicant.create({
      data: {
        name,
        email,
        age,
        phone,
        school,
        currentGrade,
        message: message || null,
        status: "PENDING"
      }
    })

    return NextResponse.json({
      success: true,
      data: applicant
    })
  } catch (error: any) {
    console.error("Error creating applicant:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application" },
      { status: 500 }
    )
  }
}

// GET - Fetch all applicants (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {}
    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    const applicants = await prisma.techGirlsApplicant.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      data: applicants
    })
  } catch (error: any) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch applicants" },
      { status: 500 }
    )
  }
}

