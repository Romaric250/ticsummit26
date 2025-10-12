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
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

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

  const specialties = [...new Set(mentors.flatMap(m => m.specialties))]
  const locations = [...new Set(mentors.map(m => m.location).filter(Boolean))]

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSpecialty = !selectedSpecialty || mentor.specialties.includes(selectedSpecialty)
    const matchesLocation = !selectedLocation || mentor.location === selectedLocation

    return matchesSearch && matchesSpecialty && matchesLocation
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
        ease: "easeOut",
      },
    },
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gray-900 overflow-hidden">
          {/* Background Elements */}
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
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <GraduationCap className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">Learn from Industry Leaders</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-white">Meet Our</span>
                <span className="block text-white">Expert Mentors</span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Industry veterans who guide students on their journey to becoming tech innovators.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{loading ? "..." : `${mentors.length} Expert Mentors`}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>{loading ? "..." : `${mentors.filter(m => m.isActive).length} Active Mentors`}</span>
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
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search mentors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  {/* Specialty Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">All Specialties</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading mentors...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Failed to load mentors</p>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
                <Button onClick={fetchMentors} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Try Again
                </Button>
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
                                   />
                                 ) : (
                                   <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                     <Users className="w-16 h-16 text-gray-400" />
                                   </div>
                                 )}
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                 
                                 {/* Experience Badge */}
                                 {mentor.experience && (
                                   <div className="absolute top-4 left-4 bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium">
                                     {mentor.experience}
                                   </div>
                                 )}

                                 {/* Active Status */}
                                 <div className="absolute top-4 right-4">
                                   <div className={`w-3 h-3 rounded-full ${mentor.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                 </div>
                               </div>

                               {/* Content */}
                               <div className="p-6">
                                 <div className="mb-4">
                                   <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                                     {mentor.name}
                                   </h3>
                                   <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                     {mentor.location && (
                                       <div className="flex items-center space-x-1">
                                         <MapPin className="w-4 h-4" />
                                         <span>{mentor.location}</span>
                                       </div>
                                     )}
                                     {mentor.company && (
                                       <div className="flex items-center space-x-1">
                                         <Building className="w-4 h-4" />
                                         <span>{mentor.company}</span>
                                       </div>
                                     )}
                                   </div>
                                 </div>

                                 {mentor.bio && (
                                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                     {mentor.bio}
                                   </p>
                                 )}

                                 {/* Specialties */}
                                 <div className="mb-4">
                                   <div className="flex flex-wrap gap-2">
                                     {mentor.specialties.slice(0, 3).map((specialty, specIndex) => (
                                       <span
                                         key={specIndex}
                                         className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                                       >
                                         {specialty}
                                       </span>
                                     ))}
                                     {mentor.specialties.length > 3 && (
                                       <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                         +{mentor.specialties.length - 3} more
                                       </span>
                                     )}
                                   </div>
                                 </div>

                                 {/* Languages */}
                                 {mentor.languages.length > 0 && (
                                   <div className="mb-4">
                                     <div className="flex flex-wrap gap-1">
                                       {mentor.languages.slice(0, 2).map((language, langIndex) => (
                                         <span
                                           key={langIndex}
                                           className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                                         >
                                           {language}
                                         </span>
                                       ))}
                                       {mentor.languages.length > 2 && (
                                         <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                           +{mentor.languages.length - 2}
                                         </span>
                                       )}
                                     </div>
                                   </div>
                                 )}

                                 {/* Status */}
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center space-x-2">
                                     <div className={`w-2 h-2 rounded-full ${mentor.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                     <span className="text-sm text-gray-600">
                                       {mentor.isActive ? 'Available' : 'Unavailable'}
                                     </span>
                                   </div>
                                   <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                                 </div>
                               </div>
                             </div>
                           </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && !error && filteredMentors.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No mentors found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedSpecialty || selectedLocation 
                    ? "Try adjusting your search criteria" 
                    : "No mentors have been added yet"}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Find Your Mentor?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect with industry experts who can guide your journey to success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  className="bg-white hover:bg-white text-gray-900 group"
                >
                  Find a Mentor
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Become a Mentor
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default MentorsPage
