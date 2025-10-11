const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkViews() {
  try {
    console.log('Checking views in database...')
    
    // Check all view records
    const views = await prisma.view.findMany({
      select: {
        id: true,
        projectId: true,
        ipAddress: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${views.length} view records:`)
    views.forEach(view => {
      console.log(`- View ID: ${view.id}, Project: ${view.projectId}, IP: ${view.ipAddress}, Date: ${view.createdAt}`)
    })
    
    // Check all projects and their view counts
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        views: true
      }
    })
    
    console.log(`\nProject view counts:`)
    projects.forEach(project => {
      console.log(`- ${project.title}: ${project.views} views`)
    })
    
  } catch (error) {
    console.error('Error checking views:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkViews()
