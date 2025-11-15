"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, AlertCircle, Plus, Trash2, Calendar, MapPin, Award, Activity, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload"
import { toast } from "sonner"

interface Activity {
  description: string
  date?: string
  location?: string
}

interface Achievement {
  title: string
  description: string
  images: string[]
  date?: string
}

interface TeamMemberFormData {
  name: string
  slug: string
  role: string
  bio: string
  imageUrl: string
  email: string
  linkedin: string
  twitter: string
  github: string
  activities: Activity[]
  achievements: Achievement[]
  order: number
  active: boolean
}

interface TeamFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  member?: {
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
    activities?: Activity[]
    achievements?: Achievement[]
    order: number
    active: boolean
  } | null
}

export const TeamFormModal = ({ isOpen, onClose, onSuccess, member }: TeamFormModalProps) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: "",
    slug: "",
    role: "",
    bio: "",
    imageUrl: "",
    email: "",
    linkedin: "",
    twitter: "",
    github: "",
    activities: [],
    achievements: [],
    order: 0,
    active: true
  })

  useEffect(() => {
    if (isOpen && member) {
      setFormData({
        name: member.name || "",
        slug: member.slug || "",
        role: member.role || "",
        bio: member.bio || "",
        imageUrl: member.imageUrl || "",
        email: member.email || "",
        linkedin: member.linkedin || "",
        twitter: member.twitter || "",
        github: member.github || "",
        activities: (member.activities as Activity[]) || [],
        achievements: (member.achievements as Achievement[]) || [],
        order: member.order || 0,
        active: member.active !== false
      })
    } else if (isOpen && !member) {
      setFormData({
        name: "",
        slug: "",
        role: "",
        bio: "",
        imageUrl: "",
        email: "",
        linkedin: "",
        twitter: "",
        github: "",
        activities: [],
        achievements: [],
        order: 0,
        active: true
      })
      setErrors({})
    }
  }, [isOpen, member])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleInputChange = (field: keyof TeamMemberFormData, value: string | number | boolean | Activity[] | Achievement[]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      if (field === "name" && typeof value === "string") {
        newData.slug = generateSlug(value)
      }
      
      return newData
    })
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { description: "", date: "", location: "" }]
    }))
  }

  const updateActivity = (index: number, field: keyof Activity, value: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => 
        i === index ? { ...activity, [field]: value } : activity
      )
    }))
  }

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }))
  }

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: "", description: "", images: [], date: "" }]
    }))
  }

  const updateAchievement = (index: number, field: keyof Achievement, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }))
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)

    try {
      const url = member 
        ? `/api/content/team-members/${member.id}` 
        : "/api/content/team-members/create"
      const method = member ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          activities: formData.activities.length > 0 ? formData.activities : null,
          achievements: formData.achievements.length > 0 ? formData.achievements : null
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(member ? "Team member updated successfully" : "Team member created successfully")
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || "Failed to save team member")
      }
    } catch (error) {
      console.error("Error saving team member:", error)
      toast.error("Failed to save team member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {member ? "Edit Team Member" : "New Team Member"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {member ? "Update team member information" : "Add a new team member"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => handleInputChange("imageUrl", url)}
                    disabled={loading}
                    endpoint="teamImage"
                  />
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                        errors.role ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., Co-Founder, Technical Lead"
                    />
                    {errors.role && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.role}
                      </div>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                        errors.slug ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="url-slug"
                    />
                    {errors.slug && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.slug}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biography
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    placeholder="Tell us about this team member..."
                  />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => handleInputChange("github", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                {/* Activities */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-gray-900" />
                      <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addActivity}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Activity
                    </Button>
                  </div>

                  {formData.activities.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No activities added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {formData.activities.map((activity, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Activity {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeActivity(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description *
                              </label>
                              <textarea
                                value={activity.description}
                                onChange={(e) => updateActivity(index, "description", e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                                placeholder="e.g., Organized TIC hackathon in X school"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  value={activity.date || ""}
                                  onChange={(e) => updateActivity(index, "date", e.target.value)}
                                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={activity.location || ""}
                                  onChange={(e) => updateActivity(index, "location", e.target.value)}
                                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                  placeholder="e.g., Yaoundé, Cameroon"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-gray-900" />
                      <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={addAchievement}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Achievement
                    </Button>
                  </div>

                  {formData.achievements.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No achievements added yet</p>
                  ) : (
                    <div className="space-y-6">
                      {formData.achievements.map((achievement, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Achievement {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeAchievement(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Title *
                              </label>
                              <input
                                type="text"
                                value={achievement.title}
                                onChange={(e) => updateAchievement(index, "title", e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="Achievement title"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description *
                              </label>
                              <textarea
                                value={achievement.description}
                                onChange={(e) => updateAchievement(index, "description", e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                                placeholder="Describe this achievement..."
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                value={achievement.date || ""}
                                onChange={(e) => updateAchievement(index, "date", e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-2">
                                Images
                              </label>
                              <MultipleImageUpload
                                value={achievement.images}
                                onChange={(urls) => updateAchievement(index, "images", urls)}
                                disabled={loading}
                                maxFiles={10}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-3 border-t border-gray-200 pt-4">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => handleInputChange("active", e.target.checked)}
                    className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">
                    Active (visible on public pages)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {member ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {member ? "Update Member" : "Create Member"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

