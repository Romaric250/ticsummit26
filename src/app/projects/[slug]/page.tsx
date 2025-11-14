"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { useSession, signIn } from "@/lib/auth-client"
import { 
  Heart, 
  Share2, 
  Eye, 
  ExternalLink,
  Calendar,
  User,
  Award,
  ArrowLeft,
  Tag,
  Bookmark,
  Flag
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { ProjectDetailSkeleton } from "@/components/ui/ProjectSkeleton"
import Image from "next/image"
import { ShareModal } from "@/components/ui/ShareModal"

interface Project {
  id: string
  title: string
  description: string
  images: string[]
  techStack: string[]
  members: string[]
  category: string
  status: string
  phase?: string
  year?: number
  demoUrl?: string
  views: number
  likes: number
  slug?: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
}

interface SimilarProject {
  id: string
  title: string
  description: string
  images: string[]
  slug?: string
  category: string
  views: number
  likes: number
}

const ProjectDetailPage = () => {
  const params = useParams()
  const slug = params.slug as string
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [similarProjects, setSimilarProjects] = useState<SimilarProject[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchProject()
    }
  }, [slug])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
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
        
        // Check like status (no auth required)
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
        setViewsCount(data.data.views)
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
        setIsLiked(data.data.liked)
        setLikesCount(data.data.likes)
      }
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleLike = async () => {
    if (!project) return

    try {
      setIsLiking(true)
      const response = await fetch('/api/projects/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      })
      const data = await response.json()
      
      if (data.success) {
        setIsLiked(data.data.liked)
        setLikesCount(data.data.likes)
      } else {
        console.error("Error toggling like:", data.error)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    setShowShareModal(true)
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
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
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/hall-of-fame">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Hall of Fame</span>
                </Button>
              </Link>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Flag className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Images */}
            {project.images && project.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={project.images[currentImageIndex]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {project.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {project.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {project.description}
              </p>

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-4">Project Author</h3>
              <div className="flex items-center space-x-4">
                {project.author.image ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={project.author.image}
                      alt={project.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{project.author.name}</h4>
                </div>
              </div>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-4">Project Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Likes</span>
                  </div>
                  <span className="font-semibold text-gray-900">{likesCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Views</span>
                  </div>
                  <span className="font-semibold text-gray-900">{viewsCount}</span>
                </div>
                {project.year && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700">Year</span>
                    </div>
                    <span className="font-semibold text-gray-900">{project.year}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Category</span>
                  </div>
                  <span className="font-semibold text-gray-900">{project.category}</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLike}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                    isLiked 
                      ? "bg-red-100 text-red-600 border border-red-200" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span>{isLiked ? "Liked" : "Like"} ({likesCount})</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Project</span>
                </motion.button>

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Similar Projects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-4">Similar Projects</h3>
              {similarProjects.length > 0 ? (
                <div className="space-y-4">
                  {similarProjects.map((similarProject) => (
                    <Link
                      key={similarProject.id}
                      href={similarProject.slug ? `/hall-of-fame/${similarProject.slug}` : '#'}
                      className="block group"
                    >
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        {similarProject.images && similarProject.images.length > 0 ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={similarProject.images[0]}
                              alt={similarProject.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors truncate">
                            {similarProject.title}
                          </h4>
                          <p className="text-sm text-gray-500">{similarProject.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No similar projects found</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      </div>
      {showShareModal && project && (
        <ShareModal
          isOpen={showShareModal}
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title={project.title}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </Layout>
  )
}

export default ProjectDetailPage
