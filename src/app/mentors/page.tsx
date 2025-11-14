"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  GraduationCap, 
  Award, 
  Calendar, 
  MapPin, 
  Search, 
  Filter,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Coffee,
  Camera,
  Code,
  Palette,
  Music,
  BookOpen,
  Gamepad2,
  Mic,
  Video,
  Lightbulb,
  Target,
  Trophy,
  Gift,
  Brain,
  Atom,
  Cpu,
  Database,
  Layers,
  Shuffle,
  RotateCcw,
  Eye,
  EyeOff,
  Briefcase,
  Building,
  TrendingUp,
  Shield,
  Rocket,
  Crown
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"
import { StructuredData } from "@/components/seo/StructuredData"
import { generateBreadcrumbSchema } from "@/lib/seo"

interface Mentor {
  id: string
  slug: string
  name: string
  email: string
  profileImage?: string
  bio?: string
  specialties: string[]
  experience?: string
  company?: string
  location?: string
  education?: string
  languages: string[]
  achievements: string[]
  yearJoined?: number
  socialLinks?: any
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const MentorsPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")

  useEffect(() => {
    fetchMentors()
  }, [])

  const fetchMentors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/mentors")
      const data = await response.json()
      
      if (data.success) {
        setMentors(data.data)
      } else {
        setError("Failed to load mentors")
      }
    } catch (err) {
      console.error("Error fetching mentors:", err)
      setError("Failed to load mentors")
    } finally {
      setLoading(false)
    }
  }

  const locations = [...new Set(mentors.map(m => m.location).filter(Boolean))]
  const allSpecialties = [...new Set(mentors.flatMap(m => m.specialties || []))]

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = !searchTerm || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLocation = !selectedLocation || mentor.location === selectedLocation
    const matchesSpecialty = !selectedSpecialty || mentor.specialties.includes(selectedSpecialty)

    return matchesSearch && matchesLocation && matchesSpecialty
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Mentors', url: '/mentors' },
  ])

  return (
    <Layout>
      {/* Structured Data */}
      <StructuredData data={breadcrumbSchema} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Connect with industry leaders, tech professionals, and innovators who guide and inspire young tech talents.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{loading ? "..." : `${mentors.length} Mentors`}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{loading ? "..." : `${locations.length} Locations`}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>{loading ? "..." : `${allSpecialties.length} Specialties`}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={loading ? "Search mentors..." : `Search from ${mentors.length} mentor${mentors.length !== 1 ? 's' : ''}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Location Filter */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white text-gray-900"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Specialty Filter */}
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white text-gray-900"
                    >
                      <option value="">All Specialties</option>
                      {allSpecialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mentors Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading mentors...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Failed to load mentors</p>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
                <Button onClick={fetchMentors} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Try Again
                </Button>
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">No mentors found</p>
                  <p className="text-sm text-gray-600">
                    {searchTerm || selectedLocation || selectedSpecialty ? "Try adjusting your search criteria" : "No mentors have been added yet"}
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredMentors.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Link href={`/mentors/${mentor.slug}`}>
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
                        {/* Profile Image */}
                        <div className="relative h-64 bg-gray-900">
                          {mentor.profileImage ? (
                            <Image
                              src={mentor.profileImage}
                              alt={mentor.name}
                              fill
                              className="object-cover"
                              style={{ objectPosition: 'center top' }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <Users className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          
                          {/* Company Badge */}
                          {mentor.company && (
                            <div className="absolute top-4 left-4 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                              {mentor.company}
                            </div>
                          )}

                          {/* Location Badge */}
                          {mentor.location && (
                            <div className="absolute top-4 right-4 bg-gray-900/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{mentor.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{mentor.name}</h3>
                          {mentor.experience && (
                            <p className="text-gray-600 text-sm mb-3">{mentor.experience}</p>
                          )}
                          {mentor.bio && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {mentor.specialties.slice(0, 3).map((specialty, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                            {mentor.specialties.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                +{mentor.specialties.length - 3} more
                              </span>
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default MentorsPage
