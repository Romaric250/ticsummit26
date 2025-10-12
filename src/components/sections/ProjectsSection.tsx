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

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
    <motion.div
      variants={itemVariants}
      className="group relative"
    >
      <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-700">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
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
          <div className={`w-full h-full bg-gray-700 flex items-center justify-center ${project.images && project.images.length > 0 ? 'hidden' : ''}`}>
            <div className="text-center text-gray-400">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs font-medium">No Image</p>
            </div>
          </div>
          
          {/* Year Badge */}
          {project.year && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                {project.year}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-white line-clamp-2 flex-1 group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
              project.status === "WINNER" ? "bg-yellow-600 text-yellow-100" :
              project.status === "FINALIST" ? "bg-blue-600 text-blue-100" :
              project.status === "APPROVED" ? "bg-green-600 text-green-100" :
              "bg-gray-600 text-gray-100"
            }`}>
              {project.status.replace("_", " ")}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 2 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                +{project.techStack.length - 2}
              </span>
            )}
          </div>

          {/* Members */}
          <div className="flex items-center space-x-2 mb-3">
            <User className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {project.members.slice(0, 2).map((member, index) => (
                <span key={index} className="text-gray-400 text-sm">
                  {member}
                  {index < Math.min(project.members.length, 2) - 1 && ", "}
                </span>
              ))}
              {project.members.length > 2 && (
                <span className="text-gray-400 text-sm">
                  +{project.members.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
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
          <div className="flex space-x-2">
            {project.slug ? (
              <Link href={`/hall-of-fame/${project.slug}`}>
                <Button className="flex-1 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            ) : (
              <Button className="flex-1 bg-gray-600 text-gray-300 text-sm font-medium" disabled>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Category */}
          <div className="mt-3 text-right">
            <span className="text-gray-500 text-sm">{project.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
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
            <span className="text-sm font-medium">Featured Projects</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Innovation Solutions
            <span className="block text-blue-900">
              Empowering the Next
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
              <div key={i} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="h-48 bg-gray-700 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-5 bg-gray-700 animate-pulse rounded w-3/4"></div>
                    <div className="h-6 bg-gray-700 animate-pulse rounded-full w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-700 animate-pulse rounded w-full"></div>
                  <div className="h-4 bg-gray-700 animate-pulse rounded w-2/3"></div>
                  <div className="flex gap-1">
                    <div className="h-6 bg-gray-700 animate-pulse rounded-full w-12"></div>
                    <div className="h-6 bg-gray-700 animate-pulse rounded-full w-16"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-700 animate-pulse rounded w-20"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-700 animate-pulse rounded w-8"></div>
                      <div className="h-4 bg-gray-700 animate-pulse rounded w-8"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-700 animate-pulse rounded flex-1"></div>
                    <div className="h-10 bg-gray-700 animate-pulse rounded w-10"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-700 animate-pulse rounded w-16 ml-auto"></div>
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
              className="bg-blue-900 hover:bg-blue-800 text-white"
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
              <ProjectCard key={project.id} project={project} index={index} />
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
              className="inline-flex items-center space-x-3 bg-white rounded-xl px-6 py-3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Hall of Fame
                </h3>
                <p className="text-gray-600 text-xs">
                  Explore all amazing projects
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
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Ready to Showcase Your Innovation?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join the next TIC Summit and be part of the innovation revolution. 
              Submit your project ideas and compete for amazing prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white group" size="lg">
                Submit Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/hall-of-fame">
                <Button variant="outline" size="lg" className="border-blue-900 text-blue-900 hover:bg-blue-50">
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