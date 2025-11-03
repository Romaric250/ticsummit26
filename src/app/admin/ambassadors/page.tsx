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
  School,
  X,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Ambassador {
  id: string
  slug: string
  name: string
  email: string
  profileImage?: string
  bio?: string
  school: string
  contactInfo?: string
  socialLinks?: any
  ticPoints: number
  spotlightContributions?: any
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const AdminAmbassadorsPage = () => {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [ambassadorToDelete, setAmbassadorToDelete] = useState<Ambassador | null>(null)
  const [showToggleModal, setShowToggleModal] = useState(false)
  const [ambassadorToToggle, setAmbassadorToToggle] = useState<Ambassador | null>(null)
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  useEffect(() => {
    fetchAmbassadors()
  }, [])

  const fetchAmbassadors = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ambassadors")
      const data = await response.json()
      
      if (data.success) {
        setAmbassadors(data.data)
      } else {
        setError("Failed to load ambassadors")
      }
    } catch (err) {
      console.error("Error fetching ambassadors:", err)
      setError("Failed to load ambassadors")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = (ambassadorId: string, currentStatus: boolean) => {
    const ambassador = ambassadors.find(a => a.id === ambassadorId)
    if (!ambassador) return
    
    setAmbassadorToToggle(ambassador)
    setShowToggleModal(true)
  }

  const confirmToggleActive = async () => {
    if (!ambassadorToToggle) return

    try {
      const response = await fetch(`/api/ambassadors/${ambassadorToToggle.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...ambassadorToToggle,
          isActive: !ambassadorToToggle.isActive
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setAmbassadors(prev => prev.map(ambassador => 
          ambassador.id === ambassadorToToggle.id 
            ? { ...ambassador, isActive: !ambassadorToToggle.isActive }
            : ambassador
        ))
        toast.success(`Ambassador ${ambassadorToToggle.isActive ? 'deactivated' : 'activated'} successfully!`)
      } else {
        toast.error("Failed to update ambassador status")
      }
    } catch (error) {
      console.error("Error toggling ambassador status:", error)
      toast.error("Failed to update ambassador status")
    } finally {
      setShowToggleModal(false)
      setAmbassadorToToggle(null)
    }
  }

  const handleDelete = (ambassadorId: string) => {
    const ambassador = ambassadors.find(a => a.id === ambassadorId)
    if (ambassador) {
      setAmbassadorToDelete(ambassador)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    if (!ambassadorToDelete) return

    try {
      const response = await fetch(`/api/ambassadors/${ambassadorToDelete.slug}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setAmbassadors(prev => prev.filter(ambassador => ambassador.id !== ambassadorToDelete.id))
        toast.success("Ambassador deleted successfully!")
      } else {
        console.error("Failed to delete ambassador:", data.error)
        toast.error("Failed to delete ambassador. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting ambassador:", error)
      toast.error("Failed to delete ambassador. Please try again.")
    } finally {
      setShowDeleteModal(false)
      setAmbassadorToDelete(null)
    }
  }

  const filteredAmbassadors = ambassadors.filter(ambassador => {
    const matchesSearch = !searchTerm || 
      ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassador.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassador.school.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSchool = !selectedSchool || ambassador.school === selectedSchool
    const matchesActive = showActiveOnly ? ambassador.isActive : true

    return matchesSearch && matchesSchool && matchesActive
  })

  const schools = [...new Set(ambassadors.map(a => a.school).filter(Boolean))]

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-full mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-300 rounded"></div>
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
                <h1 className="text-2xl font-bold text-gray-900">Ambassadors Management</h1>
                <p className="text-gray-600 mt-1">Manage ambassador profiles and TIC points</p>
              </div>
              <Link href="/admin/ambassadors/new">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Ambassador
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
                  placeholder="Search ambassadors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* School Filter */}
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px] text-gray-900"
                >
                  <option value="">All Schools</option>
                  {schools.map(school => (
                    <option key={school} value={school}>{school}</option>
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
                    <p className="text-sm font-medium text-blue-600">Total Ambassadors</p>
                    <p className="text-2xl font-bold text-blue-900">{ambassadors.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {ambassadors.filter(a => a.isActive).length}
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
                      {ambassadors.filter(a => !a.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Total Points</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {ambassadors.reduce((sum, a) => sum + a.ticPoints, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambassadors List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Users className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">Failed to load ambassadors</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <Button onClick={fetchAmbassadors} className="bg-gray-900 hover:bg-gray-800 text-white">
                Try Again
              </Button>
            </div>
          ) : filteredAmbassadors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">No ambassadors found</p>
                <p className="text-sm text-gray-600">
                  {searchTerm || selectedSchool ? "Try adjusting your search criteria" : "No ambassadors have been added yet"}
                </p>
              </div>
              {!searchTerm && !selectedSchool && (
                <Link href="/admin/ambassadors/new">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Ambassador
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredAmbassadors.map((ambassador, index) => (
                  <motion.div
                    key={ambassador.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Profile Image */}
                      {ambassador.profileImage ? (
                        <div className="flex-shrink-0">
                          <Image
                            src={ambassador.profileImage}
                            alt={ambassador.name}
                            width={128}
                            height={128}
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
                          <h3 className="text-lg font-semibold text-gray-900">{ambassador.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            ambassador.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ambassador.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{ambassador.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <School className="w-4 h-4" />
                            <span>{ambassador.school}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-gray-900">{ambassador.ticPoints} TIC Points</span>
                          </div>
                        </div>
                        {ambassador.bio && (
                          <p className="text-gray-600 mt-2 line-clamp-2">{ambassador.bio}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleActive(ambassador.id, ambassador.isActive)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            ambassador.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={ambassador.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {ambassador.isActive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </motion.button>
                        <Link href={`/admin/ambassadors/${ambassador.slug}`}>
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
                          onClick={() => handleDelete(ambassador.id)}
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Ambassador</h3>
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
                    <p className="font-medium text-gray-900">{ambassadorToDelete?.name}</p>
                    <p className="text-sm text-gray-600">{ambassadorToDelete?.email}</p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  Are you sure you want to delete this ambassador? This action cannot be undone and will permanently remove all ambassador data.
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
                    Delete Ambassador
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
                  {ambassadorToToggle?.isActive ? 'Deactivate' : 'Activate'} Ambassador
                </h3>
                <button
                  onClick={() => setShowToggleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {ambassadorToToggle?.profileImage ? (
                      <Image
                        src={ambassadorToToggle.profileImage}
                        alt={ambassadorToToggle.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold text-sm">
                        {ambassadorToToggle?.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ambassadorToToggle?.name}</p>
                    <p className="text-sm text-gray-600">{ambassadorToToggle?.email}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to {ambassadorToToggle?.isActive ? 'deactivate' : 'activate'} this ambassador? 
                {ambassadorToToggle?.isActive 
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
                    ambassadorToToggle?.isActive 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {ambassadorToToggle?.isActive ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Deactivate Ambassador
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Activate Ambassador
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

export default AdminAmbassadorsPage

