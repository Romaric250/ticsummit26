"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, AlertCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { TagsInput } from "@/components/ui/TagsInput"
import { BlogEditor } from "@/components/ui/BlogEditor"
import Link from "next/link"

interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  publishedAt: string
  readTime: string
}

const AddBlogPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    tags: [],
    featured: false,
    published: false,
    publishedAt: "",
    readTime: ""
  })

  const categories = ["Technology", "AI", "Web Development", "Mobile", "Design", "Business", "Other"]

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Blog title is required"
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Blog excerpt is required"
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Blog content is required"
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof BlogFormData, value: string | string[] | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-generate slug when title changes
      if (field === "title" && typeof value === "string") {
        newData.slug = generateSlug(value)
      }
      
      // Auto-calculate read time when content changes
      if (field === "content" && typeof value === "string") {
        newData.readTime = calculateReadTime(value)
      }
      
      return newData
    })
    
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
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.published ? new Date().toISOString() : null
        })
      })

      const data = await response.json()
      
      if (data.success) {
        router.push("/admin/blogs")
      } else {
        console.error("Error creating blog post:", data.error)
      }
    } catch (error) {
      console.error("Error creating blog post:", error)
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
              <Link href="/admin/blogs">
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
                  New Blog Post
                </h1>
                <p className="text-sm text-gray-400">
                  Create a new blog post
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={() => handleInputChange("published", !formData.published)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {formData.published ? "Published" : "Draft"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Blog Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Featured Image
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
                  Blog Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                  placeholder="Enter blog title"
                />
                {errors.title && (
                  <div className="flex items-center mt-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </div>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="url-slug"
                />
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

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => handleInputChange("readTime", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Excerpt *
              </label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none ${
                  errors.excerpt ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                }`}
                placeholder="Brief description of the blog post..."
              />
              {errors.excerpt && (
                <div className="flex items-center mt-1 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.excerpt}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <TagsInput
                value={formData.tags}
                onChange={(tags) => handleInputChange("tags", tags)}
                placeholder="Add tags (e.g., React, JavaScript, etc.)"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content *
              </label>
              <BlogEditor
                content={formData.content}
                onChange={(content) => handleInputChange("content", content)}
                placeholder="Start writing your blog post..."
              />
              {errors.content && (
                <div className="flex items-center mt-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.content}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange("featured", e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-300">Featured Post</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => handleInputChange("published", e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-300">Publish Now</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              <Link href="/admin/blogs">
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
                    {formData.published ? "Publish Post" : "Save Draft"}
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

export default AddBlogPage
