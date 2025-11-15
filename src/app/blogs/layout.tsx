import { Metadata } from "next"
import { generateMetadata as generateSEO } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Blogs - TIC Summit",
  description: "Read the latest articles, insights, and stories from TIC Summit. Learn about tech innovation, student success stories, and tips for young innovators in Cameroon.",
  keywords: [
    "TIC Summit",
    "blog",
    "articles",
    "tech news",
    "innovation",
    "education",
    "Cameroon",
    "student stories",
    "tech tips",
  ],
  url: "https://ticsummit.org/blogs",
})

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

