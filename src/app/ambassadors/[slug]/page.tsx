"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { 
  ArrowLeft,
  School, 
  Mail,
  Phone,
  Star,
  Trophy,
  Users,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink,
  Sparkles,
  Share2,
  X,
  Facebook,
  MessageSquare,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

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

const AmbassadorProfilePage = () => {
  const params = useParams()
  const slug = params.slug as string
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchAmbassador()
    }
  }, [slug])

  const fetchAmbassador = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/ambassadors/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setAmbassador(data.data)
      } else {
        setError("Ambassador not found")
      }
    } catch (err) {
      console.error("Error fetching ambassador:", err)
      setError("Failed to load ambassador")
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    )
  }
  
  if (error || !ambassador) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Ambassador Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The ambassador you're looking for doesn't exist."}</p>
            <Link href="/ambassadors">
              <Button>Back to Ambassadors</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const contributions = Array.isArray(ambassador.spotlightContributions) 
    ? ambassador.spotlightContributions 
    : []

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
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/ambassadors" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Ambassadors</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center"
            >
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="w-64 h-64 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl">
                    {ambassador.profileImage ? (
                      <Image
                        src={ambassador.profileImage}
                        alt={ambassador.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Users className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
            
                </div>
              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gray-800/90 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                    <span>{ambassador.ticPoints} TIC Points</span>
                  </div>
                  {contributions.length > 0 && (
                    <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                      <span>Featured Ambassador</span>
                    </div>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold mb-4">{ambassador.name}</h1>
                <p className="text-2xl text-white/80 mb-6">{ambassador.school}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <School className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">School</p>
                      <p className="text-white font-medium">{ambassador.school}</p>
                    </div>
                  </div>
                  {ambassador.contactInfo && (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Contact</p>
                        <p className="text-white font-medium">{ambassador.contactInfo}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">TIC Points</p>
                      <p className="text-white font-medium">{ambassador.ticPoints}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-transparent hover:text-white"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="mr-2 w-5 h-5" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              {ambassador.bio && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
                  <p className="text-gray-600 leading-relaxed">{ambassador.bio}</p>
                </motion.div>
              )}

              {/* Spotlight Contributions */}
              {contributions.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Major Contributions</h2>
                  </div>
                  <div className="space-y-6">
                    {contributions.map((contribution, idx) => (
                      <div key={idx} className="border-l-4 border-blue-600 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{contribution.title}</h3>
                          {contribution.date && (
                            <span className="text-sm text-gray-500">{contribution.date}</span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed">{contribution.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TIC Points Achievement */}
              {ambassador.ticPoints > 0 && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{ambassador.ticPoints} TIC Points Earned</p>
                        <p className="text-gray-600 text-sm">Contributing to the TIC Summit community and innovation</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Contact Info */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {ambassador.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a href={`mailto:${ambassador.email}`} className="text-blue-600 hover:text-blue-700">
                        {ambassador.email}
                      </a>
                    </div>
                  )}
                  {ambassador.contactInfo && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a href={`tel:${ambassador.contactInfo}`} className="text-blue-600 hover:text-blue-700">
                        {ambassador.contactInfo}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <School className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{ambassador.school}</span>
                  </div>
                </div>
              </motion.div>

              {/* Profile Details */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">School</p>
                    <p className="text-gray-600">{ambassador.school}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">TIC Points</p>
                    <p className="text-gray-600">{ambassador.ticPoints} points</p>
                  </div>
                  {contributions.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900">Major Contributions</p>
                      <p className="text-gray-600">{contributions.length} featured contribution{contributions.length !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Social Links */}
              {(ambassador.socialLinks?.linkedin || ambassador.socialLinks?.twitter || ambassador.socialLinks?.instagram || ambassador.socialLinks?.website) && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Connect</h3>
                  <div className="space-y-3">
                    {ambassador.socialLinks?.linkedin && (
                      <a
                        href={ambassador.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">in</span>
                        </div>
                        <span className="text-gray-700">LinkedIn</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                    {ambassador.socialLinks?.twitter && (
                      <a
                        href={ambassador.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">𝕏</span>
                        </div>
                        <span className="text-gray-700">Twitter</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                    {ambassador.socialLinks?.instagram && (
                      <a
                        href={ambassador.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700">Instagram</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                    {ambassador.socialLinks?.website && (
                      <a
                        href={ambassador.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700">Website</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Connect with {ambassador.name.split(' ')[0]}</h3>
                <p className="text-white/90 mb-6">
                  Interested in learning more about their work or collaborating?
                </p>
                {ambassador.email && (
                  <Button 
                    className="w-full bg-white hover:bg-white text-gray-900"
                    onClick={() => window.open(`mailto:${ambassador.email}`, '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md my-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">Share Ambassador Profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/ambassadors/${ambassador?.slug}`}
                      readOnly
                      className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/ambassadors/${ambassador?.slug}`)
                        toast.success("Link copied to clipboard!")
                      }}
                      className="px-4 py-2.5 text-sm whitespace-nowrap"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/ambassadors/${ambassador?.slug}`
                      window.open(`https://twitter.com/intent/tweet?text=Check out this amazing ambassador: ${ambassador?.name}&url=${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                  >
                    <Twitter className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Twitter</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/ambassadors/${ambassador?.slug}`
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <Linkedin className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">LinkedIn</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/ambassadors/${ambassador?.slug}`
                      window.open(`https://wa.me/?text=Check out this amazing ambassador: ${ambassador?.name} - ${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/ambassadors/${ambassador?.slug}`
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center"
                  >
                    <Facebook className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Facebook</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default AmbassadorProfilePage
