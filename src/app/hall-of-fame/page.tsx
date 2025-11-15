"use client"

import { useState, useEffect, useCallback } from "react"
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
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const fetchProjects = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true)
        setProjects([])
      } else {
        setLoadingMore(true)
      }

      // Build query params
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '6'
      })
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }

      const response = await fetch(`/api/projects?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        if (reset) {
          setProjects(data.data)
        } else {
          setProjects(prev => [...prev, ...data.data])
        }
        setHasMore(data.pagination?.hasMore || false)
        setPage(pageNum)
        // Update total count from DB (for placeholder)
        if (data.pagination?.totalCount !== undefined) {
          setTotalCount(data.pagination.totalCount)
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchTerm, selectedCategory])

  const loadMoreProjects = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchProjects(page + 1, false)
    }
  }, [loadingMore, hasMore, page, fetchProjects])

  useEffect(() => {
    fetchProjects(1, true)
  }, [fetchProjects])

  useEffect(() => {
    // Reset to page 1 when category or search changes
    setPage(1)
    setHasMore(true)
    fetchProjects(1, true)
  }, [selectedCategory, searchTerm, fetchProjects])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Calculate scroll percentage
      const totalScrollableHeight = documentHeight - windowHeight
      const scrolledHeight = scrollTop
      const scrollPercentage = totalScrollableHeight > 0 ? scrolledHeight / totalScrollableHeight : 0

      // Load more when user has scrolled 80% (20% remaining to bottom)
      if (scrollPercentage >= 0.8) {
        loadMoreProjects()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore, loadMoreProjects])

  const categories = ["all", "Web", "Mobile", "IoT", "AI", "Blockchain", "Other"]

  // Projects are already filtered by the API, no need for client-side filtering
  const filteredProjects = projects

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
                    placeholder={loading ? "Search projects..." : `Search from ${totalCount} project${totalCount !== 1 ? 's' : ''}...`}
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
            {loading ? (
              // Show skeleton only in projects area when loading
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={`loading-skeleton-${index}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-pulse"
                  >
                    {/* Image Skeleton */}
                    <div className="h-40 bg-gray-200"></div>
                    
                    {/* Content Skeleton */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      
                      {/* Tech Stack Skeleton */}
                      <div className="flex gap-2 mb-3">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                      </div>
                      
                      {/* Stats Skeleton */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-4">
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      
                      {/* Button Skeleton */}
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
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
              <>
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
                  
                  {/* Loading More Skeleton Cards - Only show when loading more pages, not during search */}
                  {loadingMore && !loading && (
                    <>
                      {[...Array(6)].map((_, index) => (
                        <div
                          key={`skeleton-${index}`}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-pulse"
                        >
                          {/* Image Skeleton */}
                          <div className="h-40 bg-gray-200"></div>
                          
                          {/* Content Skeleton */}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
                              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                            
                            {/* Tech Stack Skeleton */}
                            <div className="flex gap-2 mb-3">
                              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                              <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                            </div>
                            
                            {/* Stats Skeleton */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex gap-4">
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                              </div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                            
                            {/* Button Skeleton */}
                            <div className="h-10 bg-gray-200 rounded-lg"></div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}

            {/* End of Results */}
            {!hasMore && filteredProjects.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No more projects to load</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default HallOfFamePage