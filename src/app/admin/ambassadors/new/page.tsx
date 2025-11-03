"use client"

import { useState } from "react"
import { 
  ArrowLeft,
  Save,
  User,
  Plus,
  X,
  School,
  Star,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { toast } from "sonner"
import Layout from "@/components/layout/Layout"
import { useRouter } from "next/navigation"
import { useUploadThing } from "@/lib/uploadthing"
import Image from "next/image"

const NewAmbassadorPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Image upload
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const { startUpload } = useUploadThing("mentorImage") // Reuse mentor image upload
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    slug: "",
    bio: "",
    school: "",
    contactInfo: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      instagram: "",
      website: ""
    },
    ticPoints: 0,
    spotlightContributions: [] as Array<{ title: string; description: string; date: string }>,
    isActive: true
  })

  const [newContribution, setNewContribution] = useState({
    title: "",
    description: "",
    date: ""
  })

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return

    try {
      setImageUploading(true)
      const uploadedFiles = await startUpload(files)
      
      if (uploadedFiles && uploadedFiles[0]) {
        setProfileImage(uploadedFiles[0].url)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.slug || !formData.school) {
      toast.error("Please fill in all required fields (name, email, slug, and school)")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/ambassadors", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          profileImage,
          spotlightContributions: formData.spotlightContributions.length > 0 
            ? formData.spotlightContributions 
            : []
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Ambassador created successfully!")
        router.push("/admin/ambassadors")
      } else {
        toast.error(`Failed to create ambassador: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating ambassador:", error)
      toast.error("Failed to create ambassador. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addContribution = () => {
    if (newContribution.title.trim() && newContribution.description.trim()) {
      setFormData(prev => ({
        ...prev,
        spotlightContributions: [...prev.spotlightContributions, { ...newContribution }]
      }))
      setNewContribution({ title: "", description: "", date: "" })
    }
  }

  const removeContribution = (index: number) => {
    setFormData(prev => ({
      ...prev,
      spotlightContributions: prev.spotlightContributions.filter((_, i) => i !== index)
    }))
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin/ambassadors">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Ambassador</h1>
                  <p className="text-gray-600 mt-1">Create a new ambassador profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter ambassador name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter ambassador email"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter URL slug (e.g., john-doe)"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be used in the URL: /ambassadors/{formData.slug || 'slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School *
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter school name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Info
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Phone number or other contact"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h2>
              
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                <div>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        handleImageUpload(Array.from(files))
                      }
                    }}
                    className="hidden"
                    disabled={imageUploading}
                  />
                  <label
                    htmlFor="profileImage"
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                      imageUploading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {imageUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        {profileImage ? 'Change Image' : 'Upload Image'}
                      </>
                    )}
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG up to 4MB
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bio</h2>
              
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Tell us about the ambassador..."
              />
            </div>

            {/* TIC Points */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-gray-600" />
                TIC Points
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial TIC Points
                </label>
                <input
                  type="number"
                  value={formData.ticPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticPoints: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="0"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This can be updated later by admins
                </p>
              </div>
            </div>

            {/* Spotlight Contributions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-blue-600" />
                Spotlight Contributions (Optional)
              </h2>
              
              <p className="text-sm text-gray-600 mb-4">
                Add major contributions that should be highlighted on the public ambassadors page
              </p>

              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={newContribution.title}
                    onChange={(e) => setNewContribution(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Contribution title"
                  />
                  <input
                    type="date"
                    value={newContribution.date}
                    onChange={(e) => setNewContribution(prev => ({ ...prev, date: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <Button type="button" onClick={addContribution} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <textarea
                  value={newContribution.description}
                  onChange={(e) => setNewContribution(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Contribution description..."
                />
              </div>
              
              <div className="space-y-2">
                {formData.spotlightContributions.map((contribution, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{contribution.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{contribution.description}</p>
                      {contribution.date && (
                        <p className="text-xs text-gray-500">{contribution.date}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeContribution(index)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
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
                    Twitter
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
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
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

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active ambassador (visible to public)
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin/ambassadors">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading || !formData.name || !formData.email || !formData.slug || !formData.school} className="bg-gray-900 hover:bg-gray-800 text-white">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Ambassador
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default NewAmbassadorPage

