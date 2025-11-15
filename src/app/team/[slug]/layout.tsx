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

  // Extract first and last name for better searchability
  const nameParts = teamMember.name.trim().split(/\s+/)
  const firstName = nameParts[0] || teamMember.name
  const lastName = nameParts[nameParts.length - 1] || teamMember.name

  // Create comprehensive description with name prominently featured
  const description = teamMember.bio 
    ? `${teamMember.name} - ${teamMember.bio.substring(0, 120)}...`
    : `${teamMember.name} is a ${teamMember.role} at TIC Summit, working to empower young innovators across Cameroon. Learn about ${teamMember.name}'s contributions to tech education and innovation.`

  // Comprehensive keywords including name variations
  const keywords = [
    teamMember.name, // Full name
    firstName, // First name
    lastName, // Last name
    `${firstName} ${lastName}`, // Full name again
    'TIC Summit',
    'TIC Summit team',
    `${teamMember.name} TIC Summit`,
    `${teamMember.name} team`,
    `team member ${teamMember.name}`,
    teamMember.role,
    `${teamMember.name} ${teamMember.role}`,
    `${teamMember.role} ${teamMember.name}`,
    'tech team',
    'innovation team',
    'Cameroon',
    'tech education',
    'TIC Summit staff',
  ]

  return generateSEO({
    title: `${teamMember.name} - TIC Summit Team`,
    description,
    keywords,
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

