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
  X,
  Calendar,
  Award,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"
import { TeamFormModal } from "@/components/admin/TeamFormModal"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"

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

const AdminTeamsPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [showToggleModal, setShowToggleModal] = useState(false)
  const [memberToToggle, setMemberToToggle] = useState<TeamMember | null>(null)
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/content/team-members")
      const data = await response.json()
      
      if (data.success) {
        setTeamMembers(data.data)
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

  const handleToggleActive = (memberId: string, currentStatus: boolean) => {
    const member = teamMembers.find(m => m.id === memberId)
    if (!member) return
    
    setMemberToToggle(member)
    setShowToggleModal(true)
  }

  const confirmToggleActive = async () => {
    if (!memberToToggle) return

    try {
      const response = await fetch(`/api/content/team-members/${memberToToggle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...memberToToggle,
          active: !memberToToggle.active
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setTeamMembers(prev => prev.map(member => 
          member.id === memberToToggle.id 
            ? { ...member, active: !memberToToggle.active }
            : member
        ))
        toast.success(`Team member ${memberToToggle.active ? 'deactivated' : 'activated'} successfully!`)
      } else {
        toast.error("Failed to update team member status")
      }
    } catch (error) {
      console.error("Error toggling team member status:", error)
      toast.error("Failed to update team member status")
    } finally {
      setShowToggleModal(false)
      setMemberToToggle(null)
    }
  }

  const handleDelete = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId)
    if (member) {
      setMemberToDelete(member)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    if (!memberToDelete) return

    try {
      const response = await fetch(`/api/content/team-members/${memberToDelete.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setTeamMembers(prev => prev.filter(member => member.id !== memberToDelete.id))
        toast.success("Team member deleted successfully!")
      } else {
        toast.error("Failed to delete team member. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast.error("Failed to delete team member. Please try again.")
    } finally {
      setShowDeleteModal(false)
      setMemberToDelete(null)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setShowFormModal(true)
  }

  const handleAddNew = () => {
    setEditingMember(null)
    setShowFormModal(true)
  }

  const handleFormSuccess = () => {
    fetchTeamMembers()
    setShowFormModal(false)
    setEditingMember(null)
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.bio && member.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesActive = showActiveOnly ? member.active : true

    return matchesSearch && matchesActive
  })

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
                <h1 className="text-2xl font-bold text-gray-900">Teams Management</h1>
                <p className="text-gray-600 mt-1">Manage team member profiles, activities, and achievements</p>
              </div>
              <Button 
                onClick={handleAddNew}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Member
              </Button>
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
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Active Filter */}
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Members</p>
                    <p className="text-2xl font-bold text-blue-900">{teamMembers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {teamMembers.filter(m => m.active).length}
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
                      {teamMembers.filter(m => !m.active).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Users className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">Failed to load team members</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <Button onClick={fetchTeamMembers} className="bg-gray-900 hover:bg-gray-800 text-white">
                Try Again
              </Button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">No team members found</p>
                <p className="text-sm text-gray-600">
                  {searchTerm ? "Try adjusting your search criteria" : "No team members have been added yet"}
                </p>
              </div>
              {!searchTerm && (
                <Button 
                  onClick={handleAddNew}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Member
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredMembers
                  .sort((a, b) => a.order - b.order)
                  .map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Profile Image */}
                      {member.imageUrl ? (
                        <div className="flex-shrink-0">
                          <img
                            src={member.imageUrl}
                            alt={member.name}
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
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            member.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{member.role}</p>
                        {member.bio && (
                          <p className="text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                          {member.email && (
                            <>
                              <span>{member.email}</span>
                              <span>•</span>
                            </>
                          )}
                          {(member.activities && member.activities.length > 0) && (
                            <>
                              <div className="flex items-center gap-1">
                                <Activity className="w-4 h-4" />
                                <span>{member.activities.length} activit{member.activities.length !== 1 ? 'ies' : 'y'}</span>
                              </div>
                              <span>•</span>
                            </>
                          )}
                          {(member.achievements && member.achievements.length > 0) && (
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              <span>{member.achievements.length} achievement{member.achievements.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleActive(member.id, member.active)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            member.active 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={member.active ? 'Deactivate' : 'Activate'}
                        >
                          {member.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(member)}
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(member.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
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

      {/* Form Modal */}
      <TeamFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingMember(null)
        }}
        onSuccess={handleFormSuccess}
        member={editingMember}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && memberToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Team Member</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{memberToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setMemberToDelete(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toggle Active Confirmation Modal */}
      <AnimatePresence>
        {showToggleModal && memberToToggle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {memberToToggle.active ? "Deactivate Team Member" : "Activate Team Member"}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {memberToToggle.active ? 'deactivate' : 'activate'} "{memberToToggle.name}"?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowToggleModal(false)
                    setMemberToToggle(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggleActive}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    memberToToggle.active 
                      ? "bg-yellow-600 hover:bg-yellow-700" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {memberToToggle.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default AdminTeamsPage

