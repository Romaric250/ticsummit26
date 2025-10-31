"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Building,
  X,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"

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

const AdminMentorsPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [mentorToDelete, setMentorToDelete] = useState<Mentor | null>(null)
  const [showToggleModal, setShowToggleModal] = useState(false)
  const [mentorToToggle, setMentorToToggle] = useState<Mentor | null>(null)
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

  const handleToggleActive = (mentorId: string, currentStatus: boolean) => {
    const mentor = mentors.find(m => m.id === mentorId)
    if (!mentor) return
    
    setMentorToToggle(mentor)
    setShowToggleModal(true)
  }

  const confirmToggleActive = async () => {
    if (!mentorToToggle) return

    try {
      const response = await fetch(`/api/mentors/${mentorToToggle.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...mentorToToggle,
          isActive: !mentorToToggle.isActive
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setMentors(prev => prev.map(mentor => 
          mentor.id === mentorToToggle.id 
            ? { ...mentor, isActive: !mentorToToggle.isActive }
            : mentor
        ))
        toast.success(`Mentor ${mentorToToggle.isActive ? 'deactivated' : 'activated'} successfully!`)
      } else {
        toast.error("Failed to update mentor status")
      }
    } catch (error) {
      console.error("Error toggling mentor status:", error)
      toast.error("Failed to update mentor status")
    } finally {
      setShowToggleModal(false)
      setMentorToToggle(null)
    }
  }

  const handleDelete = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId)
    if (mentor) {
      setMentorToDelete(mentor)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    if (!mentorToDelete) return

    try {
      const response = await fetch(`/api/mentors/${mentorToDelete.slug}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        // Remove from local state
        setMentors(prev => prev.filter(mentor => mentor.id !== mentorToDelete.id))
        toast.success("Mentor deleted successfully!")
      } else {
        console.error("Failed to delete mentor:", data.error)
        toast.error("Failed to delete mentor. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting mentor:", error)
      toast.error("Failed to delete mentor. Please try again.")
    } finally {
      setShowDeleteModal(false)
      setMentorToDelete(null)
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = !searchTerm || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <div className="min-h-screen bg-gray-50 pt-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mentors Management</h1>
                  <p className="text-gray-600 mt-1">Manage mentor profiles and information</p>
                </div>
                <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="h-10 bg-gray-300 rounded flex-1 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded w-40 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mentors List */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-6 animate-pulse">
                    <div className="flex items-start justify-between gap-4">
                      {/* Image Skeleton */}
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px] text-gray-900"
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredMentors.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Profile Image */}
                      {mentor.profileImage ? (
                        <div className="flex-shrink-0">
                          <img
                            src={mentor.profileImage}
                            alt={mentor.name}
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            mentor.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {mentor.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{mentor.email}</p>
                        {mentor.bio && (
                          <p className="text-gray-600 mt-2 line-clamp-2">{mentor.bio}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                          {mentor.company && (
                            <>
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                <span>{mentor.company}</span>
                              </div>
                              <span>•</span>
                            </>
                          )}
                          {mentor.location && (
                            <>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{mentor.location}</span>
                              </div>
                              <span>•</span>
                            </>
                          )}
                          {mentor.experience && (
                            <>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{mentor.experience}</span>
                              </div>
                            </>
                          )}
                        </div>
                        {mentor.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {mentor.specialties.slice(0, 3).map((specialty, idx) => (
                              <span
                                key={idx}
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
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleActive(mentor.id, mentor.isActive)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            mentor.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={mentor.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {mentor.isActive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </motion.button>
                        <Link href={`/admin/mentors/${mentor.slug}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(mentor.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Mentor</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mentorToDelete?.name}</p>
                    <p className="text-sm text-gray-600">{mentorToDelete?.email}</p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  Are you sure you want to delete this mentor? This action cannot be undone and will permanently remove all mentor data.
                </p>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Mentor
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toggle Status Confirmation Modal */}
      <AnimatePresence>
        {showToggleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mentorToToggle?.isActive ? 'Deactivate' : 'Activate'} Mentor
                </h3>
                <button
                  onClick={() => setShowToggleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {mentorToToggle?.profileImage ? (
                      <img
                        src={mentorToToggle.profileImage}
                        alt={mentorToToggle.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold text-sm">
                        {mentorToToggle?.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mentorToToggle?.name}</p>
                    <p className="text-sm text-gray-600">{mentorToToggle?.email}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to {mentorToToggle?.isActive ? 'deactivate' : 'activate'} this mentor? 
                {mentorToToggle?.isActive 
                  ? ' They will no longer appear in public listings.' 
                  : ' They will become visible in public listings.'
                }
              </p>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowToggleModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmToggleActive}
                  className={`flex-1 ${
                    mentorToToggle?.isActive 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {mentorToToggle?.isActive ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Deactivate Mentor
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Activate Mentor
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default AdminMentorsPage
