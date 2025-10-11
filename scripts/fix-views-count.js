const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixViewsCount() {
  try {
    console.log('Fixing views counts for all projects...')
    
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        views: true
      }
    })
    
    console.log(`Found ${projects.length} projects`)
    
    for (const project of projects) {
      // Count actual views in database
      const actualViewsCount = await prisma.view.count({
        where: { postId: project.id }
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
    
    console.log('Views counts fixed successfully!')
  } catch (error) {
    console.error('Error fixing views counts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixViewsCount()
