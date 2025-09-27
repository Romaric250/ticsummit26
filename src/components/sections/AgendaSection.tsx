'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MapPin, Users, ChevronRight, Play, Download } from 'lucide-react'
import { Session } from '@/types'

const sessions: Session[] = [
  {
    id: '1',
    title: 'Welcome & Opening Keynote',
    description: 'Join us for an inspiring opening keynote that sets the tone for the entire conference.',
    speaker: {
      id: '1',
      name: 'Sarah Johnson',
      title: 'CTO',
      company: 'TechCorp',
      bio: 'Leading innovation in AI and machine learning.',
      image: '/api/placeholder/100/100',
      social: {},
      topics: ['AI', 'Leadership']
    },
    startTime: new Date('2024-03-15T09:00:00Z'),
    endTime: new Date('2024-03-15T10:00:00Z'),
    room: 'Main Hall',
    type: 'keynote',
    level: 'beginner',
    tags: ['AI', 'Innovation', 'Leadership']
  },
  {
    id: '2',
    title: 'Building Scalable Cloud Architecture',
    description: 'Learn how to design and implement cloud architectures that can handle massive scale.',
    speaker: {
      id: '2',
      name: 'Michael Chen',
      title: 'Principal Engineer',
      company: 'InnovateLab',
      bio: 'Expert in distributed systems and cloud architecture.',
      image: '/api/placeholder/100/100',
      social: {},
      topics: ['Cloud', 'Architecture']
    },
    startTime: new Date('2024-03-15T10:30:00Z'),
    endTime: new Date('2024-03-15T11:30:00Z'),
    room: 'Room A',
    type: 'workshop',
    level: 'intermediate',
    tags: ['Cloud', 'Architecture', 'Scalability']
  },
  {
    id: '3',
    title: 'Design Systems That Scale',
    description: 'Creating design systems that work across teams and products.',
    speaker: {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Head of Design',
      company: 'DesignStudio',
      bio: 'Award-winning designer focused on user experiences.',
      image: '/api/placeholder/100/100',
      social: {},
      topics: ['Design', 'UX']
    },
    startTime: new Date('2024-03-15T11:45:00Z'),
    endTime: new Date('2024-03-15T12:45:00Z'),
    room: 'Room B',
    type: 'workshop',
    level: 'intermediate',
    tags: ['Design', 'UX', 'Systems']
  },
  {
    id: '4',
    title: 'Lunch Break',
    description: 'Networking lunch with fellow attendees and speakers.',
    speaker: {
      id: '0',
      name: 'Networking',
      title: 'Lunch',
      company: 'TIC Summit',
      bio: 'Networking session',
      image: '/api/placeholder/100/100',
      social: {},
      topics: ['Networking']
    },
    startTime: new Date('2024-03-15T13:00:00Z'),
    endTime: new Date('2024-03-15T14:00:00Z'),
    room: 'Main Hall',
    type: 'break',
    level: 'beginner',
    tags: ['Networking', 'Lunch']
  },
  {
    id: '5',
    title: 'The Future of Web Development',
    description: 'Exploring the latest trends and technologies shaping web development.',
    speaker: {
      id: '4',
      name: 'David Kim',
      title: 'Senior Developer',
      company: 'StartupXYZ',
      bio: 'Full-stack developer with modern web expertise.',
      image: '/api/placeholder/100/100',
      social: {},
      topics: ['Web Development', 'React']
    },
    startTime: new Date('2024-03-15T14:15:00Z'),
    endTime: new Date('2024-03-15T15:15:00Z'),
    room: 'Room A',
    type: 'workshop',
    level: 'intermediate',
    tags: ['Web Development', 'React', 'Future']
  },
  {
    id: '6',
    title: 'Data Science Panel Discussion',
    description: 'Panel discussion on the current state and future of data science.',
    speaker: {
      id: '5',
      name: 'Lisa Wang',
      title: 'Data Scientist',
      company: 'DataCorp',
      bio: 'Big data analytics and machine learning expert.',
      image: '/api/placeholder/100/100',
      social: {},
      topics: ['Data Science', 'Analytics']
    },
    startTime: new Date('2024-03-15T15:30:00Z'),
    endTime: new Date('2024-03-15T16:30:00Z'),
    room: 'Room B',
    type: 'panel',
    level: 'advanced',
    tags: ['Data Science', 'Panel', 'Discussion']
  }
]

const days = [
  { id: 'day1', name: 'Day 1', date: 'March 15', sessions: sessions },
  { id: 'day2', name: 'Day 2', date: 'March 16', sessions: [] },
  { id: 'day3', name: 'Day 3', date: 'March 17', sessions: [] }
]

export default function AgendaSection() {
  const [selectedDay, setSelectedDay] = useState('day1')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [filter, setFilter] = useState<'all' | 'keynote' | 'workshop' | 'panel'>('all')

  const currentDay = days.find(day => day.id === selectedDay)
  const filteredSessions = currentDay?.sessions.filter(session => 
    filter === 'all' || session.type === filter
  ) || []

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return 'bg-primary-600 text-white'
      case 'workshop':
        return 'bg-primary-600 text-white'
      case 'panel':
        return 'bg-purple-600 text-white'
      case 'break':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section id="agenda" className="py-20 bg-white">
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
            Conference <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Agenda</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three days of inspiring talks, hands-on workshops, and networking opportunities 
            designed to accelerate your career in technology.
          </p>
        </motion.div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-100 rounded-full p-1">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedDay === day.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'keynote', label: 'Keynotes' },
              { id: 'workshop', label: 'Workshops' },
              { id: 'panel', label: 'Panels' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === filterOption.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 to-primary-400" />

          {/* Sessions */}
          <div className="space-y-8">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start space-x-6 group cursor-pointer"
                onClick={() => setSelectedSession(session)}
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-white rounded-full border-4 border-primary-200 flex items-center justify-center group-hover:border-primary-400 transition-colors duration-300">
                  <div className="w-3 h-3 bg-primary-600 rounded-full" />
                </div>

                {/* Session Card */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 p-6 group-hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                          {session.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(session.level)}`}>
                          {session.level}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                        {session.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{session.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{session.room}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img
                        src={session.speaker.image}
                        alt={session.speaker.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {session.speaker.name}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {session.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
          >
            <Download className="h-5 w-5" />
            <span>Download Full Schedule</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Session Detail Modal */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedSession(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedSession.type)}`}>
                        {selectedSession.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedSession.level)}`}>
                        {selectedSession.level}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedSession.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{selectedSession.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Time</h4>
                    <p className="text-gray-600">
                      {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600">{selectedSession.room}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Speaker</h4>
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedSession.speaker.image}
                      alt={selectedSession.speaker.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">{selectedSession.speaker.name}</h5>
                      <p className="text-gray-600">{selectedSession.speaker.title} at {selectedSession.speaker.company}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
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
