import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const impact = await prisma.tICImpact.findFirst({
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: impact || {
        studentsInspired: 1000,
        teenagersTrained: 5000,
        prizeAwardsFCFA: 2.0,
        ticClubsEstablished: 25,
        subtitle: "in 4 Years",
        description: "Transforming lives and building the future of tech in Cameroon"
      }
    })
  } catch (error) {
    console.error("Error fetching TIC impact:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch TIC impact" },
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
    const { studentsInspired, teenagersTrained, prizeAwardsFCFA, ticClubsEstablished, subtitle, description } = body

    if (!studentsInspired || !teenagersTrained || !prizeAwardsFCFA || !ticClubsEstablished) {
      return NextResponse.json(
        { success: false, error: "All numeric fields are required" },
        { status: 400 }
      )
    }

    // Get existing impact or create new one
    const existing = await prisma.tICImpact.findFirst()
    
    let impactData
    if (existing) {
      impactData = await prisma.tICImpact.update({
        where: { id: existing.id },
        data: { 
          studentsInspired, 
          teenagersTrained, 
          prizeAwardsFCFA: parseFloat(prizeAwardsFCFA.toString()), 
          ticClubsEstablished,
          subtitle: subtitle || null,
          description: description || null
        }
      })
    } else {
      impactData = await prisma.tICImpact.create({
        data: { 
          studentsInspired, 
          teenagersTrained, 
          prizeAwardsFCFA: parseFloat(prizeAwardsFCFA.toString()), 
          ticClubsEstablished,
          subtitle: subtitle || null,
          description: description || null
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: impactData
    })
  } catch (error) {
    console.error("Error saving TIC impact:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save TIC impact" },
      { status: 500 }
    )
  }
}

