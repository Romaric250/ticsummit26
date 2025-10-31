import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: faqs
    })
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
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
    const { faqs } = body

    if (!Array.isArray(faqs)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Delete all existing FAQs
    await prisma.fAQ.deleteMany({})

    // Create new FAQs
    const created = await prisma.fAQ.createMany({
      data: faqs.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        active: faq.active !== false
      }))
    })

    return NextResponse.json({
      success: true,
      data: created
    })
  } catch (error) {
    console.error("Error saving FAQs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save FAQs" },
      { status: 500 }
    )
  }
}

