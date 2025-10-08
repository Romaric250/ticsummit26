"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
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

const EditProjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [techInput, setTechInput] = useState("")
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

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const project = data.data
        setFormData({
          title: project.title,
          description: project.description,
          image: project.image || "",
          techStack: project.techStack || [],
          category: project.category,
          status: project.status,
          phase: project.phase || ""
        })
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTechStackAdd = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()]
      }))
      setTechInput("")
    }
  }

  const handleTechStackRemove = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        router.push("/admin/hall-of-fame")
      } else {
        console.error("Error updating project:", data.error)
      }
    } catch (error) {
      console.error("Error updating project:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/admin/hall-of-fame">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Edit Project
            </h1>
            <p className="text-gray-400">
              Update project information
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Project Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter project title"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                  Phase
                </label>
                <input
                  type="text"
                  value={formData.phase}
                  onChange={(e) => handleInputChange("phase", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Prototype, MVP, Production"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Describe the project, its features, and impact..."
              />
            </div>

            {/* Tech Stack */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tech Stack
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleTechStackAdd())}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Add technology (e.g., React, Python, etc.)"
                />
                <Button
                  type="button"
                  onClick={handleTechStackAdd}
                  className="bg-white hover:bg-white text-gray-900 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Tech Stack Tags */}
              {formData.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleTechStackRemove(tech)}
                        className="ml-2 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
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
              disabled={saving}
              className="bg-white hover:bg-white text-gray-900 cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditProjectPage
