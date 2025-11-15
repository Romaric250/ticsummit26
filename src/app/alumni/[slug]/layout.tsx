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
  const alumni = await prisma.alumniProfile.findUnique({
    where: { slug },
  })

  if (!alumni) {
    return {
      title: "Alumni Not Found",
    }
  }

  // Extract first and last name for better searchability
  const nameParts = alumni.name.trim().split(/\s+/)
  const firstName = nameParts[0] || alumni.name
  const lastName = nameParts[nameParts.length - 1] || alumni.name

  // Create comprehensive description with name prominently featured
  const description = alumni.bio 
    ? `${alumni.name} - ${alumni.bio.substring(0, 120)}...`
    : `${alumni.name} is a TIC Summit alumnus who has gone on to achieve great things in technology. Discover ${alumni.name}'s journey and success story after participating in TIC Summit.`

  // Comprehensive keywords including name variations
  const keywords = [
    alumni.name, // Full name
    firstName, // First name
    lastName, // Last name
    `${firstName} ${lastName}`, // Full name again
    'TIC Summit',
    'TIC Summit alumni',
    `${alumni.name} TIC Summit`,
    `${alumni.name} alumni`,
    `alumni ${alumni.name}`,
    `${alumni.name} success story`,
    'success story',
    'tech professional',
    'Cameroon',
    'Cameroon tech',
    'tech graduate',
    'innovation graduate',
    'TIC Summit graduate',
  ]

  return generateSEO({
    title: `${alumni.name} - TIC Summit Alumni`,
    description,
    keywords,
    url: `https://ticsummit.org/alumni/${alumni.slug}`,
    type: "profile",
    image: alumni.profileImage || undefined,
  })
}

export default function AlumniDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

