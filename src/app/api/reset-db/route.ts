import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Delete all records in the correct order to avoid foreign key constraints
    console.log("Starting database reset...")
    
    // Delete all custom application data first
    await prisma.application.deleteMany({})
    console.log("✓ Deleted all applications")
    
    await prisma.project.deleteMany({})
    console.log("✓ Deleted all projects")
    
    await prisma.like.deleteMany({})
    console.log("✓ Deleted all likes")
    
    await prisma.comment.deleteMany({})
    console.log("✓ Deleted all comments")
    
    await prisma.blogPost.deleteMany({})
    console.log("✓ Deleted all blog posts")
    
    await prisma.volunteerProfile.deleteMany({})
    console.log("✓ Deleted all volunteer profiles")
    
    await prisma.mentorProfile.deleteMany({})
    console.log("✓ Deleted all mentor profiles")
    
    // Delete all Better Auth related records
    await prisma.account.deleteMany({})
    console.log("✓ Deleted all accounts")
    
    await prisma.session.deleteMany({})
    console.log("✓ Deleted all sessions")
    
    await prisma.verification.deleteMany({})
    console.log("✓ Deleted all verification tokens")
    
    // Finally delete all users
    const userResult = await prisma.user.deleteMany({})
    console.log(`✓ Deleted ${userResult.count} users`)
    
    console.log("🎉 Database reset completed successfully!")
    
    return Response.json({
      success: true,
      message: "Database has been completely reset",
      deletedCounts: {
        users: userResult.count,
        accounts: "all",
        sessions: "all", 
        verification: "all",
        mentorProfiles: "all",
        volunteerProfiles: "all",
        blogPosts: "all",
        comments: "all",
        likes: "all",
        projects: "all",
        applications: "all"
      }
    })
  } catch (error) {
    console.error("❌ Error resetting database:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}
