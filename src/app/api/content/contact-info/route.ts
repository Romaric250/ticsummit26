import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: contactInfo || {
        address: "Yaoundé, Cameroon",
        email: "info@ticsummit.org",
        phone: "+237 XXX XXX XXX"
      }
    })
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact info" },
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
    const { address, email, phone } = body

    if (!address || !email) {
      return NextResponse.json(
        { success: false, error: "Address and email are required" },
        { status: 400 }
      )
    }

    // Get existing contact info or create new one
    const existing = await prisma.contactInfo.findFirst()

    let contactInfoData
    if (existing) {
      contactInfoData = await prisma.contactInfo.update({
        where: { id: existing.id },
        data: {
          address,
          email,
          phone: phone || null
        }
      })
    } else {
      contactInfoData = await prisma.contactInfo.create({
        data: {
          address,
          email,
          phone: phone || null
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: contactInfoData
    })
  } catch (error) {
    console.error("Error saving contact info:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save contact info" },
      { status: 500 }
    )
  }
}

