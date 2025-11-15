import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "About TIC Summit",
  description: "Learn about TIC Summit's mission to empower young innovators across Cameroon through technology, mentorship, and hands-on learning experiences. Discover our story, team, and impact.",
  keywords: [
    "TIC Summit",
    "about",
    "mission",
    "vision",
    "team",
    "Cameroon",
    "tech education",
    "innovation",
    "mentorship",
  ],
  url: "https://ticsummit.org/about",
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

