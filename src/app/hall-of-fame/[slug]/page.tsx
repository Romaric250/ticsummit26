"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
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
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ImageSlider } from "@/components/ui/ImageSlider"
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
      await fetch(`/api/projects/views?projectId=${projectId}`, {
        method: 'POST'
      })
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
        setLiked(data.data.liked)
        setLikesCount(data.data.likes)
      } else if (data.error === "Authentication required") {
        // Redirect to sign in
        window.location.href = '/auth/signin'
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading project...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-2xl mb-4">Project Not Found</h1>
            <Link href="/hall-of-fame">
              <Button className="bg-gray-600 hover:bg-gray-700 text-white">
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
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section with Project Header */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link href="/hall-of-fame">
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Hall of Fame
                </Button>
              </Link>
            </motion.div>

            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  {project.status.replace('_', ' ')}
                </span>
                {project.year && (
                  <span className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded-full">
                    {project.year}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {project.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                {project.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 text-gray-400">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-lg font-medium">{viewsCount.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className={`w-5 h-5 ${liked ? 'text-red-500' : ''}`} />
                  <span className="text-lg font-medium">{likesCount.toLocaleString()} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  <span className="text-lg font-medium">{project.category}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3 space-y-8"
            >
              {/* Image Slider */}
              <div className="bg-gray-800 rounded-xl p-6">
                <ImageSlider images={project.images} title={project.title} />
              </div>

              {/* Project Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800 rounded-xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">About This Project</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
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
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`w-full py-3 text-lg font-medium transition-all duration-200 ${
                      liked 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                    {isLiking ? 'Processing...' : liked ? 'Liked' : 'Like Project'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full py-3 text-lg font-medium border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Project
                  </Button>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Project Details</h3>
                <div className="space-y-4">
                  {/* Team Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members
                    </h4>
                    <div className="space-y-2">
                      {project.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {member.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-300 text-sm">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Phase */}
                  {project.phase && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Project Phase</h4>
                      <p className="text-gray-300 text-sm">{project.phase}</p>
                    </div>
                  )}

                  {/* Year */}
                  {project.year && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Year</h4>
                      <p className="text-gray-300 text-sm">{project.year}</p>
                    </div>
                  )}

                  {/* Demo URL */}
                  {project.demoUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Demo</h4>
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Live Demo
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Projects */}
              {similarProjects.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Similar Projects</h3>
                  <div className="space-y-4">
                    {similarProjects.map((similarProject) => (
                      <motion.div
                        key={similarProject.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer group"
                        onClick={() => {
                          if (similarProject.slug) {
                            window.location.href = `/hall-of-fame/${similarProject.slug}`
                          }
                        }}
                      >
                        {/* Project Image */}
                        <div className="relative h-24 bg-gray-600 rounded-lg mb-3 overflow-hidden">
                          {similarProject.images && similarProject.images.length > 0 ? (
                            <img
                              src={similarProject.images[0]}
                              alt={similarProject.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Award className="w-8 h-8 text-gray-500" />
                            </div>
                          )}
                        </div>

                        {/* Project Info */}
                        <h4 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors">
                          {similarProject.title}
                        </h4>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{similarProject.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{similarProject.likes}</span>
                            </div>
                          </div>
                          <span className="text-gray-500">{similarProject.category}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default ProjectDetailPage