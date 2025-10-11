const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixLikesCount() {
  try {
    console.log('Fixing likes counts for all projects...')
    
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        likes: true
      }
    })
    
    console.log(`Found ${projects.length} projects`)
    
    for (const project of projects) {
      // Count actual likes in database
      const actualLikesCount = await prisma.like.count({
        where: { postId: project.id }
      })
      
      console.log(`Project "${project.title}": DB count=${project.likes}, Actual likes=${actualLikesCount}`)
      
      if (actualLikesCount !== project.likes) {
        console.log(`Fixing likes count for "${project.title}" from ${project.likes} to ${actualLikesCount}`)
        
        await prisma.project.update({
          where: { id: project.id },
          data: {
            likes: actualLikesCount
          }
        })
      }
    }
    
    console.log('Likes counts fixed successfully!')
  } catch (error) {
    console.error('Error fixing likes counts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixLikesCount()
