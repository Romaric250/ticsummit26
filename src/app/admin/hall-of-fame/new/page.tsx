"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { TechStackInput } from "@/components/ui/TechStackInput"
import Link from "next/link"

interface ProjectFormData {
  title: string
  description: string
  image: string
  techStack: string[]
  category: string
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "FINALIST" | "WINNER"
  phase: string
}

const AddProjectPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    image: "",
    techStack: [],
    category: "",
    status: "SUBMITTED",
    phase: ""
  })

  const categories = ["Web", "Mobile", "IoT", "AI", "Blockchain", "Other"]
  const statuses = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "FINALIST", "WINNER"]

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
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ProjectFormData, value: string | string[]) => {
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
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        router.push("/admin/hall-of-fame")
      } else {
        console.error("Error creating project:", data.error)
      }
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/hall-of-fame">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Add New Project
                </h1>
                <p className="text-sm text-gray-400">
                  Create a new project for the Hall of Fame
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Project Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Project Image
              </label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => handleInputChange("image", url)}
                disabled={loading}
              />
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                  placeholder="Enter project title"
                />
                {errors.title && (
                  <div className="flex items-center mt-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.category ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="flex items-center mt-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Development Phase
                </label>
                <input
                  type="text"
                  value={formData.phase}
                  onChange={(e) => handleInputChange("phase", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Prototype, MVP, Production"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none ${
                  errors.description ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                }`}
                placeholder="Describe the project, its features, impact, and what makes it special..."
              />
              {errors.description && (
                <div className="flex items-center mt-1 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technology Stack
              </label>
              <TechStackInput
                value={formData.techStack}
                onChange={(techStack) => handleInputChange("techStack", techStack)}
                placeholder="Add technologies used (e.g., React, Python, etc.)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              <Link href="/admin/hall-of-fame">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AddProjectPage