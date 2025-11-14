"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Search, 
  Trash2,
  Mail,
  Phone,
  School,
  Calendar,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  Edit,
  Star,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"
import { useUploadThing } from "@/lib/uploadthing"
import Image from "next/image"

interface Applicant {
  id: string
  name: string
  email: string
  age: string
  phone: string
  school: string
  currentGrade: string
  message?: string
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED"
  createdAt: string
  updatedAt: string
}

interface SuccessStory {
  id: string
  name: string
  age: number
  school: string
  achievement: string
  quote: string
  profilePhoto?: string
  fullStory: string
  programYear: string
  currentStatus: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const AdminApplicantsPage = () => {
  const [activeTab, setActiveTab] = useState<"applicants" | "stories">("applicants")
  
  // Applicants state
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [applicantToDelete, setApplicantToDelete] = useState<Applicant | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [applicantToUpdate, setApplicantToUpdate] = useState<Applicant | null>(null)
  const [selectedNewStatus, setSelectedNewStatus] = useState<Applicant["status"]>("PENDING")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  // Success Stories state
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [storiesLoading, setStoriesLoading] = useState(false)
  const [showStoryForm, setShowStoryForm] = useState(false)
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null)
  const [storyFormData, setStoryFormData] = useState({
    name: "",
    age: "",
    school: "",
    achievement: "",
    quote: "",
    profilePhoto: "",
    fullStory: "",
    programYear: "",
    currentStatus: "",
    order: 0,
    isActive: true
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showDeleteStoryModal, setShowDeleteStoryModal] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<SuccessStory | null>(null)
  
  // Image upload using UploadThing
  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        setStoryFormData({ ...storyFormData, profilePhoto: res[0].url })
        setImagePreview(res[0].url)
        toast.success("Image uploaded successfully!")
      }
      setUploadingImage(false)
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
      setUploadingImage(false)
    },
  })

  useEffect(() => {
    if (activeTab === "applicants") {
      fetchApplicants()
    } else {
      fetchStories()
    }
  }, [selectedStatus, activeTab])

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = selectedStatus === "all" 
        ? "/api/techgirls-applicants"
        : `/api/techgirls-applicants?status=${selectedStatus}`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setApplicants(data.data)
      } else {
        setError("Failed to load applicants")
      }
    } catch (err) {
      console.error("Error fetching applicants:", err)
      setError("Failed to load applicants")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = (applicant: Applicant) => {
    setApplicantToUpdate(applicant)
    setSelectedNewStatus(applicant.status)
    setShowStatusModal(true)
  }

  const confirmUpdateStatus = async () => {
    if (!applicantToUpdate) return

    try {
      const response = await fetch(`/api/techgirls-applicants/${applicantToUpdate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: selectedNewStatus
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setApplicants(prev => prev.map(applicant => 
          applicant.id === applicantToUpdate.id 
            ? { ...applicant, status: selectedNewStatus }
            : applicant
        ))
        toast.success(`Applicant status updated to ${selectedNewStatus}`)
      } else {
        toast.error("Failed to update applicant status")
      }
    } catch (error) {
      console.error("Error updating applicant status:", error)
      toast.error("Failed to update applicant status")
    } finally {
      setShowStatusModal(false)
      setApplicantToUpdate(null)
    }
  }

  const handleDelete = (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId)
    if (applicant) {
      setApplicantToDelete(applicant)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    if (!applicantToDelete) return

    try {
      const response = await fetch(`/api/techgirls-applicants/${applicantToDelete.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setApplicants(prev => prev.filter(applicant => applicant.id !== applicantToDelete.id))
        toast.success("Applicant deleted successfully!")
      } else {
        console.error("Failed to delete applicant:", data.error)
        toast.error("Failed to delete applicant. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting applicant:", error)
      toast.error("Failed to delete applicant. Please try again.")
    } finally {
      setShowDeleteModal(false)
      setApplicantToDelete(null)
    }
  }

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setShowDetailsModal(true)
  }

  // Success Stories functions
  const fetchStories = async () => {
    try {
      setStoriesLoading(true)
      // Fetch all stories (including inactive) for admin
      const response = await fetch("/api/techgirls-success-stories/admin")
      const data = await response.json()
      
      if (data.success) {
        setStories(data.data)
      } else {
        toast.error("Failed to load success stories")
      }
    } catch (err) {
      console.error("Error fetching stories:", err)
      toast.error("Failed to load success stories")
    } finally {
      setStoriesLoading(false)
    }
  }

  const handleAddStory = () => {
    setEditingStory(null)
    setStoryFormData({
      name: "",
      age: "",
      school: "",
      achievement: "",
      quote: "",
      profilePhoto: "",
      fullStory: "",
      programYear: "",
      currentStatus: "",
      order: 0,
      isActive: true
    })
    setImagePreview(null)
    setShowStoryForm(true)
  }

  const handleEditStory = (story: SuccessStory) => {
    setEditingStory(story)
    setStoryFormData({
      name: story.name,
      age: story.age.toString(),
      school: story.school,
      achievement: story.achievement,
      quote: story.quote,
      profilePhoto: story.profilePhoto || "",
      fullStory: story.fullStory,
      programYear: story.programYear,
      currentStatus: story.currentStatus,
      order: story.order,
      isActive: story.isActive
    })
    setImagePreview(story.profilePhoto || null)
    setShowStoryForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 4MB for UploadThing profileImage)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size must be less than 4MB")
      return
    }

    try {
      setUploadingImage(true)
      await startUpload([file])
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
      setUploadingImage(false)
    }
  }

  const handleSaveStory = async () => {
    try {
      // Validate required fields on client side
      if (!storyFormData.name?.trim() || 
          !storyFormData.age || 
          !storyFormData.school?.trim() || 
          !storyFormData.achievement?.trim() || 
          !storyFormData.quote?.trim() || 
          !storyFormData.fullStory?.trim() || 
          !storyFormData.programYear?.trim() || 
          !storyFormData.currentStatus?.trim()) {
        toast.error("Please fill in all required fields")
        return
      }

      const url = editingStory 
        ? `/api/techgirls-success-stories/${editingStory.id}`
        : "/api/techgirls-success-stories"
      
      const method = editingStory ? "PATCH" : "POST"

      const payload = {
        name: storyFormData.name.trim(),
        age: storyFormData.age.toString().trim(),
        school: storyFormData.school.trim(),
        achievement: storyFormData.achievement.trim(),
        quote: storyFormData.quote.trim(),
        fullStory: storyFormData.fullStory.trim(),
        programYear: storyFormData.programYear.trim(),
        currentStatus: storyFormData.currentStatus.trim(),
        profilePhoto: storyFormData.profilePhoto?.trim() || null,
        order: parseInt(storyFormData.order.toString()) || 0,
        isActive: storyFormData.isActive
      }

      console.log("Sending payload:", payload) // Debug log

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingStory ? "Story updated successfully!" : "Story created successfully!")
        setShowStoryForm(false)
        fetchStories()
      } else {
        console.error("API Error:", data) // Debug log
        toast.error(data.error || "Failed to save story")
      }
    } catch (error) {
      console.error("Error saving story:", error)
      toast.error("Failed to save story")
    }
  }

  const handleDeleteStory = (story: SuccessStory) => {
    setStoryToDelete(story)
    setShowDeleteStoryModal(true)
  }

  const confirmDeleteStory = async () => {
    if (!storyToDelete) return

    try {
      const response = await fetch(`/api/techgirls-success-stories/${storyToDelete.id}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Story deleted successfully!")
        setStories(prev => prev.filter(s => s.id !== storyToDelete.id))
      } else {
        toast.error("Failed to delete story")
      }
    } catch (error) {
      console.error("Error deleting story:", error)
      toast.error("Failed to delete story")
    } finally {
      setShowDeleteStoryModal(false)
      setStoryToDelete(null)
    }
  }

  const toggleStoryActive = async (story: SuccessStory) => {
    try {
      const response = await fetch(`/api/techgirls-success-stories/${story.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isActive: !story.isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        setStories(prev => prev.map(s => 
          s.id === story.id ? { ...s, isActive: !s.isActive } : s
        ))
        toast.success(`Story ${!story.isActive ? "activated" : "deactivated"} successfully!`)
      } else {
        toast.error("Failed to update story")
      }
    } catch (error) {
      console.error("Error updating story:", error)
      toast.error("Failed to update story")
    }
  }

  const getStatusBadge = (status: Applicant["status"]) => {
    const badges = {
      PENDING: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      REVIEWED: { icon: Eye, color: "bg-blue-100 text-blue-800", label: "Reviewed" },
      ACCEPTED: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Accepted" },
      REJECTED: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Rejected" }
    }
    const badge = badges[status]
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    )
  }

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = !searchTerm || 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.phone.includes(searchTerm)
    
    return matchesSearch
  })

  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === "PENDING").length,
    accepted: applicants.filter(a => a.status === "ACCEPTED").length,
    rejected: applicants.filter(a => a.status === "REJECTED").length
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading applicants...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Tech Girls</h1>
                <p className="text-gray-600 mt-1">Manage applicants and success stories</p>
              </div>
              {activeTab === "stories" && (
                <Button onClick={handleAddStory} className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Success Story
                </Button>
              )}
            </div>
            
            {/* Tabs */}
            <div className="mt-6 flex space-x-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("applicants")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "applicants"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Applicants
              </button>
              <button
                onClick={() => setActiveTab("stories")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "stories"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Success Stories
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "applicants" ? (
          <>
            {/* Stats */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Applicants</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-sm text-yellow-600 mb-1">Pending</div>
                    <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600 mb-1">Accepted</div>
                    <div className="text-2xl font-bold text-green-900">{stats.accepted}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-sm text-red-600 mb-1">Rejected</div>
                    <div className="text-2xl font-bold text-red-900">{stats.rejected}</div>
                  </div>
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
                      placeholder="Search applicants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white min-w-[150px] text-gray-900"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applicants List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {filteredApplicants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No applications have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredApplicants.map((applicant) => (
                  <motion.div
                    key={applicant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
                          {getStatusBadge(applicant.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{applicant.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{applicant.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4" />
                            <span>{applicant.school}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Age: {applicant.age} • Grade: {applicant.currentGrade}</span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Applied: {new Date(applicant.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(applicant)}
                          className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <select
                          value={applicant.status}
                          onChange={(e) => {
                            const updatedApplicant = { ...applicant, status: e.target.value as Applicant["status"] }
                            handleUpdateStatus(updatedApplicant)
                          }}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(applicant.id)}
                          className="bg-white hover:bg-red-50 border-gray-300 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
          </>
        ) : (
          <>
            {/* Success Stories List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {storiesLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-600">Loading stories...</p>
                </div>
              ) : stories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No success stories</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first success story</p>
                  <Button onClick={handleAddStory} className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Success Story
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {stories.map((story) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              {story.profilePhoto ? (
                                <img 
                                  src={story.profilePhoto} 
                                  alt={story.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold">
                                  {story.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                                <p className="text-sm text-gray-600">Age {story.age} • {story.school}</p>
                              </div>
                              {story.isActive ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <EyeOff className="w-3 h-3" />
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{story.achievement}</p>
                            <p className="text-gray-600 italic">"{story.quote}"</p>
                            <div className="mt-3 text-xs text-gray-500">
                              Program Year: {story.programYear} • Order: {story.order}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStory(story)}
                              className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleStoryActive(story)}
                              className={`bg-white hover:bg-gray-50 border-gray-300 transition-colors ${
                                story.isActive ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"
                              }`}
                            >
                              {story.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStory(story)}
                              className="bg-white hover:bg-red-50 border-gray-300 text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Story Form Modal */}
        <AnimatePresence>
          {showStoryForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowStoryForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingStory ? "Edit Success Story" : "Add Success Story"}
                  </h3>
                  <button
                    onClick={() => setShowStoryForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={storyFormData.name}
                        onChange={(e) => setStoryFormData({ ...storyFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                      <input
                        type="number"
                        value={storyFormData.age}
                        onChange={(e) => setStoryFormData({ ...storyFormData, age: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
                      <input
                        type="text"
                        value={storyFormData.school}
                        onChange={(e) => setStoryFormData({ ...storyFormData, school: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo *</label>
                      <div className="space-y-3">
                        {/* File Upload */}
                        <div className="flex items-start gap-4">
                          <label className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition-colors ${
                            uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                          }`}>
                            {uploadingImage ? (
                              <div className="flex flex-col items-center justify-center p-4">
                                <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <span className="text-xs text-gray-600">Uploading...</span>
                              </div>
                            ) : imagePreview || storyFormData.profilePhoto ? (
                              <div className="relative w-full h-full group">
                                <Image
                                  src={imagePreview || storyFormData.profilePhoto}
                                  alt="Profile preview"
                                  width={128}
                                  height={128}
                                  className="w-full h-full rounded-lg object-cover"
                                  onError={() => {
                                    setImagePreview(null)
                                    setStoryFormData({ ...storyFormData, profilePhoto: "" })
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs text-center px-2">Change Image</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-4">
                                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-xs text-gray-600 text-center">Upload Image</span>
                                <span className="text-xs text-gray-400 mt-1">Max 4MB</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                          
                          {/* URL Input Alternative */}
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Or paste image URL:</p>
                            <input
                              type="url"
                              value={storyFormData.profilePhoto}
                              onChange={(e) => {
                                const url = e.target.value
                                setStoryFormData({ ...storyFormData, profilePhoto: url })
                                setImagePreview(url)
                              }}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 text-sm"
                            />
                            {storyFormData.profilePhoto && (
                              <button
                                type="button"
                                onClick={() => {
                                  setStoryFormData({ ...storyFormData, profilePhoto: "" })
                                  setImagePreview(null)
                                }}
                                className="mt-2 text-xs text-red-600 hover:text-red-700"
                              >
                                Remove image
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievement *</label>
                      <input
                        type="text"
                        value={storyFormData.achievement}
                        onChange={(e) => setStoryFormData({ ...storyFormData, achievement: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program Year *</label>
                      <input
                        type="text"
                        value={storyFormData.programYear}
                        onChange={(e) => setStoryFormData({ ...storyFormData, programYear: e.target.value })}
                        placeholder="2023-2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Status *</label>
                      <input
                        type="text"
                        value={storyFormData.currentStatus}
                        onChange={(e) => setStoryFormData({ ...storyFormData, currentStatus: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input
                        type="number"
                        value={storyFormData.order}
                        onChange={(e) => setStoryFormData({ ...storyFormData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
                    <textarea
                      value={storyFormData.quote}
                      onChange={(e) => setStoryFormData({ ...storyFormData, quote: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Story *</label>
                    <textarea
                      value={storyFormData.fullStory}
                      onChange={(e) => setStoryFormData({ ...storyFormData, fullStory: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={storyFormData.isActive}
                      onChange={(e) => setStoryFormData({ ...storyFormData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active (visible on website)</label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button variant="outline" onClick={() => setShowStoryForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveStory} className="bg-gray-900 hover:bg-gray-800 text-white">
                    {editingStory ? "Update Story" : "Create Story"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Story Modal */}
        <AnimatePresence>
          {showDeleteStoryModal && storyToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowDeleteStoryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Success Story</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the success story for <strong>{storyToDelete.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowDeleteStoryModal(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDeleteStory}>
                    Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && applicantToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Applicant</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the application from <strong>{applicantToDelete.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={confirmDelete}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedApplicant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Applicant Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedApplicant.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedApplicant.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedApplicant.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">{selectedApplicant.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">School</label>
                    <p className="text-gray-900">{selectedApplicant.school}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Grade</label>
                    <p className="text-gray-900">{selectedApplicant.currentGrade}</p>
                  </div>
                  {selectedApplicant.message && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Message</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedApplicant.message}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedApplicant.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applied On</label>
                    <p className="text-gray-900">{new Date(selectedApplicant.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default AdminApplicantsPage

