"use client"

import { motion } from "framer-motion"
import { 
  ExternalLink, 
  Github, 
  Calendar, 
  User,
  ArrowRight,
  Star,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Project } from "@/types"
import Link from "next/link"

const ProjectsSection = () => {
  // Mock data - in a real app, this would come from an API
  const projects: Project[] = [
    {
      id: "1",
      title: "Smart Agriculture System",
      description: "An IoT-based solution that monitors soil moisture, temperature, and humidity to optimize crop yields for local farmers.",
      image: "/api/placeholder/400/300",
      tags: ["IoT", "Agriculture", "Arduino", "Sensors"],
      year: 2023
    },
    {
      id: "2", 
      title: "E-Learning Platform",
      description: "A comprehensive online learning platform designed specifically for Cameroonian students with offline capabilities.",
      image: "/api/placeholder/400/300",
      tags: ["Web Development", "Education", "React", "Node.js"],
      year: 2023
    },
    {
      id: "3",
      title: "Waste Management App",
      description: "Mobile application that connects citizens with waste collection services and promotes recycling initiatives.",
      image: "/api/placeholder/400/300",
      tags: ["Mobile App", "Environment", "Flutter", "Firebase"],
      year: 2023
    },
    {
      id: "4",
      title: "Health Monitoring Device",
      description: "Wearable device that tracks vital signs and sends alerts to healthcare providers in remote areas.",
      image: "/api/placeholder/400/300",
      tags: ["Hardware", "Healthcare", "Embedded Systems", "Bluetooth"],
      year: 2023
    },
    {
      id: "5",
      title: "Digital Marketplace",
      description: "Local marketplace platform connecting small businesses with customers across Cameroon.",
      image: "/api/placeholder/400/300",
      tags: ["E-commerce", "Business", "Vue.js", "MongoDB"],
      year: 2023
    },
    {
      id: "6",
      title: "Traffic Management System",
      description: "AI-powered traffic monitoring and optimization system for urban areas in Yaoundé.",
      image: "/api/placeholder/400/300",
      tags: ["AI/ML", "Urban Planning", "Python", "Computer Vision"],
      year: 2023
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
    <motion.div
      variants={itemVariants}
      className="group relative"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">P{index + 1}</span>
              </div>
              <p className="text-sm font-medium">Project Image</p>
            </div>
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">{project.year}</span>
            <div className="flex items-center space-x-1 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">3 days</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span>Student Team</span>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 rounded-full px-4 py-2 mb-6"
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Our Projects</span>
            </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Innovation Solutions
            <span className="block text-blue-900">
              Driving the Future
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the incredible projects created by our talented students during 
            the TIC Summit. Each project represents innovation, creativity, and the 
            potential to transform our communities.
          </motion.p>
        </motion.div>

        {/* Featured Projects Grid - Only 3 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Hall of Fame Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Link href="/hall-of-fame">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-3 bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Hall of Fame
                </h3>
                <p className="text-gray-600 text-sm">
                  Explore all {projects.length} amazing projects
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Showcase Your Innovation?
            </h3>
            <p className="text-gray-600 mb-6">
              Join the next TIC Summit and be part of the innovation revolution. 
              Submit your project ideas and compete for amazing prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white group" size="lg">
                Submit Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                View All Projects
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection
