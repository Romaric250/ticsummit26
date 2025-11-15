"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  ArrowRight,
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                TiC summit 2026 Team
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Meet the passionate individuals driving innovation and empowering the next generation of tech leaders this {new Date().getFullYear()}.
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={`/team/${member.slug}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                      {/* Profile Image */}
                      <div className="relative h-64 bg-gray-900">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                            style={{ objectPosition: 'center top' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white font-bold text-6xl">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Name and Role */}
                        <div className="mb-3">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-900 transition-colors">
                            {member.name}
                          </h3>
                          <span className="inline-block bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full">
                            {member.role}
                          </span>
                        </div>

                        {/* Bio Preview */}
                        {member.bio && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                            {member.bio}
                          </p>
                        )}

                        {/* Social Links (without email) */}
                        {(member.linkedin || member.twitter || member.github) && (
                          <div className="mt-auto pt-4 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
                            <div className="flex items-center gap-3 mb-3">
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
                            <div className="w-full flex items-center justify-center bg-gray-900 text-white font-medium text-sm group-hover:bg-gray-800 transition-colors px-6 py-2.5">
                              View Profile
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        )}

                        {/* View Profile Link (if no social links) */}
                        {!(member.linkedin || member.twitter || member.github) && (
                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-center bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
                            <div className="w-full flex items-center justify-center bg-gray-900 text-white font-medium text-sm group-hover:bg-gray-800 transition-colors px-6 py-2.5">
                              View Profile
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
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
      </div>
    </Layout>
  )
}

export default TeamsPage
