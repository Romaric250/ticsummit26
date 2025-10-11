const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixViewCounts() {
  try {
    console.log('Fixing view counts for all projects...')
    
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        views: true
      }
    })
    
    for (const project of projects) {
      // Count actual views in database
      const actualViewsCount = await prisma.view.count({
        where: { projectId: project.id }
      })
      
      console.log(`Project "${project.title}": DB count=${project.views}, Actual views=${actualViewsCount}`)
      
      if (actualViewsCount !== project.views) {
        console.log(`Fixing views count for "${project.title}" from ${project.views} to ${actualViewsCount}`)
        
        await prisma.project.update({
          where: { id: project.id },
          data: {
            views: actualViewsCount
          }
        })
      }
    }
    
    console.log('View counts fixed successfully!')
  } catch (error) {
    console.error('Error fixing view counts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixViewCounts()
