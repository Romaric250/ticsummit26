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

  return generateSEO({
    title: `${alumni.name} - TIC Summit Alumni`,
    description: alumni.bio || `${alumni.name} is a TIC Summit alumnus who has gone on to achieve great things in technology.`,
    keywords: [
      "TIC Summit",
      "alumni",
      alumni.name,
      "success story",
      "Cameroon",
      "tech professional",
    ],
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

