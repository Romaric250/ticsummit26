import Layout from "@/components/layout/Layout"
import HeroSection from "@/components/sections/HeroSection"
import PartnersSection from "@/components/sections/PartnersSection"
import AboutSection from "@/components/sections/AboutSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import FAQSection from "@/components/sections/FAQSection"
import { StructuredData } from "@/components/seo/StructuredData"
import { generateEventSchema } from "@/lib/seo"

export default function Home() {
  const eventSchema = generateEventSchema({
    name: "TIC Summit 2026",
    startDate: "2026-03-15T09:00:00+01:00",
    endDate: "2026-03-17T18:00:00+01:00",
    location: "Cameroon",
  })

  return (
    <>
      <StructuredData data={eventSchema} />
      <Layout>
        <HeroSection />
        <PartnersSection />
        <AboutSection />
        <ProjectsSection />
        <FAQSection />
      </Layout>
    </>
  )
}