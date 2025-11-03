"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Share2, 
  Eye, 
  Filter,
  Search,
  User,
  Award,
  ExternalLink,
  Heart
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
  // Removed unused sortBy state
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
      <div className="min-h-screen bg-gray-50">
        {/* Filters */}
        <section className="pt-24 pb-6 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={loading ? "Search projects..." : `Search from ${projects.length} project${projects.length !== 1 ? 's' : ''}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative sm:w-48">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white text-gray-900"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl cursor-pointer"
                    onClick={() => {
                      if (project.slug) {
                        window.location.href = `/hall-of-fame/${project.slug}`
                      }
                    }}
                  >
                    {/* Project Image */}
                    <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[Math.floor(Math.random() * project.images.length)]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Award className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">No Image</p>
                        </div>
                      )}
                      
                      {/* Year Badge */}
                      {project.year && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-white/90 text-gray-900 text-xs font-medium rounded-full">
                            {project.year}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                          project.status === "WINNER" ? "bg-yellow-100 text-yellow-800" :
                          project.status === "FINALIST" ? "bg-blue-100 text-blue-800" :
                          project.status === "APPROVED" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Members */}
                      <div className="flex items-center space-x-2 mb-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {project.members.slice(0, 3).map((member, index) => (
                            <span key={index} className="text-gray-600 text-sm">
                              {member}
                              {index < Math.min(project.members.length, 3) - 1 && ", "}
                            </span>
                          ))}
                          {project.members.length > 3 && (
                            <span className="text-gray-600 text-sm">
                              +{project.members.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Demo URL */}
                      {project.demoUrl && (
                        <div className="flex items-center space-x-2 mb-3">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Demo
                          </a>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{project.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
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
                              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                            disabled
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="bg-white border-gray-300 text-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer"
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