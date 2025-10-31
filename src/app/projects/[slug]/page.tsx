"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  ExternalLink,
  Calendar,
  User,
  Award,
  ArrowLeft,
  Tag,
  ThumbsUp,
  Reply,
  Send,
  Bookmark,
  Flag
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    school: string
  }
  content: string
  likes: number
  replies: number
  timestamp: string
  isLiked: boolean
}

interface Project {
  id: string
  title: string
  description: string
  fullDescription: string
  image: string
  tags: string[]
  year: number
  likes: number
  comments: number
  views: number
  author: {
    name: string
    avatar: string
    school: string
    bio: string
  }
  slug: string
  category: string
  githubUrl?: string
  demoUrl?: string
  videoUrl?: string
  similarProjects: string[]
}

const ProjectDetailPage = () => {
  const params = useParams()
  const slug = params.slug as string
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  // Mock project data - in real app, fetch by slug
  const project: Project = {
    id: "1",
    title: "Smart Agriculture System",
    description: "An IoT-based solution that monitors soil moisture, temperature, and humidity to optimize crop yields for local farmers.",
    fullDescription: `The Smart Agriculture System is a comprehensive IoT solution designed to revolutionize farming practices in Cameroon. This innovative project combines cutting-edge sensor technology with machine learning algorithms to provide real-time monitoring and optimization of agricultural conditions.

The system consists of multiple sensor nodes strategically placed throughout the farm, each equipped with soil moisture sensors, temperature and humidity monitors, and pH level detectors. These sensors continuously collect data and transmit it wirelessly to a central processing unit.

Using advanced machine learning algorithms, the system analyzes the collected data to provide farmers with actionable insights. It can predict optimal planting times, suggest irrigation schedules, and identify potential pest or disease outbreaks before they become critical.

The user interface is designed to be intuitive and accessible, with both web and mobile applications that allow farmers to monitor their crops remotely. The system also includes automated irrigation controls and can send alerts via SMS or push notifications when immediate attention is required.

This project has the potential to significantly increase crop yields while reducing water usage and minimizing the need for chemical pesticides, making it both economically and environmentally beneficial for Cameroonian farmers.`,
    image: "/api/placeholder/800/600",
    tags: ["IoT", "Agriculture", "Arduino", "Sensors", "Machine Learning", "Python", "React", "Node.js"],
    year: 2023,
    likes: 127,
    comments: 23,
    views: 1250,
    author: {
      name: "Marie Nguema",
      avatar: "/api/placeholder/60/60",
      school: "University of Yaoundé I",
      bio: "Computer Science student passionate about IoT and sustainable agriculture. Winner of the 2023 TIC Summit Innovation Award."
    },
    slug: "smart-agriculture-system",
    category: "IoT",
    githubUrl: "https://github.com/marienguema/smart-agriculture",
    demoUrl: "https://smart-agriculture-demo.com",
    videoUrl: "https://youtube.com/watch?v=demo"
  }

  const similarProjects = [
    {
      id: "2",
      title: "Precision Farming App",
      slug: "precision-farming-app",
      image: "/api/placeholder/300/200",
      category: "IoT"
    },
    {
      id: "3",
      title: "Crop Disease Detection",
      slug: "crop-disease-detection",
      image: "/api/placeholder/300/200",
      category: "AI"
    },
    {
      id: "4",
      title: "Weather Monitoring System",
      slug: "weather-monitoring-system",
      image: "/api/placeholder/300/200",
      category: "IoT"
    }
  ]

  const comments: Comment[] = [
    {
      id: "1",
      author: {
        name: "Dr. Jean Nkeng",
        avatar: "/api/placeholder/40/40",
        school: "University of Buea"
      },
      content: "This is an excellent project! The integration of IoT sensors with machine learning for agricultural optimization is very innovative. I'm particularly impressed by the real-time monitoring capabilities.",
      likes: 12,
      replies: 3,
      timestamp: "2 hours ago",
      isLiked: false
    },
    {
      id: "2",
      author: {
        name: "Sarah Tchoumi",
        avatar: "/api/placeholder/40/40",
        school: "Douala Institute of Technology"
      },
      content: "Amazing work! How did you handle the data transmission in remote areas with limited internet connectivity?",
      likes: 8,
      replies: 1,
      timestamp: "4 hours ago",
      isLiked: true
    },
    {
      id: "3",
      author: {
        name: "Paul Nguema",
        avatar: "/api/placeholder/40/40",
        school: "ENSP Yaoundé"
      },
      content: "The user interface looks very clean and intuitive. What technologies did you use for the mobile app?",
      likes: 5,
      replies: 0,
      timestamp: "6 hours ago",
      isLiked: false
    }
  ]

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      // In real app, submit comment to API
      console.log("New comment:", newComment)
      setNewComment("")
    }
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
            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-5xl font-bold">P{project.id}</span>
                  </div>
                  <p className="text-lg font-medium">Project Image</p>
                </div>
              </div>
            </motion.div>

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

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Full Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                  {project.fullDescription}
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Comments ({project.comments})
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setShowComments(!showComments)}
                >
                  {showComments ? "Hide" : "Show"} Comments
                </Button>
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this project..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button type="submit" disabled={!newComment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              {showComments && (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                            <span className="text-sm text-gray-500">{comment.author.school}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center space-x-1 text-sm ${
                                comment.isLiked ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{comment.likes}</span>
                            </motion.button>
                            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600">
                              <Reply className="w-4 h-4" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{project.author.name}</h4>
                  <p className="text-sm text-gray-500">{project.author.school}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{project.author.bio}</p>
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
                  <span className="font-semibold text-gray-900">{project.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Comments</span>
                  </div>
                  <span className="font-semibold text-gray-900">{project.comments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Views</span>
                  </div>
                  <span className="font-semibold text-gray-900">{project.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Year</span>
                  </div>
                  <span className="font-semibold text-gray-900">{project.year}</span>
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
                  <span>{isLiked ? "Liked" : "Like"} ({project.likes})</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Project</span>
                </motion.button>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View on GitHub</span>
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              <div className="space-y-4">
                {similarProjects.map((similarProject) => (
                  <Link
                    key={similarProject.id}
                    href={`/projects/${similarProject.slug}`}
                    className="block group"
                  >
                    <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-gray-600">P{similarProject.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {similarProject.title}
                        </h4>
                        <p className="text-sm text-gray-500">{similarProject.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default ProjectDetailPage
