"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Trophy,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  image?: string
  techStack: string[]
  category: string
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "FINALIST" | "WINNER"
  phase?: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    image?: string
  }
}

const HallOfFameAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)

  const categories = ["all", "Web", "Mobile", "IoT", "AI", "Blockchain", "Other"]
  const statuses = ["all", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "FINALIST", "WINNER"]

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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE"
      })
      const data = await response.json()
      if (data.success) {
        setProjects(projects.filter(project => project.id !== id))
        setDeleteProjectId(null)
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-gray-100 text-gray-800"
      case "UNDER_REVIEW": return "bg-yellow-100 text-yellow-800"
      case "APPROVED": return "bg-green-100 text-green-800"
      case "REJECTED": return "bg-red-100 text-red-800"
      case "FINALIST": return "bg-blue-100 text-blue-800"
      case "WINNER": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Hall of Fame Management
            </h1>
            <p className="text-gray-400">
              Manage student projects and achievements
            </p>
          </div>
          <Link href="/admin/hall-of-fame/new">
            <Button className="bg-white hover:bg-white text-gray-900 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
                <p className="text-gray-400 text-sm">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === "WINNER").length}
                </p>
                <p className="text-gray-400 text-sm">Winners</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === "APPROVED").length}
                </p>
                <p className="text-gray-400 text-sm">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === "UNDER_REVIEW").length}
                </p>
                <p className="text-gray-400 text-sm">Under Review</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === "all" ? "All Statuses" : status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
            >
              {/* Project Image */}
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-500" />
                )}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
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

                {/* Author */}
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    {project.author.name}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link href={`/admin/hall-of-fame/${project.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-white hover:bg-white text-gray-900 cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                    onClick={() => setDeleteProjectId(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setDeleteProjectId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Delete Project
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  className="flex-1 bg-white hover:bg-white text-gray-900 cursor-pointer"
                  onClick={() => setDeleteProjectId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  onClick={() => handleDelete(deleteProjectId)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HallOfFameAdmin
