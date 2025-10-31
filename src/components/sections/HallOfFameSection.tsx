'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Users, 
  Calendar, 
  ExternalLink, 
  Github, 
  Award,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react'
import { Achievement } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

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

export default function HallOfFameSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [achievements] = useState<Achievement[]>([]) // Empty for now - can be fetched from API later

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique years from projects
  const years = Array.from(new Set(projects.filter(p => p.year).map(p => p.year!))).sort((a, b) => b - a)
  
  // Build categories dynamically
  const categories = [
    { id: 'all', label: 'All Projects', count: projects.length },
    ...years.map(year => ({
      id: year.toString(),
      label: year.toString(),
      count: projects.filter(p => p.year === year).length
    }))
  ]

  const filteredProjects = projects.filter(project => {
    if (selectedCategory === 'all') return true
    return project.year?.toString() === selectedCategory
  })

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Trophy,
      Star,
      Users,
      Award,
      Target,
      Zap
    }
    return icons[iconName] || Star
  }

  return (
    <section id="hall-of-fame" className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Hall of <span className="bg-gradient-to-r from-primary-200 to-white bg-clip-text text-transparent">Fame</span>
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Celebrating the incredible projects, achievements, and innovations 
            created by our community of talented developers and entrepreneurs.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { label: 'Projects Built', value: '50+', icon: 'Target' },
            { label: 'Awards Won', value: '25+', icon: 'Trophy' },
            { label: 'Participants', value: '500+', icon: 'Users' },
            { label: 'Years Active', value: '4+', icon: 'Calendar' }
          ].map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon)
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <IconComponent className="h-8 w-8 text-primary-200 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-primary-200">{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-white text-primary-800 shadow-lg'
                    : 'text-primary-100 hover:text-white hover:bg-white/20'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

          {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-48 bg-white/20" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/20 rounded w-3/4" />
                  <div className="h-4 bg-white/20 rounded w-full" />
                  <div className="h-4 bg-white/20 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={project.slug ? `/hall-of-fame/${project.slug}` : '#'}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="h-full"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-48">
                        {project.images && project.images.length > 0 ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/20 flex items-center justify-center">
                            <Award className="h-12 w-12 text-white/50" />
                          </div>
                        )}
                        {project.year && (
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                              {project.year}
                            </span>
                          </div>
                        )}
                        {project.status === 'WINNER' && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Winner
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-200 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-primary-100 mb-4 line-clamp-3 flex-1">{project.description}</p>

                        {project.techStack && project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.techStack.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="text-primary-200 text-xs">
                                +{project.techStack.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto">
                          {project.members && project.members.length > 0 && (
                            <div className="flex items-center space-x-2 text-primary-200">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{project.members.length} contributors</span>
                            </div>
                          )}
                          <ExternalLink className="h-5 w-5 text-primary-200 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-primary-200 py-12">
                No projects found
              </div>
            )}
          </motion.div>
        )}

        {/* Achievements Section - Only show if there are achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-12">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => {
                const IconComponent = getIconComponent(achievement.icon)
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-600 rounded-lg p-3">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {achievement.title}
                        </h4>
                        <p className="text-primary-100 text-sm mb-2">
                          {achievement.description}
                        </p>
                        <span className="text-primary-200 text-xs font-medium">
                          {achievement.year}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-800 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Submit Your Project
          </motion.button>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {selectedProject.images && selectedProject.images.length > 0 ? (
                  <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={selectedProject.images[0]}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-xl mb-6 flex items-center justify-center">
                    <Award className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedProject.title}
                    </h2>
                    <p className="text-gray-600 text-lg">{selectedProject.description}</p>
                  </div>
                  {selectedProject.year && (
                    <div className="text-right">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedProject.year}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProject.members && selectedProject.members.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Contributors</h3>
                      <div className="space-y-2">
                        {selectedProject.members.map((member, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{member}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedProject.demoUrl && (
                  <div className="flex space-x-4">
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors duration-300"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>View Demo</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
