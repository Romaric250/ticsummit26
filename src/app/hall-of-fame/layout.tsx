import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Hall of Fame",
  description: "Explore outstanding student projects from TIC Summit. Celebrating innovation, creativity, and the incredible achievements of young tech innovators from Cameroon.",
  keywords: [
    "TIC Summit",
    "hall of fame",
    "student projects",
    "innovation",
    "tech projects",
    "winners",
    "Cameroon",
    "student achievements",
  ],
  url: "https://ticsummit.org/hall-of-fame",
})

export default function HallOfFameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

