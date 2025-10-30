import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { success: false, error: "Email already subscribed" },
          { status: 400 }
        )
      } else {
        // Re-activate subscription
        await prisma.newsletterSubscription.update({
          where: { email: email.toLowerCase() },
          data: { active: true }
        })
        return NextResponse.json({ success: true, message: "Successfully subscribed!" })
      }
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: {
        email: email.toLowerCase(),
        active: true
      }
    })

    return NextResponse.json({ success: true, message: "Successfully subscribed!" })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    )
  }
}

