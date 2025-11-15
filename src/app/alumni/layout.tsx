import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "TIC Summit Alumni",
  description: "Meet TIC Summit alumni who have gone on to achieve great things in technology. Discover their journeys and how TIC Summit helped shape their careers.",
  keywords: [
    "TIC Summit",
    "alumni",
    "graduates",
    "success stories",
    "career",
    "technology",
    "Cameroon",
    "tech professionals",
  ],
  url: "https://ticsummit.org/alumni",
})

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

