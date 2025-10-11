const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixSlugs() {
  try {
    console.log('Fetching projects without slugs...')
    
    const projects = await prisma.project.findMany({
      where: {
        slug: null
      }
    })
    
    console.log(`Found ${projects.length} projects without slugs`)
    
    for (const project of projects) {
      const slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      console.log(`Updating project "${project.title}" with slug "${slug}"`)
      
      await prisma.project.update({
        where: { id: project.id },
        data: { slug }
      })
    }
    
    console.log('All slugs updated successfully!')
  } catch (error) {
    console.error('Error fixing slugs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSlugs()
