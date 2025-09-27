"use client"

import { useState } from "react"
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
import Link from "next/link"
import Layout from "@/components/layout/Layout"

interface Project {
  id: string
  title: string
  description: string
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
  }
  slug: string
  category: string
}

const HallOfFamePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const projects: Project[] = [
    {
      id: "1",
      title: "Smart Agriculture System",
      description: "An IoT-based solution that monitors soil moisture, temperature, and humidity to optimize crop yields for local farmers. This innovative system uses sensors and machine learning to provide real-time recommendations.",
      image: "/api/placeholder/600/400",
      tags: ["IoT", "Agriculture", "Arduino", "Sensors", "Machine Learning"],
      year: 2023,
      likes: 127,
      comments: 23,
      views: 1250,
      author: {
        name: "Marie Nguema",
        avatar: "/api/placeholder/40/40",
        school: "University of Yaoundé I"
      },
      slug: "smart-agriculture-system",
      category: "IoT",
    },
    {
      id: "2", 
      title: "E-Learning Platform",
      description: "A comprehensive online learning platform designed specifically for Cameroonian students with offline capabilities. Features include video lessons, quizzes, and progress tracking.",
      image: "/api/placeholder/600/400",
      tags: ["Web Development", "Education", "React", "Node.js", "PWA"],
      year: 2023,
      likes: 89,
      comments: 15,
      views: 980,
      author: {
        name: "David Mballa",
        avatar: "/api/placeholder/40/40",
        school: "ENSP Yaoundé"
      },
      slug: "e-learning-platform",
      category: "Web",
    },
    {
      id: "3",
      title: "Waste Management App",
      description: "Mobile application that connects citizens with waste collection services and promotes recycling initiatives. Features GPS tracking and reward system.",
      image: "/api/placeholder/600/400",
      tags: ["Mobile App", "Environment", "Flutter", "Firebase", "GPS"],
      year: 2023,
      likes: 156,
      comments: 31,
      views: 2100,
      author: {
        name: "Sarah Tchoumi",
        avatar: "/api/placeholder/40/40",
        school: "Douala Institute of Technology"
      },
      slug: "waste-management-app",
      category: "Mobile",
    },
    {
      id: "4",
      title: "Health Monitoring Device",
      description: "Wearable device that tracks vital signs and sends alerts to healthcare providers in remote areas. Includes heart rate, blood pressure, and temperature monitoring.",
      image: "/api/placeholder/600/400",
      tags: ["Hardware", "Healthcare", "Embedded Systems", "Bluetooth", "Sensors"],
      year: 2023,
      likes: 78,
      comments: 12,
      views: 650,
      author: {
        name: "Dr. Jean Nkeng",
        avatar: "/api/placeholder/40/40",
        school: "University of Buea"
      },
      slug: "health-monitoring-device",
      category: "Hardware",
    },
    {
      id: "5",
      title: "Digital Marketplace",
      description: "Local marketplace platform connecting small businesses with customers across Cameroon. Features include payment integration and delivery tracking.",
      image: "/api/placeholder/600/400",
      tags: ["E-commerce", "Business", "Vue.js", "MongoDB", "Payment"],
      year: 2023,
      likes: 92,
      comments: 18,
      views: 890,
      author: {
        name: "Grace Mvogo",
        avatar: "/api/placeholder/40/40",
        school: "University of Dschang"
      },
      slug: "digital-marketplace",
      category: "Web",
    },
    {
      id: "6",
      title: "Traffic Management System",
      description: "AI-powered traffic monitoring and optimization system for urban areas in Yaoundé. Uses computer vision and machine learning for real-time traffic analysis.",
      image: "/api/placeholder/600/400",
      tags: ["AI/ML", "Urban Planning", "Python", "Computer Vision", "OpenCV"],
      year: 2023,
      likes: 134,
      comments: 27,
      views: 1750,
      author: {
        name: "Paul Nguema",
        avatar: "/api/placeholder/40/40",
        school: "ENSP Yaoundé"
      },
      slug: "traffic-management-system",
      category: "AI",
    }
  ]

  const categories = ["all", "IoT", "Web", "Mobile", "Hardware", "AI"]

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold">P{project.id}</span>
            </div>
            <p className="text-sm font-medium">Project Image</p>
          </div>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.button>
          </div>
        </div>


      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{project.author.name}</p>
            <p className="text-sm text-gray-500">{project.author.school}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{project.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{project.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{project.views}</span>
            </div>
          </div>
          <span className="text-gray-400">{project.year}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link href={`/projects/${project.slug}`}>
            <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
              View Details
            </Button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Filters */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="likes">Most Liked</option>
                <option value="recent">Most Recent</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
      </div>
    </Layout>
  )
}

export default HallOfFamePage
