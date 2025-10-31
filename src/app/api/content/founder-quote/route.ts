import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const quote = await prisma.founderQuote.findFirst({
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: quote || null
    })
  } catch (error) {
    console.error("Error fetching founder quote:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch founder quote" },
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
    const { initial, name, title, quote, imageUrl } = body

    if (!initial || !name || !title || !quote) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Get existing quote or create new one
    const existing = await prisma.founderQuote.findFirst()
    
    let quoteData
    if (existing) {
      quoteData = await prisma.founderQuote.update({
        where: { id: existing.id },
        data: { initial, name, title, quote, imageUrl: imageUrl || null }
      })
    } else {
      quoteData = await prisma.founderQuote.create({
        data: { initial, name, title, quote, imageUrl: imageUrl || null }
      })
    }

    return NextResponse.json({
      success: true,
      data: quoteData
    })
  } catch (error) {
    console.error("Error saving founder quote:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save founder quote" },
      { status: 500 }
    )
  }
}

