import { Metadata } from "next"
import { PrismaClient } from "@prisma/client"
import { generateMetadata as generateSEO } from "@/lib/seo"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findFirst({
    where: { slug },
  })

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  const projectImage = project.images && project.images.length > 0 
    ? (typeof project.images[0] === 'string' ? project.images[0] : project.images[0]) 
    : undefined

  // Extract member names for searchability
  const members = (project.members || []) as string[]
  const memberNames = members.flatMap(member => {
    const nameParts = member.trim().split(/\s+/)
    return [
      member, // Full name
      nameParts[0] || member, // First name
      nameParts[nameParts.length - 1] || member, // Last name
    ]
  })

  // Extract key terms from description
  const descriptionWords = (project.description || '').toLowerCase().match(/\b\w{4,}\b/g) || []
  const topDescriptionWords = [...new Set(descriptionWords)].slice(0, 10)

  // Create comprehensive description with project name and members
  const memberList = members.length > 0 ? ` by ${members.join(', ')}` : ''
  const description = project.description 
    ? `${project.title}${memberList}. ${project.description.substring(0, 120)}...`
    : `${project.title}${memberList} - An innovative project from TIC Summit's Hall of Fame. Explore this ${project.category} project built with ${(project.techStack || []).slice(0, 3).join(', ')}.`

  // Comprehensive keywords including project name, members, tech stack, etc.
  const keywords = [
    project.title, // Full project title
    ...project.title.toLowerCase().split(/\s+/).filter(w => w.length > 3), // Title words
    ...memberNames, // All member names and variations
    ...members.map(m => `${m} project`), // "John Doe project"
    ...members.map(m => `project by ${m}`), // "project by John Doe"
    ...(project.techStack || []), // Tech stack
    ...(project.techStack || []).map(tech => `${project.title} ${tech}`), // "ProjectName React"
    project.category,
    `${project.title} ${project.category}`, // "ProjectName Mobile App"
    ...topDescriptionWords, // Key terms from description
    "TIC Summit",
    "TIC Summit project",
    `${project.title} TIC Summit`,
    "hall of fame",
    "student project",
    "innovation",
    "Cameroon",
    "Cameroon tech project",
  ]

  return generateSEO({
    title: `${project.title} - TIC Summit Hall of Fame`,
    description,
    keywords,
    url: `https://ticsummit.org/hall-of-fame/${project.slug}`,
    type: "article",
    image: projectImage,
  })
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

