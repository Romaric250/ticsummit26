"use client"

import { useState, useEffect, use } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft,
  Linkedin,
  Github,
  Mail,
  Twitter,
  Share2,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { ShareModal } from "@/components/ui/ShareModal"

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
  active: boolean
  createdAt: string
  updatedAt: string
}

const TeamMemberPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    fetchMember()
  }, [slug])

  const fetchMember = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/team/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setMember(data.data)
      } else {
        setError(data.error || "Failed to load team member")
      }
    } catch (err) {
      console.error("Error fetching team member:", err)
      setError("Failed to load team member")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team member...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !member) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Member Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The team member you're looking for doesn't exist."}</p>
            <Link href="/about">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to About
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
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={400}
                        height={500}
                        className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                      />
                    ) : (
                      <div className="w-full h-96 bg-gray-700 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-6xl">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="lg:w-3/5 text-white">
                  <div className="mb-6">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">{member.name}</h1>
                    {member.role && (
                      <p className="text-xl text-blue-400 font-semibold mb-2">{member.role}</p>
                    )}
                    <p className="text-lg text-white/80">Team Member, TIC Summit</p>
                  </div>
                  
                  {member.bio && (
                    <div className="mb-8">
                      <p className="text-white/90 leading-relaxed">{member.bio}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowShareModal(true)}
                      className="bg-white hover:bg-white text-gray-900 group"
                    >
                      <Share2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Share Profile
                    </Button>
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
                  {member.bio && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                      <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                    </div>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                      <div className="space-y-3">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            <Mail className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                            <span className="text-gray-700 group-hover:text-gray-900">Email</span>
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            <span className="text-gray-700 group-hover:text-gray-900">LinkedIn</span>
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            <Twitter className="w-5 h-5 text-gray-600 group-hover:text-blue-400" />
                            <span className="text-gray-700 group-hover:text-gray-900">Twitter</span>
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                            <span className="text-gray-700 group-hover:text-gray-900">GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
        title={member.name}
      />
    </Layout>
  )
}

export default TeamMemberPage

