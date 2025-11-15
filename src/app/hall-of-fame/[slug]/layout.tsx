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

  return generateSEO({
    title: `${project.title} - Hall of Fame`,
    description: project.description || `Explore ${project.title}, an innovative project from TIC Summit's Hall of Fame.`,
    keywords: [
      "TIC Summit",
      "hall of fame",
      project.title,
      ...(project.techStack || []),
      project.category,
      "student project",
      "innovation",
      "Cameroon",
    ],
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

