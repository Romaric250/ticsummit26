"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { 
  Calendar, 
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Award,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  ExternalLink,
  Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"
import { StructuredData } from "@/components/seo/StructuredData"
import { generateBreadcrumbSchema, generatePersonSchema } from "@/lib/seo"
import { toast } from "sonner"

interface TeamMember {
  id: string
  slug: string
  name: string
  role: string
  bio?: string
  imageUrl?: string
  email?: string
  linkedin?: string
  twitter?: string
  github?: string
  activities?: Array<{
    description: string
    date?: string
    location?: string
  }>
  achievements?: Array<{
    title: string
    description: string
    images: string[]
    date?: string
  }>
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

const TeamMemberPage = () => {
  const params = useParams()
  const slug = params.slug as string
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [selectedAchievementIndex, setSelectedAchievementIndex] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchTeamMember()
    }
  }, [slug])

  const fetchTeamMember = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/content/team-members/${encodeURIComponent(slug)}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        if (data.data.active) {
          setMember(data.data)
        } else {
          setError("Team member not found")
        }
      } else {
        setError("Team member not found")
      }
    } catch (err) {
      console.error("Error fetching team member:", err)
      setError("Failed to load team member")
    } finally {
      setLoading(false)
    }
  }

  const achievements = member?.achievements || []
  const activities = member?.activities || []
  const MAX_VISIBLE_ACHIEVEMENTS = 3

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Team", url: "/team" },
    { name: member?.name || "Team Member", url: `/team/${slug}` }
  ])

  const personSchema = member ? generatePersonSchema({
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: member.imageUrl,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ticsummit.org'}/team/${member.slug}`
  }) : null

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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    )
  }

  if (error || !member) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The team member you're looking for doesn't exist."}</p>
            <Link href="/team">
              <Button>Back to Team</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <StructuredData data={breadcrumbSchema} />
      {personSchema && <StructuredData data={personSchema} />}
      
      <div className="min-h-screen bg-gray-50">
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
                <div className="relative w-full">
                  <div className="relative w-full sm:w-80 md:w-96 aspect-square mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-white font-bold text-6xl">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2 text-white">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">{member.name}</h1>
                <div className="inline-block mb-6">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-lg font-medium">
                    {member.role}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
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
              {member.bio && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{member.bio}</p>
                </motion.div>
              )}

              {/* Activities */}
              {activities.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <Activity className="w-6 h-6 text-gray-900" />
                    <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
                  </div>
                  <div className="space-y-6">
                    {activities.map((activity, index) => (
                      <div key={index} className="border-l-4 border-gray-900 pl-4">
                        <p className="text-gray-900 font-medium mb-2">
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {activity.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{activity.date}</span>
                            </div>
                          )}
                          {activity.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <Award className="w-6 h-6 text-gray-900" />
                    <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                  </div>
                  <div className="space-y-6">
                    {achievements.slice(0, MAX_VISIBLE_ACHIEVEMENTS).map((achievement, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-700 mb-3">
                          {achievement.description}
                        </p>
                        {achievement.images && achievement.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                            {achievement.images.slice(0, 3).map((img, imgIndex) => (
                              <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                  src={img}
                                  alt={`${achievement.title} ${imgIndex + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {achievement.date && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{achievement.date}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Read More Button */}
                  {achievements.length > MAX_VISIBLE_ACHIEVEMENTS && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button
                        onClick={() => {
                          setSelectedAchievementIndex(MAX_VISIBLE_ACHIEVEMENTS)
                          setShowAchievementsModal(true)
                        }}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        View All Achievements ({achievements.length})
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Contact Info */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {member.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-700">
                        {member.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{member.role}</span>
                  </div>
                </div>
              </motion.div>

              {/* Profile Details */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Role</p>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                  {activities.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900">Activities</p>
                      <p className="text-gray-600">{activities.length} activit{activities.length !== 1 ? 'ies' : 'y'}</p>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900">Achievements</p>
                      <p className="text-gray-600">{achievements.length} achievement{achievements.length !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Social Links */}
              {(member.linkedin || member.twitter || member.github) && (
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Connect</h3>
                  <div className="space-y-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Linkedin className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700">LinkedIn</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                          <Twitter className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700">Twitter</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                          <Github className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700">GitHub</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              {member.email && (
                <motion.div variants={itemVariants} className="bg-gray-900 rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Connect with {member.name.split(' ')[0]}</h3>
                  <p className="text-white/90 mb-6">
                    Interested in learning more about their work or collaborating?
                  </p>
                  <Button 
                    className="w-full bg-white hover:bg-white text-gray-900"
                    onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievementsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 pt-20 md:pt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-gray-900" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Achievements ({achievements.length})
                  </h2>
                </div>
                <button
                  onClick={() => setShowAchievementsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 overflow-x-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedAchievementIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {achievements.map((achievement, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {achievement.title}
                          </h3>
                          {achievement.date && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{achievement.date}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {achievement.description}
                        </p>
                        {achievement.images && achievement.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {achievement.images.map((img, imgIndex) => (
                              <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                  src={img}
                                  alt={`${achievement.title} ${imgIndex + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedAchievementIndex + 1} of {achievements.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setSelectedAchievementIndex((prev) => 
                        prev > 0 ? prev - 1 : achievements.length - 1
                      )
                    }}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedAchievementIndex((prev) => 
                        prev < achievements.length - 1 ? prev + 1 : 0
                      )
                    }}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <ChevronRight className="w-4 h-4" />
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 overflow-y-auto pt-20 md:pt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md my-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">Share Team Member Profile</h3>
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
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/team/${member?.slug}`}
                      readOnly
                      className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/team/${member?.slug}`)
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
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/team/${member?.slug}`
                      window.open(`https://twitter.com/intent/tweet?text=Check out this team member: ${member?.name}&url=${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                  >
                    <Twitter className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Twitter</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/team/${member?.slug}`
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                    }}
                    className="py-2.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <Linkedin className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">LinkedIn</span>
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

export default TeamMemberPage

