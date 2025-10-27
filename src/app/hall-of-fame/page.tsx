"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  ExternalLink,
  Filter,
  Search,
  Calendar,
  User,
  Award,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { HallOfFameSkeleton } from "@/components/ui/ProjectSkeleton"
import Link from "next/link"
import Layout from "@/components/layout/Layout"

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

const HallOfFamePage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", "Web", "Mobile", "IoT", "AI", "Blockchain", "Other"]

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <Layout>
        <HallOfFameSkeleton count={6} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="relative pt-16 pb-8 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Hall of Fame
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Celebrating innovative projects from TIC Summit
              </p>
            </motion.div>
            
            {/* Compact Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{projects.length}</span>
                <span className="text-gray-400">Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === "WINNER").length}
                </span>
                <span className="text-gray-400">Winners</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === "FINALIST").length}
                </span>
                <span className="text-gray-400">Finalists</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {new Set(projects.map(p => p.category)).size}
                </span>
                <span className="text-gray-400">Categories</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-between"
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl cursor-pointer hover:scale-105"
                    onClick={() => {
                      if (project.slug) {
                        window.location.href = `/hall-of-fame/${project.slug}`
                      }
                    }}
                  >
                    {/* Project Image */}
                    <div className="relative h-36 bg-gray-700 flex items-center justify-center">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[Math.floor(Math.random() * project.images.length)]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <Award className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">No Image</p>
                        </div>
                      )}
                      
                      {/* Year Badge */}
                      {project.year && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                            {project.year}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-semibold text-white line-clamp-2 flex-1">
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          project.status === "WINNER" ? "bg-yellow-100 text-yellow-800" :
                          project.status === "FINALIST" ? "bg-blue-100 text-blue-800" :
                          project.status === "APPROVED" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Members */}
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {project.members.slice(0, 3).map((member, index) => (
                            <span key={index} className="text-gray-400 text-sm">
                              {member}
                              {index < Math.min(project.members.length, 3) - 1 && ", "}
                            </span>
                          ))}
                          {project.members.length > 3 && (
                            <span className="text-gray-400 text-sm">
                              +{project.members.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Demo URL */}
                      {project.demoUrl && (
                        <div className="flex items-center space-x-2 mb-2">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 text-sm hover:text-gray-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Demo
                          </a>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
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
                        <span className="text-gray-500">{project.category}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        {project.slug ? (
                          <Link href={`/hall-of-fame/${project.slug}`}>
                            <Button
                              className="flex-1 bg-white hover:bg-white text-gray-900 cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            className="flex-1 bg-white hover:bg-white text-gray-900 cursor-pointer"
                            disabled
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default HallOfFamePage