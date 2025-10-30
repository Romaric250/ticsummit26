"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, AlertCircle, Eye } from "lucide-react"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { TagsInput } from "@/components/ui/TagsInput"
import { BlogEditor } from "@/components/ui/BlogEditor"
import { toast } from "sonner"

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

interface BlogFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  blogId?: string
}

export const BlogFormModal = ({ isOpen, onClose, onSuccess, blogId }: BlogFormModalProps) => {
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

  // Fetch blog data if editing
  useEffect(() => {
    if (isOpen && blogId) {
      fetchBlogPost()
    } else if (isOpen && !blogId) {
      // Reset form for new post
      setFormData({
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
      setErrors({})
    }
  }, [isOpen, blogId])

  const fetchBlogPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blogs/${blogId}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const post = data.data
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          image: post.image || "",
          category: post.category || "",
          tags: post.tags || [],
          featured: post.featured || false,
          published: post.published || false,
          publishedAt: post.publishedAt || "",
          readTime: post.readTime || ""
        })
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      toast.error("Failed to load blog post")
    } finally {
      setLoading(false)
    }
  }

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

  // Helper function to check if HTML content has meaningful text
  const hasTextContent = (html: string): boolean => {
    if (!html || !html.trim()) return false
    
    // Create a temporary DOM element to extract text content
    const doc = new DOMParser().parseFromString(html, "text/html")
    const textContent = doc.body.textContent || doc.body.innerText || ""
    
    // Check if there's any meaningful text (more than just whitespace)
    return textContent.trim().length > 0
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Blog title is required"
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Blog excerpt is required"
    }
    
    // Check if HTML content has meaningful text
    if (!hasTextContent(formData.content)) {
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
      const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs"
      const method = blogId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
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
        toast.success(blogId ? "Blog post updated successfully" : "Blog post created successfully")
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || "Failed to save blog post")
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast.error("Failed to save blog post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {blogId ? "Edit Blog Post" : "New Blog Post"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {blogId ? "Update your blog post" : "Create a new blog post"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("published", !formData.published)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    formData.published
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1.5" />
                  {formData.published ? "Published" : "Draft"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Blog Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => handleInputChange("image", url)}
                    disabled={loading}
                  />
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter blog title"
                    />
                    {errors.title && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </div>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="url-slug"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.category ? "border-red-500" : "border-gray-300"
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
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.category}
                      </div>
                    )}
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => handleInputChange("readTime", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 5 min read"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                      errors.excerpt ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Brief description of the blog post..."
                  />
                  {errors.excerpt && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.excerpt}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  {loading && blogId ? (
                    <div className="w-full min-h-[500px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Loading content...</p>
                      </div>
                    </div>
                  ) : (
                    <BlogEditor
                      key={blogId || `new-${isOpen}`} // Force remount when switching between new/edit or opening modal
                      content={formData.content}
                      onChange={(content) => handleInputChange("content", content)}
                      placeholder="Start writing your blog post..."
                    />
                  )}
                  {errors.content && (
                    <div className="flex items-center mt-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.content}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange("featured", e.target.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Post</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => handleInputChange("published", e.target.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Publish Now</span>
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
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {blogId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {formData.published ? (blogId ? "Update & Publish" : "Publish Post") : (blogId ? "Update Draft" : "Save Draft")}
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

