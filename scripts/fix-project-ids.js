const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixProjectIds() {
  try {
    console.log('Fixing projectId fields in likes and views...')
    
    // Fix likes with null projectId
    const likesWithNullProjectId = await prisma.like.findMany({
      where: {
        projectId: null
      }
    })
    
    console.log(`Found ${likesWithNullProjectId.length} likes with null projectId`)
    
    for (const like of likesWithNullProjectId) {
      console.log(`Deleting like with null projectId: ${like.id}`)
      await prisma.like.delete({
        where: { id: like.id }
      })
    }
    
    // Fix views with null projectId
    const viewsWithNullProjectId = await prisma.view.findMany({
      where: {
        projectId: null
      }
    })
    
    console.log(`Found ${viewsWithNullProjectId.length} views with null projectId`)
    
    for (const view of viewsWithNullProjectId) {
      console.log(`Deleting view with null projectId: ${view.id}`)
      await prisma.view.delete({
        where: { id: view.id }
      })
    }
    
    console.log('ProjectId fields fixed successfully!')
  } catch (error) {
    console.error('Error fixing projectId fields:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixProjectIds()
