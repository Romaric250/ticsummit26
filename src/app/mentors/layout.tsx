import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Our Mentors",
  description: "Meet our expert mentors at TIC Summit. Industry professionals who guide and inspire young innovators, sharing their knowledge and experience to help students succeed in technology.",
  keywords: [
    "TIC Summit",
    "mentors",
    "mentorship",
    "tech mentors",
    "industry experts",
    "guidance",
    "Cameroon",
    "technology education",
  ],
  url: "https://ticsummit.org/mentors",
})

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

