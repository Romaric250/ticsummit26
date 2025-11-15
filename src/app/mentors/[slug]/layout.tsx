import { Metadata } from "next"
import { PrismaClient } from "@prisma/client"
import { generateMentorMetadata } from "@/lib/seo"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const mentor = await prisma.mentorProfile.findUnique({
    where: { slug },
  })

  if (!mentor) {
    return {
      title: "Mentor Not Found",
    }
  }

  return generateMentorMetadata({
    name: mentor.name,
    bio: mentor.bio || undefined,
    expertise: mentor.specialties,
    slug: mentor.slug,
    image: mentor.profileImage || undefined,
  })
}

export default function MentorDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

