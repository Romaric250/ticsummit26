"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  ArrowRight,
  Mail,
  Linkedin,
  Twitter,
  Github
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"
import { StructuredData } from "@/components/seo/StructuredData"
import { generateBreadcrumbSchema } from "@/lib/seo"

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

const TeamsPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/content/team-members")
      const data = await response.json()
      
      if (data.success) {
        setTeamMembers(data.data.filter((member: TeamMember) => member.active))
      } else {
        setError("Failed to load team members")
      }
    } catch (err) {
      console.error("Error fetching team members:", err)
      setError("Failed to load team members")
    } finally {
      setLoading(false)
    }
  }

  // Sort team members by order
  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Team", url: "/team" }
  ])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchTeamMembers} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <StructuredData data={breadcrumbSchema} />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our Team
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Meet the passionate individuals driving innovation and empowering the next generation of tech leaders
              </p>
            </motion.div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {sortedMembers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No team members found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link href={`/team/${member.slug}`}>
                      <div className="p-6">
                        {/* Image */}
                        <div className="flex justify-center mb-4">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                            {member.imageUrl ? (
                              <Image
                                src={member.imageUrl}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-3xl font-bold">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Name and Role */}
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {member.name}
                          </h3>
                          <p className="text-gray-600 text-sm font-medium">
                            {member.role}
                          </p>
                        </div>

                        {/* Bio Preview */}
                        {member.bio && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 text-center">
                            {member.bio}
                          </p>
                        )}

                        {/* Social Links */}
                        {(member.email || member.linkedin || member.twitter || member.github) && (
                          <div className="flex items-center justify-center gap-3 mb-4">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-400 hover:text-gray-900 transition-colors"
                              >
                                <Mail className="w-5 h-5" />
                              </a>
                            )}
                            {member.linkedin && (
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Linkedin className="w-5 h-5" />
                              </a>
                            )}
                            {member.twitter && (
                              <a
                                href={member.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                              >
                                <Twitter className="w-5 h-5" />
                              </a>
                            )}
                            {member.github && (
                              <a
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-400 hover:text-gray-900 transition-colors"
                              >
                                <Github className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* View Profile Link */}
                        <div className="flex items-center justify-center text-gray-900 font-medium text-sm group">
                          View Profile
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default TeamsPage

