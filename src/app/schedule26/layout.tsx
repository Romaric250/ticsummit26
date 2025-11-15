import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Schedule26 - TIC Summit 2026 Timeline",
  description: "Stay updated with TIC Summit 2026 schedule and timeline. Track important dates, phases, and milestones of Cameroon's premier tech innovation program.",
  keywords: [
    "TIC Summit",
    "schedule",
    "timeline",
    "2026",
    "dates",
    "events",
    "Cameroon",
    "tech conference",
    "program schedule",
  ],
  url: "https://ticsummit.org/schedule26",
})

export default function Schedule26Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

