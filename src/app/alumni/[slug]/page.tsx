"use client"

import { useState, useEffect, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft,
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  Award, 
  Heart,
  MessageCircle,
  Share2,
  Download,
  CheckCircle,
  Code,
  Palette,
  Camera,
  Music,
  BookOpen,
  Gamepad2,
  Mic,
  Video,
  Lightbulb,
  Target,
  Trophy,
  Gift,
  Globe,
  Coffee,
  Briefcase,
  Building,
  GraduationCap,
  Linkedin,
  Twitter,
  Facebook,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { AlumniDetailSkeleton } from "@/components/ui/AlumniSkeleton"

interface Alumni {
  id: string
  slug: string
  name: string
  email: string
  profileImage?: string
  bio?: string
  graduationYear?: number
  currentRole?: string
  company?: string
  location?: string
  achievements: string[]
  socialLinks?: any
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const AlumniProfilePage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)
  const [alumnus, setAlumnus] = useState<Alumni | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    fetchAlumnus()
  }, [slug])

  const fetchAlumnus = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/alumni/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setAlumnus(data.data)
      } else {
        setError(data.error || "Failed to load alumni")
      }
    } catch (err) {
      console.error("Error fetching alumni:", err)
      setError("Failed to load alumni")
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Profile URL copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy URL")
    }
  }

  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(`${alumnus?.name} - Alumni Profile`)
    
    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${url}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  if (loading) {
    return (
      <Layout>
        <AlumniDetailSkeleton />
      </Layout>
    )
  }

  if (error || !alumnus) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Alumni Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The alumni profile you're looking for doesn't exist."}</p>
            <Link href="/alumni">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Alumni
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
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
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Image */}
                <div className="lg:w-2/5">
                  <div className="relative">
                    {alumnus.profileImage ? (
                      <Image
                        src={alumnus.profileImage}
                        alt={alumnus.name}
                        width={400}
                        height={500}
                        className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                      />
                    ) : (
                      <div className="w-full h-96 bg-gray-700 rounded-2xl flex items-center justify-center">
                        <Users className="w-32 h-32 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="lg:w-3/5 text-white">
                  <div className="mb-6">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">{alumnus.name}</h1>
                    {alumnus.currentRole && (
                      <p className="text-xl text-white/90 mb-2">{alumnus.currentRole}</p>
                    )}
                    {alumnus.company && (
                      <p className="text-lg text-white/80">{alumnus.company}</p>
                    )}
                  </div>
                  
                  {alumnus.bio && (
                    <div className="mb-8">
                      <p className="text-white/90 leading-relaxed">{alumnus.bio}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={handleShare}
                      className="bg-white hover:bg-white text-gray-900 group"
                    >
                      <Share2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Share Profile
                    </Button>
                    {/* <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-gray-900"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* About */}
                  {/* {alumnus.bio && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                      <p className="text-gray-700 leading-relaxed">{alumnus.bio}</p>
                    </div>
                  )} */}

                  {/* Achievements */}
                  {alumnus.achievements.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievements</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {alumnus.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Trophy className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {alumnus.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{alumnus.location}</span>
                        </div>
                      )}
                      {alumnus.graduationYear && (
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">Graduated {alumnus.graduationYear}</span>
                        </div>
                      )}
                      {alumnus.company && (
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{alumnus.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  {alumnus.socialLinks && Object.keys(alumnus.socialLinks).length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {alumnus.socialLinks.linkedin && (
                          <a
                            href={alumnus.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span className="text-sm">LinkedIn</span>
                          </a>
                        )}
                        {alumnus.socialLinks.twitter && (
                          <a
                            href={alumnus.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                            <span className="text-sm">Twitter</span>
                          </a>
                        )}
                        {alumnus.socialLinks.github && (
                          <a
                            href={alumnus.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            <Code className="w-4 h-4" />
                            <span className="text-sm">GitHub</span>
                          </a>
                        )}
                        {alumnus.socialLinks.website && (
                          <a
                            href={alumnus.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            <span className="text-sm">Website</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Inspired by {alumnus.name}'s Journey?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Start your own success story by joining our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/alumni">
                  <Button
                    size="xl"
                    className="bg-white hover:bg-white text-gray-900 group"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    View All Alumni
                  </Button>
                </Link>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white text-white hover:bg-transparent hover:text-white"
                >
                  Join Our Program
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share Profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alumnus.name}</p>
                    <p className="text-sm text-gray-600">Alumni Profile</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                  <Button onClick={copyToClipboard} size="sm">
                    Copy
                  </Button>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => shareOnSocial("twitter")}
                    className="flex-1 bg-blue-400 hover:bg-blue-500 text-white"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => shareOnSocial("linkedin")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => shareOnSocial("whatsapp")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => shareOnSocial("facebook")}
                    className="flex-1 bg-blue-800 hover:bg-blue-900 text-white"
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
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

export default AlumniProfilePage
