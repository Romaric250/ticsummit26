"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Award, 
  School, 
  MapPin, 
  Search, 
  Star,
  Trophy,
  Mail,
  Phone,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"

interface Ambassador {
  id: string
  slug: string
  name: string
  email: string
  profileImage?: string
  bio?: string
  school: string
  contactInfo?: string
  socialLinks?: Record<string, string>
  ticPoints: number
  spotlightContributions?: Array<{
    title: string
    description: string
    date?: string
  }>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const AmbassadorsPage = () => {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")

  useEffect(() => {
    fetchAmbassadors()
  }, [])

  const fetchAmbassadors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/ambassadors")
      const data = await response.json()
      
      if (data.success) {
        setAmbassadors(data.data)
      } else {
        setError("Failed to load ambassadors")
      }
    } catch (err) {
      console.error("Error fetching ambassadors:", err)
      setError("Failed to load ambassadors")
    } finally {
      setLoading(false)
    }
  }

  const schools = [...new Set(ambassadors.map(a => a.school).filter(Boolean))]

  const filteredAmbassadors = ambassadors.filter(ambassador => {
    const matchesSearch = ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambassador.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambassador.school.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSchool = !selectedSchool || ambassador.school === selectedSchool

    return matchesSearch && matchesSchool
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

  return (
    <Layout>
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

              {/* <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-white">Our Amazing</span>
                <span className="block text-white">Ambassadors</span>
              </h1> */}

              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Student leaders who champion innovation and inspire the next generation of tech innovators.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{loading ? "..." : `${ambassadors.length} Ambassadors`}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <School className="w-5 h-5" />
                  <span>{loading ? "..." : `${schools.length} Schools`}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={loading ? "Search ambassadors..." : `Search from ${ambassadors.length} ambassador${ambassadors.length !== 1 ? 's' : ''}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* School Filter */}
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white text-gray-900"
                    >
                      <option value="">All Schools</option>
                      {schools.map(school => (
                        <option key={school} value={school}>{school}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ambassadors Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading ambassadors...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Failed to load ambassadors</p>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
                <Button onClick={fetchAmbassadors} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Try Again
                </Button>
              </div>
            ) : filteredAmbassadors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">No ambassadors found</p>
                  <p className="text-sm text-gray-600">
                    {searchTerm || selectedSchool ? "Try adjusting your search criteria" : "No ambassadors have been added yet"}
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
                {filteredAmbassadors.map((ambassador, index) => (
                  <motion.div
                    key={ambassador.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Link href={`/ambassadors/${ambassador.slug}`}>
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
                        {/* Profile Image */}
                        <div className="relative h-64 bg-gray-900">
                          {ambassador.profileImage ? (
                            <Image
                              src={ambassador.profileImage}
                              alt={ambassador.name}
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
                          
                          {/* TIC Points Badge */}
                          <div className="absolute top-4 left-4 bg-gray-900/90 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                            <span>{ambassador.ticPoints} Points</span>
                          </div>

                          {/* School Badge */}
                          <div className="absolute top-4 right-4 bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                            {ambassador.school}
                          </div>

                          {/* Spotlight Badge */}
                          {ambassador.spotlightContributions && 
                           Array.isArray(ambassador.spotlightContributions) && 
                           ambassador.spotlightContributions.length > 0 && (
                            <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                              <span>Featured</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{ambassador.name}</h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <School className="w-4 h-4 mr-2" />
                            <span className="text-sm">{ambassador.school}</span>
                          </div>
                          {ambassador.bio && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ambassador.bio}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <span className="text-sm font-medium">{ambassador.ticPoints} TIC Points</span>
                            </div>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                          {ambassador.spotlightContributions && 
                           Array.isArray(ambassador.spotlightContributions) && 
                           ambassador.spotlightContributions.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center space-x-1 text-blue-600 mb-1">
                                <Trophy className="w-3 h-3" />
                                <span className="text-xs font-medium">Major Contribution</span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-1">
                                {Array.isArray(ambassador.spotlightContributions) && 
                                 ambassador.spotlightContributions[0]?.title}
                              </p>
                            </div>
                          )}
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

export default AmbassadorsPage

