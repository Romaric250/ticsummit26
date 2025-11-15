import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Our Team",
  description: "Meet the dedicated TIC Summit team working to empower young innovators across Cameroon. Passionate individuals committed to fostering technology education and innovation.",
  keywords: [
    "TIC Summit",
    "team",
    "staff",
    "volunteers",
    "organizers",
    "Cameroon",
    "tech education",
    "innovation",
  ],
  url: "https://ticsummit.org/team",
})

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

