import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Our Ambassadors",
  description: "Meet TIC Summit ambassadors - passionate students representing their schools and promoting tech innovation. Discover how they're making a difference in their communities.",
  keywords: [
    "TIC Summit",
    "ambassadors",
    "student ambassadors",
    "representatives",
    "schools",
    "Cameroon",
    "tech advocacy",
  ],
  url: "https://ticsummit.org/ambassadors",
})

export default function AmbassadorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

