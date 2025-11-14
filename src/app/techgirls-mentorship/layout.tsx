import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticsummit.org'

export const metadata: Metadata = generateSEO({
  title: "TechGirls Mentorship Program - Empowering Young Girls in Technology",
  description: "Join the TechGirls Mentorship Program for girls aged 15-17. Explore technology opportunities, build leadership skills, and prepare for the fully funded U.S. Department of State TechGirls Program. Empowering the next generation of female tech leaders.",
  keywords: [
    "TechGirls",
    "mentorship program",
    "girls in technology",
    "tech education for girls",
    "women in tech",
    "girls coding",
    "technology mentorship",
    "leadership development",
    "tech career preparation",
    "U.S. Department of State",
    "TechGirls Program",
    "girls STEM",
    "technology opportunities",
    "youth mentorship",
    "Cameroon tech education"
  ],
  url: `${SITE_URL}/techgirls-mentorship`,
  type: "website",
  image: `${SITE_URL}/techgirls-mentorship-og.jpg`, // You can add a specific OG image later
})

export default function TechGirlsMentorshipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

