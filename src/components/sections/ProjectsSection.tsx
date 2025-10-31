"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ExternalLink, 
  Github, 
  Calendar, 
  User,
  ArrowRight,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Award,
  Share2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ProjectCardSkeleton } from "@/components/ui/ProjectSkeleton"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  images: string[]
  techStack: string[]
  members: string[]
  category: string
  status: string
  slug?: string
  year?: number
  demoUrl?: string
  views: number
  likes: number
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects/featured")
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.data)
      } else {
        setError("Failed to load projects")
      }
    } catch (err) {
      console.error("Error fetching featured projects:", err)
      setError("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

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
      },
    },
  }

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const cardContent = (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
          {project.images && project.images.length > 0 ? (
            <img
              src={project.images[Math.floor(Math.random() * project.images.length)]}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                console.log("Image failed to load:", target.src)
                target.style.display = 'none'
                const nextElement = target.nextElementSibling as HTMLElement
                if (nextElement) {
                  nextElement.style.display = 'flex'
                }
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${project.images && project.images.length > 0 ? 'hidden' : ''}`}>
            <div className="text-center text-gray-400">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs font-medium">No Image</p>
            </div>
          </div>
          
          {/* Year Badge */}
          {project.year && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                {project.year}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 group-hover:text-gray-700 transition-colors">
              {project.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
              project.status === "WINNER" ? "bg-yellow-500 text-white" :
              project.status === "FINALIST" ? "bg-blue-500 text-white" :
              project.status === "APPROVED" ? "bg-green-500 text-white" :
              "bg-gray-300 text-gray-700"
            }`}>
              {project.status.replace("_", " ")}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-shrink-0">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1 mb-3 flex-shrink-0">
            {project.techStack.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{project.techStack.length - 2}
              </span>
            )}
          </div>

          {/* Members */}
          <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
            <User className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {project.members.slice(0, 2).map((member, index) => (
                <span key={index} className="text-gray-600 text-sm">
                  {member}
                  {index < Math.min(project.members.length, 2) - 1 && ", "}
                </span>
              ))}
              {project.members.length > 2 && (
                <span className="text-gray-600 text-sm">
                  +{project.members.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{project.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{project.likes || 0}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 mt-auto">
            {project.slug ? (
              <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            ) : (
              <Button className="flex-1 bg-gray-300 text-gray-600 text-sm font-medium" disabled>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Share functionality can be added here
              }}
              className="bg-white hover:bg-gray-200 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 transition-colors flex items-center justify-center"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Category */}
          <div className="mt-3 text-right flex-shrink-0">
            <span className="text-gray-500 text-sm">{project.category}</span>
          </div>
        </div>
      </div>
    )

    if (project.slug) {
      return (
        <motion.div
          variants={itemVariants}
          className="group relative h-full"
        >
          <Link href={`/hall-of-fame/${project.slug}`} className="block h-full">
            {cardContent}
          </Link>
        </motion.div>
      )
    }

    return (
      <motion.div
        variants={itemVariants}
        className="group relative h-full"
      >
        {cardContent}
      </motion.div>
    )
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">

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
            className="inline-flex items-center space-x-2 bg-gray-100 text-gray-900 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Featured Projects</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Hall of Fame
            <span className="block text-gray-700">
              Celebrating Innovation
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Discover the incredible projects created by our talented students during 
            the TIC Summit. Each project represents innovation, creativity, and the 
            potential to transform our communities.
          </motion.p>
        </motion.div>

        {/* Featured Projects Grid - Show 4 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-1">
                    <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded w-10"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Award className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Failed to load projects</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <Button 
              onClick={fetchFeaturedProjects}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Award className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">No projects found</p>
              <p className="text-sm text-gray-600">No featured projects available at the moment</p>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12"
          >
            {projects.map((project, index) => (
              <div key={project.id} className="h-full">
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </motion.div>
        )}

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
              className="inline-flex items-center space-x-3 bg-gray-50 rounded-xl px-6 py-3 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                  Hall of Fame
                </h3>
                <p className="text-gray-600 text-xs">
                  Explore all amazing projects
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300" />
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
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Ready to Showcase Your Innovation?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join the next TIC Summit and be part of the innovation revolution. 
              Submit your project ideas and compete for amazing prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white group" size="lg">
                Submit Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/hall-of-fame">
                <Button variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:bg-gray-50">
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection