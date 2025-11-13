import { MetadataRoute } from 'next'
import { PrismaClient, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

// Site URL - Set via NEXT_PUBLIC_SITE_URL environment variable
// Update .env or Vercel environment variables when changing domains
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticsummit.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basePages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/mentors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ambassadors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/alumni`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/hall-of-fame`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/schedule26`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/techgirls-mentorship`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Fetch blog posts
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    blogPages = blogs.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  // Fetch mentors
  let mentorPages: MetadataRoute.Sitemap = []
  try {
    const mentors = await prisma.mentorProfile.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    mentorPages = mentors.map((mentor) => ({
      url: `${SITE_URL}/mentors/${mentor.slug}`,
      lastModified: mentor.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching mentors for sitemap:', error)
  }

  // Fetch ambassadors
  let ambassadorPages: MetadataRoute.Sitemap = []
  try {
    const ambassadors = await prisma.ambassadorProfile.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    ambassadorPages = ambassadors.map((ambassador) => ({
      url: `${SITE_URL}/ambassadors/${ambassador.slug}`,
      lastModified: ambassador.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching ambassadors for sitemap:', error)
  }

  // Fetch alumni
  let alumniPages: MetadataRoute.Sitemap = []
  try {
    const alumni = await prisma.alumniProfile.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    alumniPages = alumni.map((alumni) => ({
      url: `${SITE_URL}/alumni/${alumni.slug}`,
      lastModified: alumni.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching alumni for sitemap:', error)
  }

  // Fetch hall of fame projects
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const projects = await prisma.project.findMany({
      where: { 
        status: { in: [ProjectStatus.APPROVED, ProjectStatus.FINALIST, ProjectStatus.WINNER] },
        slug: { not: null }
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    projectPages = projects.map((project) => ({
      url: `${SITE_URL}/hall-of-fame/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  return [...basePages, ...blogPages, ...mentorPages, ...ambassadorPages, ...alumniPages, ...projectPages]
}

