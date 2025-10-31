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
  Star,
  X,
  Award,
  Code,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"

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
      setLoading(true)
      const response = await fetch("/api/projects")
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
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
        toast.success("Project deleted successfully")
      } else {
        toast.error("Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
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
      case "SUBMITTED": return "bg-gray-100 text-gray-800 border-gray-200"
      case "UNDER_REVIEW": return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "APPROVED": return "bg-green-50 text-green-800 border-green-200"
      case "REJECTED": return "bg-red-50 text-red-800 border-red-200"
      case "FINALIST": return "bg-blue-50 text-blue-800 border-blue-200"
      case "WINNER": return "bg-purple-50 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Web": "bg-blue-100 text-blue-800",
      "Mobile": "bg-indigo-100 text-indigo-800",
      "IoT": "bg-green-100 text-green-800",
      "AI": "bg-purple-100 text-purple-800",
      "Blockchain": "bg-orange-100 text-orange-800",
      "Other": "bg-gray-100 text-gray-800"
    }
    return colors[category] || colors["Other"]
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 relative pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-6 animate-pulse">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 relative pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hall of Fame Management</h1>
                <p className="text-gray-600 mt-1">Manage student projects and achievements</p>
              </div>
              <Link href="/admin/hall-of-fame/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  Add Project
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">Total Projects</p>
                    <p className="text-2xl font-bold text-yellow-900">{projects.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Winners</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {projects.filter(p => p.status === "WINNER").length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Approved</p>
                    <p className="text-2xl font-bold text-green-900">
                      {projects.filter(p => p.status === "APPROVED").length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Under Review</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {projects.filter(p => p.status === "UNDER_REVIEW").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white min-w-[180px] text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white min-w-[180px] text-gray-900"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Statuses" : status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {projects.length === 0 ? "No projects yet" : "No projects found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? "Get started by adding your first project." 
                    : "Try adjusting your search criteria."}
                </p>
                {projects.length === 0 && (
                  <Link href="/admin/hall-of-fame/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Project
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Project Image */}
                      {project.image ? (
                        <div className="flex-shrink-0 relative group">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary transition-colors"
                          />
                          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-lg transition-colors"></div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {project.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {project.description}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusColor(project.status)}`}>
                            {project.status === "WINNER" && <Trophy className="w-3 h-3 inline mr-1" />}
                            {project.status === "FINALIST" && <Star className="w-3 h-3 inline mr-1" />}
                            {project.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{project.author.name}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(project.category)}`}>
                            {project.category}
                          </span>
                        </div>

                        {/* Tech Stack */}
                        {project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 items-center">
                            <Code className="w-4 h-4 text-gray-400" />
                            {project.techStack.slice(0, 4).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-200">
                                +{project.techStack.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`/hall-of-fame/${project.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </motion.button>
                        </Link>
                        <Link href={`/admin/hall-of-fame/${project.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteProjectId(project.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteProjectId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteProjectId(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
                  <button
                    onClick={() => setDeleteProjectId(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {projects.find(p => p.id === deleteProjectId)?.title}
                      </p>
                      <p className="text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete this project? All associated data will be permanently removed.
                  </p>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setDeleteProjectId(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDelete(deleteProjectId)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default HallOfFameAdmin
