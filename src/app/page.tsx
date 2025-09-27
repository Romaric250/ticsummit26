import Layout from "@/components/layout/Layout"
import HeroSection from "@/components/sections/HeroSection"
import AboutSection from "@/components/sections/AboutSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ColorDemo from "@/components/ColorDemo"

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      
      {/* Color System Demo - Remove this section when you're done testing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ColorDemo />
        </div>
      </section>
    </Layout>
  )
}