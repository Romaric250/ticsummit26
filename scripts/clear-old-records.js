const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearOldRecords() {
  try {
    console.log('Clearing old likes and views records...')
    
    // Delete all existing likes (they have postId instead of projectId)
    const deletedLikes = await prisma.like.deleteMany({})
    console.log(`Deleted ${deletedLikes.count} likes`)
    
    // Delete all existing views (they have postId instead of projectId)
    const deletedViews = await prisma.view.deleteMany({})
    console.log(`Deleted ${deletedViews.count} views`)
    
    console.log('Old records cleared successfully!')
  } catch (error) {
    console.error('Error clearing old records:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearOldRecords()
