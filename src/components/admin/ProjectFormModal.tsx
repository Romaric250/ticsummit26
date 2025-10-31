"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload"
import { TechStackInput } from "@/components/ui/TechStackInput"
import { MembersInput } from "@/components/ui/MembersInput"
import { toast } from "sonner"

interface ProjectFormData {
  title: string
  description: string
  images: string[]
  techStack: string[]
  members: string[]
  category: string
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "FINALIST" | "WINNER"
  phase: string
  year: number | null
  demoUrl: string
}

interface ProjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId?: string
}

export const ProjectFormModal = ({ isOpen, onClose, onSuccess, projectId }: ProjectFormModalProps) => {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    images: [],
    techStack: [],
    members: [],
    category: "",
    status: "SUBMITTED",
    phase: "",
    year: null,
    demoUrl: ""
  })

  const categories = ["Web", "Mobile", "IoT", "AI", "Blockchain", "Other"]
  const statuses = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "FINALIST", "WINNER"]
  const years = [2021, 2022, 2023, 2024, 2025]

  // Fetch project data when editing
  useEffect(() => {
    if (isOpen && projectId) {
      fetchProject()
    } else if (isOpen && !projectId) {
      // Reset form when creating new
      setFormData({
        title: "",
        description: "",
        images: [],
        techStack: [],
        members: [],
        category: "",
        status: "SUBMITTED",
        phase: "",
        year: null,
        demoUrl: ""
      })
      setErrors({})
    }
  }, [isOpen, projectId])

  const fetchProject = async () => {
    if (!projectId) return
    
    try {
      setFetching(true)
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      
      if (data.success) {
        const project = data.data
        setFormData({
          title: project.title || "",
          description: project.description || "",
          images: project.images || [],
          techStack: project.techStack || [],
          members: project.members || [],
          category: project.category || "",
          status: project.status || "SUBMITTED",
          phase: project.phase || "",
          year: project.year || null,
          demoUrl: project.demoUrl || ""
        })
      } else {
        toast.error("Failed to load project")
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      toast.error("Failed to load project")
    } finally {
      setFetching(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Project title is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    if (!formData.year) {
      newErrors.year = "Year is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ProjectFormData, value: string | string[] | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)

    try {
      const url = projectId ? `/api/projects/${projectId}` : "/api/projects"
      const method = projectId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(projectId ? "Project updated successfully" : "Project created successfully")
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || "Failed to save project")
      }
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("Failed to save project")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {projectId ? "Edit Project" : "Add New Project"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {projectId ? "Update project information" : "Create a new project for the Hall of Fame"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {fetching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Images
                  </label>
                  <MultipleImageUpload
                    value={formData.images}
                    onChange={(urls) => handleInputChange("images", urls)}
                    disabled={loading}
                    maxFiles={10}
                  />
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter project title"
                      disabled={loading}
                    />
                    {errors.title && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.category}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value as any)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phase */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Development Phase
                    </label>
                    <input
                      type="text"
                      value={formData.phase}
                      onChange={(e) => handleInputChange("phase", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Prototype, MVP, Production"
                      disabled={loading}
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.year || ""}
                      onChange={(e) => handleInputChange("year", e.target.value ? parseInt(e.target.value) : null)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.year ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.year && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.year}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Describe the project, its features, impact, and what makes it special..."
                    disabled={loading}
                  />
                  {errors.description && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </div>
                  )}
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technology Stack
                  </label>
                  <TechStackInput
                    value={formData.techStack}
                    onChange={(techStack) => handleInputChange("techStack", techStack)}
                    placeholder="Add technologies used (e.g., React, Python, etc.)"
                  />
                </div>

                {/* Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Members
                  </label>
                  <MembersInput
                    value={formData.members}
                    onChange={(members) => handleInputChange("members", members)}
                    placeholder="Add team members (e.g., John Doe, Jane Smith)"
                  />
                </div>

                {/* Demo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => handleInputChange("demoUrl", e.target.value)}
                    placeholder="https://your-project-demo.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {projectId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {projectId ? "Update Project" : "Create Project"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

