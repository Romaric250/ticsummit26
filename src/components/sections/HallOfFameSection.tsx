'use client'

import { useState } from 'react'
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
import { Project, Achievement } from '@/types'

const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Healthcare Platform',
    description: 'Revolutionary healthcare platform using machine learning to predict patient outcomes and optimize treatment plans.',
    image: '/api/placeholder/600/400',
    technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
    year: 2023,
    participants: ['Sarah Johnson', 'Michael Chen', 'Lisa Wang'],
    link: 'https://github.com/example/healthcare-ai',
    featured: true
  },
  {
    id: '2',
    title: 'Sustainable Energy Management System',
    description: 'Smart grid management system that optimizes energy distribution and reduces carbon footprint.',
    image: '/api/placeholder/600/400',
    technologies: ['IoT', 'Python', 'Docker', 'Kubernetes', 'MongoDB'],
    year: 2023,
    participants: ['David Kim', 'Emily Rodriguez', 'Alex Thompson'],
    link: 'https://github.com/example/energy-mgmt',
    featured: true
  },
  {
    id: '3',
    title: 'Blockchain Voting System',
    description: 'Secure and transparent voting system built on blockchain technology for enhanced election integrity.',
    image: '/api/placeholder/600/400',
    technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS'],
    year: 2022,
    participants: ['Michael Chen', 'Sarah Johnson'],
    link: 'https://github.com/example/blockchain-voting',
    featured: false
  },
  {
    id: '4',
    title: 'AR Shopping Experience',
    description: 'Augmented reality mobile app that allows users to visualize products in their space before purchasing.',
    image: '/api/placeholder/600/400',
    technologies: ['React Native', 'ARCore', 'Three.js', 'Node.js', 'MongoDB'],
    year: 2022,
    participants: ['Emily Rodriguez', 'David Kim'],
    link: 'https://github.com/example/ar-shopping',
    featured: false
  },
  {
    id: '5',
    title: 'Real-time Collaboration Tool',
    description: 'Advanced collaboration platform with real-time editing, video conferencing, and project management.',
    image: '/api/placeholder/600/400',
    technologies: ['WebRTC', 'Socket.io', 'React', 'Express', 'Redis'],
    year: 2021,
    participants: ['Alex Thompson', 'Lisa Wang', 'Michael Chen'],
    link: 'https://github.com/example/collab-tool',
    featured: false
  },
  {
    id: '6',
    title: 'Predictive Analytics Dashboard',
    description: 'Business intelligence dashboard that provides predictive insights and data visualization.',
    image: '/api/placeholder/600/400',
    technologies: ['D3.js', 'Python', 'Flask', 'PostgreSQL', 'Docker'],
    year: 2021,
    participants: ['Lisa Wang', 'Sarah Johnson'],
    link: 'https://github.com/example/analytics-dashboard',
    featured: false
  }
]

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Best Innovation Award',
    description: 'Recognized for groundbreaking AI healthcare platform',
    icon: 'Trophy',
    year: 2023,
    category: 'award'
  },
  {
    id: '2',
    title: '1000+ GitHub Stars',
    description: 'Open source project reached 1000+ stars on GitHub',
    icon: 'Star',
    year: 2023,
    category: 'milestone'
  },
  {
    id: '3',
    title: 'TechCrunch Feature',
    description: 'Featured in TechCrunch for innovative energy solution',
    icon: 'Award',
    year: 2023,
    category: 'recognition'
  },
  {
    id: '4',
    title: '500+ Active Users',
    description: 'Collaboration tool reached 500+ active users',
    icon: 'Users',
    year: 2022,
    category: 'milestone'
  },
  {
    id: '5',
    title: 'Patent Filed',
    description: 'Blockchain voting system patent application filed',
    icon: 'Target',
    year: 2022,
    category: 'recognition'
  },
  {
    id: '6',
    title: '50% Performance Boost',
    description: 'Achieved 50% performance improvement in analytics platform',
    icon: 'Zap',
    year: 2021,
    category: 'milestone'
  }
]

const years = [2023, 2022, 2021, 2020]
const categories = [
  { id: 'all', label: 'All Projects', count: projects.length },
  { id: 'featured', label: 'Featured', count: projects.filter(p => p.featured).length },
  { id: '2023', label: '2023', count: projects.filter(p => p.year === 2023).length },
  { id: '2022', label: '2022', count: projects.filter(p => p.year === 2022).length },
  { id: '2021', label: '2021', count: projects.filter(p => p.year === 2021).length }
]

export default function HallOfFameSection() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedYear, setSelectedYear] = useState(2023)

  const filteredProjects = projects.filter(project => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'featured') return project.featured
    return project.year.toString() === selectedCategory
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-200 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-primary-100 mb-4 line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-primary-200 text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-primary-200">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{project.participants.length} contributors</span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-primary-200 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
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
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedProject.title}
                    </h2>
                    <p className="text-gray-600 text-lg">{selectedProject.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedProject.year}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contributors</h3>
                    <div className="space-y-2">
                      {selectedProject.participants.map((participant) => (
                        <div key={participant} className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{participant}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedProject.link && (
                  <div className="flex space-x-4">
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors duration-300"
                    >
                      <Github className="h-5 w-5" />
                      <span>View on GitHub</span>
                    </a>
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>Visit Project</span>
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
