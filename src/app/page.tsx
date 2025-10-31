import Layout from "@/components/layout/Layout"
import HeroSection from "@/components/sections/HeroSection"
import PartnersSection from "@/components/sections/PartnersSection"
import AboutSection from "@/components/sections/AboutSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import FAQSection from "@/components/sections/FAQSection"

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <PartnersSection />
      <AboutSection />
      <ProjectsSection />
      <FAQSection />
    </Layout>
  )
}