import { Metadata } from "next"
import { PrismaClient } from "@prisma/client"
import { generateAmbassadorMetadata } from "@/lib/seo"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ambassador = await prisma.ambassadorProfile.findUnique({
    where: { slug },
  })

  if (!ambassador) {
    return {
      title: "Ambassador Not Found",
    }
  }

  return generateAmbassadorMetadata({
    name: ambassador.name,
    bio: ambassador.bio || undefined,
    school: ambassador.school,
    slug: ambassador.slug,
    image: ambassador.profileImage || undefined,
  })
}

export default function AmbassadorDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

