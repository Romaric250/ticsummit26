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
  MoreVertical,
  X,
  GraduationCap,
  Briefcase,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"
import { AlumniListSkeleton } from "@/components/ui/AlumniSkeleton"

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

const AdminAlumniPage = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [alumnusToDelete, setAlumnusToDelete] = useState<Alumni | null>(null)
  const [showToggleModal, setShowToggleModal] = useState(false)
  const [alumnusToToggle, setAlumnusToToggle] = useState<Alumni | null>(null)
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  useEffect(() => {
    fetchAlumni()
  }, [])

  const fetchAlumni = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/alumni")
      const data = await response.json()
      
      if (data.success) {
        setAlumni(data.data)
      } else {
        setError("Failed to load alumni")
      }
    } catch (err) {
      console.error("Error fetching alumni:", err)
      setError("Failed to load alumni")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = (alumnusId: string) => {
    const alumnus = alumni.find(a => a.id === alumnusId)
    if (!alumnus) return
    
    setAlumnusToToggle(alumnus)
    setShowToggleModal(true)
  }

  const confirmToggleStatus = async () => {
    if (!alumnusToToggle) return

    try {
      const response = await fetch(`/api/alumni/${alumnusToToggle.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...alumnusToToggle,
          isActive: !alumnusToToggle.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        setAlumni(prev => prev.map(a => 
          a.id === alumnusToToggle.id 
            ? { ...a, isActive: !a.isActive }
            : a
        ))
        toast.success(`Alumnus ${alumnusToToggle.isActive ? 'deactivated' : 'activated'} successfully!`)
      } else {
        toast.error("Failed to update alumnus status")
      }
    } catch (error) {
      console.error("Error toggling alumnus status:", error)
      toast.error("Failed to update alumnus status")
    } finally {
      setShowToggleModal(false)
      setAlumnusToToggle(null)
    }
  }

  const handleDelete = (alumnusId: string) => {
    const alumnus = alumni.find(a => a.id === alumnusId)
    if (alumnus) {
      setAlumnusToDelete(alumnus)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    if (!alumnusToDelete) return

    try {
      const response = await fetch(`/api/alumni/${alumnusToDelete.slug}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        // Remove from local state
        setAlumni(prev => prev.filter(alumnus => alumnus.id !== alumnusToDelete.id))
        toast.success("Alumnus deleted successfully!")
      } else {
        console.error("Failed to delete alumnus:", data.error)
        toast.error("Failed to delete alumnus. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting alumnus:", error)
      toast.error("Failed to delete alumnus. Please try again.")
    } finally {
      setShowDeleteModal(false)
      setAlumnusToDelete(null)
    }
  }

  const filteredAlumni = alumni.filter(alumnus => {
    const matchesSearch = !searchTerm || 
      alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.currentRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.company?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = !selectedLocation || alumnus.location === selectedLocation
    const matchesActive = !showActiveOnly || alumnus.isActive

    return matchesSearch && matchesLocation && matchesActive
  })

  const locations = [...new Set(alumni.map(a => a.location).filter(Boolean))]

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Alumni Management</h1>
                  <p className="text-gray-600 mt-1">Manage alumni profiles and information</p>
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

          {/* Alumni Grid */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AlumniListSkeleton count={6} />
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
                <h1 className="text-2xl font-bold text-gray-900">Alumni Management</h1>
                <p className="text-gray-600 mt-1">Manage alumni profiles and information</p>
              </div>
              <Link href="/admin/alumni/new">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Alumni
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search alumni..."
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
                    <p className="text-sm font-medium text-blue-600">Total Alumni</p>
                    <p className="text-2xl font-bold text-blue-900">{alumni.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Active Alumni</p>
                    <p className="text-2xl font-bold text-green-900">{alumni.filter(a => a.isActive).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">With Profile Images</p>
                    <p className="text-2xl font-bold text-purple-900">{alumni.filter(a => a.profileImage).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Briefcase className="w-8 h-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600">With Current Role</p>
                    <p className="text-2xl font-bold text-orange-900">{alumni.filter(a => a.currentRole).length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Failed to load alumni</p>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
                <Button onClick={fetchAlumni} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Try Again
                </Button>
              </div>
            ) : filteredAlumni.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {alumni.length === 0 ? "No alumni yet" : "No alumni found"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {alumni.length === 0 
                    ? "Get started by adding your first alumni profile." 
                    : "Try adjusting your search criteria."}
                </p>
                {alumni.length === 0 && (
                  <Link href="/admin/alumni/new">
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Alumni
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alumnus) => (
                  <motion.div
                    key={alumnus.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {alumnus.profileImage ? (
                            <img
                              src={alumnus.profileImage}
                              alt={alumnus.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{alumnus.name}</h3>
                          <p className="text-sm text-gray-600">{alumnus.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleStatus(alumnus.id)}
                            className={`p-1 rounded-full ${
                              alumnus.isActive 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {alumnus.isActive ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <div className="relative">
                            <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {alumnus.currentRole && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{alumnus.currentRole}</span>
                          </div>
                        )}
                        {alumnus.company && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{alumnus.company}</span>
                          </div>
                        )}
                        {alumnus.location && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{alumnus.location}</span>
                          </div>
                        )}
                        {alumnus.graduationYear && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <GraduationCap className="w-4 h-4" />
                            <span>Graduated {alumnus.graduationYear}</span>
                          </div>
                        )}
                      </div>

                      {alumnus.bio && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{alumnus.bio}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${alumnus.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm text-gray-600">
                            {alumnus.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/admin/alumni/${alumnus.slug}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(alumnus.id)}
                            className="bg-white text-red-600 border-red-300 hover:bg-white hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Alumni</h3>
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
                      <p className="font-medium text-gray-900">{alumnusToDelete?.name}</p>
                      <p className="text-sm text-gray-600">{alumnusToDelete?.email}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700">
                    Are you sure you want to delete this alumni? This action cannot be undone and will permanently remove all alumni data.
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
                      Delete Alumni
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
                    {alumnusToToggle?.isActive ? 'Deactivate' : 'Activate'} Alumni
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
                      {alumnusToToggle?.profileImage ? (
                        <img
                          src={alumnusToToggle.profileImage}
                          alt={alumnusToToggle.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-600 font-bold text-sm">
                          {alumnusToToggle?.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{alumnusToToggle?.name}</p>
                      <p className="text-sm text-gray-600">{alumnusToToggle?.email}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to {alumnusToToggle?.isActive ? 'deactivate' : 'activate'} this alumni? 
                  {alumnusToToggle?.isActive 
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
                    onClick={confirmToggleStatus}
                    className={`flex-1 ${
                      alumnusToToggle?.isActive 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {alumnusToToggle?.isActive ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Deactivate Alumni
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Activate Alumni
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default AdminAlumniPage
