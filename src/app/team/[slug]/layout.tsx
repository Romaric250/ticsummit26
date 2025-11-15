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
  const teamMember = await prisma.teamMember.findFirst({
    where: { slug },
  })

  if (!teamMember) {
    return {
      title: "Team Member Not Found",
    }
  }

  return generateSEO({
    title: `${teamMember.name} - Team Member`,
    description: teamMember.bio || `${teamMember.name} is a member of the TIC Summit team, working to empower young innovators across Cameroon.`,
    keywords: [
      "TIC Summit",
      "team",
      teamMember.name,
      teamMember.role,
      "Cameroon",
      "tech education",
    ],
    url: `https://ticsummit.org/team/${teamMember.slug}`,
    type: "profile",
    image: teamMember.imageUrl || undefined,
  })
}

export default function TeamDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

