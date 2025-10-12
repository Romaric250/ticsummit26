"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Building,
  Calendar,
  Star,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"

interface Mentor {
  id: string
  userId: string
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
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

const AdminMentorsPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  useEffect(() => {
    fetchMentors()
  }, [])

  const fetchMentors = async () => {
    try {
      setLoading(true)
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

  const handleToggleActive = async (mentorId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/mentors/${mentorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setMentors(prev => prev.map(mentor => 
          mentor.id === mentorId 
            ? { ...mentor, isActive: !currentStatus }
            : mentor
        ))
      } else {
        console.error("Failed to toggle mentor status:", data.error)
      }
    } catch (error) {
      console.error("Error toggling mentor status:", error)
    }
  }

  const handleDelete = async (mentorId: string) => {
    if (!confirm("Are you sure you want to delete this mentor? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/mentors/${mentorId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        // Remove from local state
        setMentors(prev => prev.filter(mentor => mentor.id !== mentorId))
      } else {
        console.error("Failed to delete mentor:", data.error)
        alert("Failed to delete mentor. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting mentor:", error)
      alert("Failed to delete mentor. Please try again.")
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = !searchTerm || 
      mentor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLocation = !selectedLocation || mentor.location === selectedLocation
    const matchesActive = showActiveOnly ? mentor.isActive : true

    return matchesSearch && matchesLocation && matchesActive
  })

  const locations = [...new Set(mentors.map(m => m.location).filter(Boolean))]

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading mentors...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mentors Management</h1>
                <p className="text-gray-600 mt-1">Manage mentor profiles and information</p>
              </div>
              <Link href="/admin/mentors/new">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Mentor
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Active Filter */}
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active only</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Mentors</p>
                    <p className="text-2xl font-bold text-blue-900">{mentors.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {mentors.filter(m => m.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <EyeOff className="w-8 h-8 text-gray-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mentors.filter(m => !m.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Locations</p>
                    <p className="text-2xl font-bold text-purple-900">{locations.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mentors List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
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
                  {searchTerm || selectedLocation ? "Try adjusting your search criteria" : "No mentors have been added yet"}
                </p>
              </div>
              {!searchTerm && !selectedLocation && (
                <Link href="/admin/mentors/new">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Mentor
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {mentor.user.image ? (
                            <img
                              src={mentor.user.image}
                              alt={mentor.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{mentor.user.name}</h3>
                          <p className="text-sm text-gray-600">{mentor.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(mentor.id, mentor.isActive)}
                          className={`p-1 rounded ${
                            mentor.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={mentor.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {mentor.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <Link href={`/admin/mentors/${mentor.id}`}>
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(mentor.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {mentor.bio && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mentor.bio}</p>
                    )}
                    
                    <div className="space-y-2">
                      {mentor.company && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          <span>{mentor.company}</span>
                        </div>
                      )}
                      {mentor.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{mentor.location}</span>
                        </div>
                      )}
                      {mentor.experience && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{mentor.experience}</span>
                        </div>
                      )}
                    </div>

                    {/* Specialties */}
                    {mentor.specialties.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {mentor.specialties.slice(0, 3).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                          {mentor.specialties.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{mentor.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AdminMentorsPage
