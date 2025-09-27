'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Twitter, Linkedin, Github, ExternalLink } from 'lucide-react'
import { Speaker } from '@/types'

const speakers: Speaker[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'CTO',
    company: 'TechCorp',
    bio: 'Leading innovation in AI and machine learning with over 15 years of experience in building scalable systems.',
    image: '/api/placeholder/400/400',
    social: {
      twitter: '@sarahj',
      linkedin: 'sarah-johnson',
      github: 'sarahj'
    },
    topics: ['AI', 'Machine Learning', 'Leadership'],
    featured: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Principal Engineer',
    company: 'InnovateLab',
    bio: 'Expert in distributed systems and cloud architecture, passionate about building resilient applications.',
    image: '/api/placeholder/400/400',
    social: {
      twitter: '@mchen',
      linkedin: 'michael-chen',
      github: 'mchen'
    },
    topics: ['Cloud', 'Distributed Systems', 'DevOps'],
    featured: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Head of Design',
    company: 'DesignStudio',
    bio: 'Award-winning designer focused on creating intuitive user experiences that drive business growth.',
    image: '/api/placeholder/400/400',
    social: {
      twitter: '@emilyr',
      linkedin: 'emily-rodriguez',
      github: 'emilyr'
    },
    topics: ['UX Design', 'Product Strategy', 'Design Systems'],
    featured: true
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Senior Developer',
    company: 'StartupXYZ',
    bio: 'Full-stack developer with expertise in React, Node.js, and modern web technologies.',
    image: '/api/placeholder/400/400',
    social: {
      twitter: '@davidk',
      linkedin: 'david-kim',
      github: 'davidk'
    },
    topics: ['React', 'Node.js', 'Web Development'],
    featured: false
  },
  {
    id: '5',
    name: 'Lisa Wang',
    title: 'Data Scientist',
    company: 'DataCorp',
    bio: 'Specializing in big data analytics and machine learning models for business intelligence.',
    image: '/api/placeholder/400/400',
    social: {
      twitter: '@lisaw',
      linkedin: 'lisa-wang',
      github: 'lisaw'
    },
    topics: ['Data Science', 'Analytics', 'Python'],
    featured: false
  },
  {
    id: '6',
    name: 'Alex Thompson',
    title: 'Product Manager',
    company: 'ProductCo',
    bio: 'Strategic product leader with a track record of launching successful digital products.',
    image: '/api/placeholder/400/400',
    social: {
      twitter: '@alext',
      linkedin: 'alex-thompson',
      github: 'alext'
    },
    topics: ['Product Management', 'Strategy', 'Agile'],
    featured: false
  }
]

export default function SpeakersSection() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [filter, setFilter] = useState<'all' | 'featured'>('all')

  const filteredSpeakers = filter === 'featured' 
    ? speakers.filter(speaker => speaker.featured)
    : speakers

  return (
    <section id="speakers" className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Speakers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry leaders and innovators sharing their insights and experiences 
            to inspire the next generation of tech professionals.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              All Speakers
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'featured'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Featured
            </button>
          </div>
        </motion.div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpeakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative h-96 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedSpeaker(speaker)}
              >
                {/* Speaker Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Featured Badge */}
                  {speaker.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Speaker Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{speaker.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">{speaker.title}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{speaker.company}</p>
                  
                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {speaker.topics.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                    {speaker.topics.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{speaker.topics.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-3">
                    {speaker.social.twitter && (
                      <a
                        href={`https://twitter.com/${speaker.social.twitter}`}
                        className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {speaker.social.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${speaker.social.linkedin}`}
                        className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {speaker.social.github && (
                      <a
                        href={`https://github.com/${speaker.social.github}`}
                        className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="text-white font-medium flex items-center space-x-2">
                    <span>View Profile</span>
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Speakers
          </motion.button>
        </motion.div>
      </div>

      {/* Speaker Detail Modal */}
      <AnimatePresence>
        {selectedSpeaker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedSpeaker(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src={selectedSpeaker.image}
                    alt={selectedSpeaker.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedSpeaker.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-1">
                      {selectedSpeaker.title}
                    </p>
                    <p className="text-gray-600 mb-4">{selectedSpeaker.company}</p>
                    
                    <div className="flex space-x-4 mb-6">
                      {selectedSpeaker.social.twitter && (
                        <a
                          href={`https://twitter.com/${selectedSpeaker.social.twitter}`}
                          className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {selectedSpeaker.social.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${selectedSpeaker.social.linkedin}`}
                          className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {selectedSpeaker.social.github && (
                        <a
                          href={`https://github.com/${selectedSpeaker.social.github}`}
                          className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">About</h4>
                  <p className="text-gray-600 mb-6">{selectedSpeaker.bio}</p>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpeaker.topics.map((topic) => (
                      <span
                        key={topic}
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
