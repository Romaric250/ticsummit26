"use client"

import { useState, useEffect, use } from "react"
import { 
  ArrowLeft,
  Upload,
  X,
  Plus,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { useUploadThing } from "@/lib/uploadthing"

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
  socialLinks?: Record<string, string>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FormData {
  name: string
  email: string
  slug: string
  profileImage: string
  bio: string
  graduationYear: string
  currentRole: string
  company: string
  location: string
  achievements: string[]
  socialLinks: {
    linkedin: string
    twitter: string
    github: string
    website: string
  }
}

const EditAlumniPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  const [alumnus, setAlumnus] = useState<Alumni | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    slug: "",
    profileImage: "",
    bio: "",
    graduationYear: "",
    currentRole: "",
    company: "",
    location: "",
    achievements: [],
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
      website: ""
    }
  })
  const [newAchievement, setNewAchievement] = useState("")
  const [imageUploading, setImageUploading] = useState(false)
  
  const { startUpload } = useUploadThing("alumniImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        setFormData(prev => ({ ...prev, profileImage: res[0].url }))
        toast.success("Image uploaded successfully!")
      }
      setImageUploading(false)
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`)
      setImageUploading(false)
    },
  })

  useEffect(() => {
    fetchAlumnus()
  }, [id])

  const fetchAlumnus = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/alumni/${id}`)
      const data = await response.json()
      
      if (data.success) {
        const alumnusData = data.data
        setAlumnus(alumnusData)
        setFormData({
          name: alumnusData.name || "",
          email: alumnusData.email || "",
          slug: alumnusData.slug || "",
          profileImage: alumnusData.profileImage || "",
          bio: alumnusData.bio || "",
          graduationYear: alumnusData.graduationYear?.toString() || "",
          currentRole: alumnusData.currentRole || "",
          company: alumnusData.company || "",
          location: alumnusData.location || "",
          achievements: alumnusData.achievements || [],
          socialLinks: {
            linkedin: alumnusData.socialLinks?.linkedin || "",
            twitter: alumnusData.socialLinks?.twitter || "",
            github: alumnusData.socialLinks?.github || "",
            website: alumnusData.socialLinks?.website || ""
          }
        })
      } else {
        setError(data.error || "Failed to load alumni")
      }
    } catch (err) {
      console.error("Error fetching alumni:", err)
      setError("Failed to load alumni")
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const addAchievement = () => {
    if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }))
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.slug) {
      toast.error("Name, email, and slug are required")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/alumni/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
          socialLinks: Object.fromEntries(
            Object.entries(formData.socialLinks).filter(([_, value]) => value.trim() !== "")
          )
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Alumni updated successfully!")
        // Redirect to alumni list
        window.location.href = "/admin/alumni"
      } else {
        toast.error(data.error || "Failed to update alumni")
      }
    } catch (error) {
      console.error("Error updating alumni:", error)
      toast.error("Failed to update alumni")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading alumni...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !alumnus) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Award className="w-16 h-16 mx-auto mb-2" />
              <p className="text-lg font-semibold">Failed to load alumni</p>
              <p className="text-sm text-gray-600">{error || "The alumni profile you're looking for doesn't exist."}</p>
            </div>
            <Link href="/admin/alumni">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Alumni
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/alumni" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Alumni
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Alumni</h1>
              <p className="text-gray-600 mt-1">{alumnus.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="url-friendly-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Used in the alumni profile URL</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., 2023"
                    min="2000"
                    max="2030"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Image</h2>
              
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      // Validate file size (4MB max)
                      if (file.size > 4 * 1024 * 1024) {
                        toast.error("File size must be less than 4MB")
                        return
                      }
                      
                      setImageUploading(true)
                      try {
                        await startUpload([file])
                      } catch (error) {
                        console.error("Upload error:", error)
                        toast.error("Failed to upload image")
                        setImageUploading(false)
                      }
                      // Reset input
                      if (e.target) {
                        e.target.value = ""
                      }
                    }}
                    className="hidden"
                    disabled={imageUploading}
                  />
                  <label
                    htmlFor="profileImage"
                    className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer text-sm font-medium ${
                      imageUploading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {imageUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px, max 4MB</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={formData.currentRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., Google"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Biography</h2>
              
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Tell us about this alumni's journey and achievements..."
              />
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Add an achievement..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                  />
                  <Button type="button" onClick={addAchievement} disabled={!newAchievement.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.achievements.length > 0 && (
                  <div className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-900">{achievement}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, github: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.website}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, website: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin/alumni">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={submitting || !formData.name || !formData.email || !formData.slug}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Alumni"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default EditAlumniPage
