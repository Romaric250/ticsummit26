"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Image from "next/image"
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  ExternalLink, 
  Share2, 
  Heart,
  MessageCircle,
  Star,
  Award,
  Code,
  Users,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ImageSlider } from "@/components/ui/ImageSlider"
import { ProjectDetailSkeleton } from "@/components/ui/ProjectSkeleton"
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
  phase?: string
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

interface SimilarProject {
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
  author: {
    id: string
    name: string
    image?: string
  }
}

const ProjectDetailPage = () => {
  const params = useParams()
  const slug = params.slug as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [similarProjects, setSimilarProjects] = useState<SimilarProject[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchProject()
    }
  }, [slug])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects?slug=${slug}`)
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        const projectData = data.data[0]
        setProject(projectData)
        setLikesCount(projectData.likes || 0)
        setViewsCount(projectData.views || 0)
        
        // Increment views
        await incrementViews(projectData.id)
        
        // Fetch similar projects
        await fetchSimilarProjects(projectData.id, projectData.category)
        
        // Check if user liked this project (if authenticated)
        await checkLikeStatus(projectData.id)
      } else {
        setError("Project not found")
      }
    } catch (err) {
      console.error("Error fetching project:", err)
      setError("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const incrementViews = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/views?projectId=${projectId}`, {
        method: 'POST'
      })
      const data = await response.json()
      if (data.success) {
        console.log('Views incremented successfully:', data.data.views)
        setViewsCount(data.data.views)
      } else {
        console.error('Views increment failed:', data.error)
      }
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  }

  const fetchSimilarProjects = async (projectId: string, category: string) => {
    try {
      const response = await fetch(`/api/projects/similar?projectId=${projectId}&category=${category}&limit=3`)
      const data = await response.json()
      
      if (data.success) {
        setSimilarProjects(data.data)
      }
    } catch (error) {
      console.error("Error fetching similar projects:", error)
    }
  }

  const checkLikeStatus = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/likes?projectId=${projectId}`)
      const data = await response.json()
      
      if (data.success) {
        setLiked(data.data.liked)
        setLikesCount(data.data.likes)
      }
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleLike = async () => {
    if (!project) return
    
    setIsLiking(true)
    try {
      const response = await fetch('/api/projects/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId: project.id })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('Like toggled successfully:', data.data)
        setLiked(data.data.liked)
        setLikesCount(data.data.likes)
      } else if (data.error === "Authentication required") {
        console.log('Authentication required, redirecting...')
        // Redirect to sign in
        window.location.href = '/auth/signin'
      } else {
        console.error('Like toggle failed:', data.error)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const nextImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WINNER":
        return "bg-yellow-600 text-yellow-100"
      case "FINALIST":
        return "bg-purple-600 text-purple-100"
      case "APPROVED":
        return "bg-green-600 text-green-100"
      case "UNDER_REVIEW":
        return "bg-gray-600 text-gray-100"
      case "REJECTED":
        return "bg-red-600 text-red-100"
      default:
        return "bg-gray-600 text-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "WINNER":
        return <Award className="w-4 h-4" />
      case "FINALIST":
        return <Star className="w-4 h-4" />
      default:
        return <Code className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <Layout>
        <ProjectDetailSkeleton />
      </Layout>
    )
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-gray-900 text-2xl mb-4">Project Not Found</h1>
            <Link href="/hall-of-fame">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hall of Fame
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/hall-of-fame" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Hall of Fame</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3 space-y-8"
            >
              {/* Project Title */}
              <div className="space-y-4">
                {/* Status Badges */}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status.replace('_', ' ')}
                  </span>
                  {project.year && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-900 text-sm font-medium rounded-full">
                      {project.year}
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {project.title}
                </h1>
                
              {/* About Project */}
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About Project</h2>
              
              {/* Project Description */}
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.description}
              </p>
              </div>

              {/* Project Stats */}
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{project.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{project.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{project.category}</span>
                </div>
              </div>


              {/* Image Slider */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              >
                <ImageSlider images={project.images} title={project.title} />
              </motion.div>

              {/* Demo Section */}
              {project.demoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="bg-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Demo Available</h3>
                      <p className="text-gray-600 text-sm">Experience this project in action</p>
                    </div>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View Live Demo
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Details</h3>
                <div className="space-y-6">
                  {/* Team Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members
                    </h4>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      {project.members.map((member, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 min-w-[100px]">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-gray-900' : 'bg-gray-700'
                          }`}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-center">
                            <span className="text-gray-900 text-sm font-medium block">{member}</span>
                            <p className="text-gray-600 text-xs mt-0.5">
                              {index === 0 ? 'Lead Developer' : 'Team Member'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Phase */}
                    {project.phase && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Project Phase</h4>
                        <p className="text-gray-900 text-base font-medium">{project.phase}</p>
                      </div>
                    )}

                    {/* Year */}
                    {project.year && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Year</h4>
                        <p className="text-gray-900 text-base font-medium">{project.year}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Action Buttons */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">ACTIONS</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`w-full py-2 text-sm font-medium transition-all duration-200 ${
                      liked 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    {isLiking ? 'Processing...' : liked ? 'Liked' : 'Like Project'}
                  </Button>

                  <Button
                    onClick={() => setShowShareModal(true)}
                    variant="outline"
                    className="w-full py-2 text-sm font-medium bg-white border-gray-300 text-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-600"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Project
                  </Button>
                </div>
              </div>

              {/* Similar Projects */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">SIMILAR PROJECTS</h3>
                
                {similarProjects.length > 0 ? (
                  <div className="space-y-3">
                    {similarProjects.slice(0, 3).map((similarProject) => (
                      <motion.div
                        key={similarProject.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer group border border-gray-200"
                        onClick={() => {
                          if (similarProject.slug) {
                            window.location.href = `/hall-of-fame/${similarProject.slug}`
                          }
                        }}
                      >
                        {/* Project Image */}
                        <div className="relative h-20 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                          {similarProject.images && similarProject.images.length > 0 ? (
                            <Image
                              src={similarProject.images[0]}
                              alt={similarProject.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Award className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Project Info */}
                        <div className="space-y-1">
                          <h4 className="text-gray-900 font-medium text-sm line-clamp-1 group-hover:text-gray-600 transition-colors">
                            {similarProject.title}
                          </h4>
                          {similarProject.year && (
                            <p className="text-gray-600 text-xs">
                              {similarProject.year}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse border border-gray-200">
                        <div className="h-20 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* View All Button */}
                <Link href="/hall-of-fame">
                  <Button
                    variant="outline"
                    className="w-full mt-4 py-2 text-sm border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    View All Projects
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Project</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/hall-of-fame/${project?.slug}`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/hall-of-fame/${project?.slug}`)
                    }}
                    className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/hall-of-fame/${project?.slug}`
                    window.open(`https://twitter.com/intent/tweet?text=Check out this amazing project: ${project?.title}&url=${encodeURIComponent(url)}`, '_blank')
                  }}
                  className="py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/hall-of-fame/${project?.slug}`
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                  }}
                  className="py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white"
                >
                  LinkedIn
                </Button>
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/hall-of-fame/${project?.slug}`
                    const text = `Check out this amazing project: ${project?.title}`
                    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank')
                  }}
                  className="py-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                >
                  WhatsApp
                </Button>
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/hall-of-fame/${project?.slug}`
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
                  }}
                  className="py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Facebook
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  )
}

export default ProjectDetailPage