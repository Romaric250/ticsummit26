import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // First delete all related records to avoid foreign key constraints
    await prisma.account.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.verification.deleteMany({})
    
    // Then delete all users
    const result = await prisma.user.deleteMany({})
    
    return Response.json({
      success: true,
      message: `Successfully deleted ${result.count} users and all related records from the database`,
      deletedCount: result.count
    })
  } catch (error) {
    console.error("Error deleting users:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}