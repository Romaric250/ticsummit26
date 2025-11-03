"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
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
  Sparkles,
  Zap,
  Rocket,
  Crown,
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
  GraduationCap,
  BookOpenCheck,
  FileText,
  ExternalLink,
  Loader,
  X,
  Mail,
  Phone,
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
import { MentorDetailSkeleton } from "@/components/ui/MentorSkeleton"

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

const MentorProfilePage = () => {
  const params = useParams()
  const slug = params.slug as string
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  })

  useEffect(() => {
    if (slug) {
      fetchMentor()
    }
  }, [slug])

  const fetchMentor = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First, try to find mentor by slug in the database
      // For now, we'll use the slug as the ID since we don't have slug field in our schema yet
      const response = await fetch(`/api/mentors/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setMentor(data.data)
      } else {
        setError("Mentor not found")
      }
    } catch (err) {
      console.error("Error fetching mentor:", err)
      setError("Failed to load mentor")
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <Layout>
        <MentorDetailSkeleton />
      </Layout>
    )
  }
  
  if (error || !mentor) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentor Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The mentor you're looking for doesn't exist."}</p>
            <Link href="/mentors">
              <Button>Back to Mentors</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

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
        ease: [0.16, 1, 0.3, 1] as const, // easeOut cubic-bezier equivalent
      },
    },
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/mentors" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Mentors</span>
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
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                    <GraduationCap className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold mb-4">{mentor.name}</h1>
                <p className="text-2xl text-white/80 mb-6">{mentor.experience}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Location</p>
                      <p className="text-white font-medium">{mentor.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Company</p>
                      <p className="text-white font-medium">{mentor.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Joined</p>
                      <p className="text-white font-medium">{mentor.yearJoined || new Date(mentor.createdAt).getFullYear()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-white hover:bg-white text-gray-900 group"
                    onClick={() => setShowRequestModal(true)}
                  >
                    <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Request Mentorship
                  </Button>
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
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
                <p className="text-gray-600 leading-relaxed">{mentor.bio}</p>
              </motion.div>

              {/* Expertise Areas */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Expertise Areas</h2>
                <div className="flex flex-wrap gap-3">
                  {mentor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h2>
                <div className="space-y-4">
                  {mentor.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                      </div>
                      <p className="text-gray-600">{achievement}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">

              {/* Contact Info */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{mentor.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Joined {mentor.yearJoined || new Date(mentor.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Professional Background */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Professional Background</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Education</p>
                    <p className="text-gray-600">{mentor.education}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Current Company</p>
                    <p className="text-gray-600">{mentor.company}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Languages</p>
                    <p className="text-gray-600">{mentor.languages.join(", ")}</p>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Connect</h3>
                <div className="space-y-3">
                  {mentor.socialLinks?.linkedin && (
                    <a
                      href={mentor.socialLinks.linkedin}
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
                  {mentor.socialLinks?.twitter && (
                    <a
                      href={mentor.socialLinks.twitter}
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
                  {mentor.socialLinks?.github && (
                    <a
                      href={mentor.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">GH</span>
                      </div>
                      <span className="text-gray-700">GitHub</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  {mentor.socialLinks?.website && (
                    <a
                      href={mentor.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Website</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Request Mentorship CTA */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Ready to Get Mentored?</h3>
                <p className="text-white/90 mb-6">
                  Connect with {mentor.name.split(' ')[0]} for personalized guidance and support.
                </p>
                <Button 
                  className="w-full bg-white hover:bg-white text-gray-900"
                  onClick={() => setShowRequestModal(true)}
                >
                  Request Mentorship Session
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Request Mentorship Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Mentorship</h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={requestForm.subject}
                    onChange={(e) => setRequestForm({...requestForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Mentorship Request"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Tell {mentor?.name} about your goals and what kind of mentorship you're looking for..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowRequestModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Here you would typically send the email or save the request
                      const mailtoLink = `mailto:${mentor?.email}?subject=${encodeURIComponent(requestForm.subject || 'Mentorship Request')}&body=${encodeURIComponent(
                        `Hi ${mentor?.name},\n\nMy name is ${requestForm.name} and I'm interested in mentorship.\n\n${requestForm.message}\n\nBest regards,\n${requestForm.name}\n${requestForm.email}`
                      )}`
                      window.open(mailtoLink)
                      setShowRequestModal(false)
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!requestForm.name || !requestForm.email || !requestForm.message}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <h3 className="text-base sm:text-lg font-semibold text-white">Share Mentor Profile</h3>
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
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/mentors/${mentor?.slug}`}
                      readOnly
                      className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/mentors/${mentor?.slug}`)
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
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/mentors/${mentor?.slug}`
                      window.open(`https://twitter.com/intent/tweet?text=Check out this amazing mentor: ${mentor?.name}&url=${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                  >
                    <Twitter className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Twitter</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/mentors/${mentor?.slug}`
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <Linkedin className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">LinkedIn</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/mentors/${mentor?.slug}`
                      window.open(`https://wa.me/?text=Check out this amazing mentor: ${mentor?.name} - ${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/mentors/${mentor?.slug}`
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

export default MentorProfilePage
