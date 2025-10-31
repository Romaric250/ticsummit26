'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { motion } from 'framer-motion'
import { Plus, FileText, Edit2, Trash2, Search, Loader2, Eye } from 'lucide-react'
import { UploadCloud, Undo2 } from 'lucide-react'
import { toast } from 'sonner'
import { BlogFormModal } from '@/components/admin/BlogFormModal'
import { BlogPreviewModal } from '@/components/admin/BlogPreviewModal'
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  publishedAt?: string
  views: number
  likesCount: number
  readTime?: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  _count?: {
    comments: number
    likes: number
  }
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmPublishId, setConfirmPublishId] = useState<string | null>(null)
  const [publishTargetState, setPublishTargetState] = useState<'publish' | 'unpublish'>('publish')
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<string | undefined>(undefined)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null)

  // Fetch blog posts from API
  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blogs')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data || [])
      } else {
        toast.error('Failed to fetch blog posts')
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      toast.error('Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    try {
      setDeletingId(postId)
      const response = await fetch(`/api/blogs/${postId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Blog post deleted successfully')
        setPosts(posts.filter((post) => post.id !== postId))
      } else {
        toast.error(data.error || 'Failed to delete blog post')
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
      toast.error('Failed to delete blog post')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const handleTogglePublish = async (postId: string, target: 'publish' | 'unpublish') => {
    try {
      setPublishingId(postId)
      const response = await fetch(`/api/blogs/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: target === 'publish',
          publishedAt: target === 'publish' ? new Date().toISOString() : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(target === 'publish' ? 'Blog post published' : 'Blog post set to draft')
        setPosts(posts.map(p => p.id === postId ? {
          ...p,
          published: target === 'publish',
          publishedAt: target === 'publish' ? new Date().toISOString() : undefined,
        } : p))
      } else {
        toast.error(data.error || 'Failed to update publish status')
      }
    } catch (error) {
      console.error('Error updating publish status:', error)
      toast.error('Failed to update publish status')
    } finally {
      setPublishingId(null)
      setConfirmPublishId(null)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && post.published) ||
                         (filterStatus === 'draft' && !post.published)
    return matchesSearch && matchesFilter
  })

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 relative pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-gray-600 mt-1">Create, edit, and manage your blog posts</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingPostId(undefined)
                  setIsModalOpen(true)
                }}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                New Post
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('published')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'published'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'draft'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>

        {/* Blog Posts List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-6 animate-pulse">
                    <div className="flex items-start justify-between gap-4">
                      {/* Image Skeleton */}
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                        <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Featured Image */}
                    {post.image ? (
                      <div className="flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                        <span>{post.author.name || 'Unknown Author'}</span>
                        <span>•</span>
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.published && (
                          <>
                            <span>•</span>
                            <span>{post.views} views</span>
                          </>
                        )}
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setPreviewPost(post)
                          setIsPreviewOpen(true)
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        aria-label={`Preview ${post.title}`}
                      >
                        <Eye className="h-5 w-5" />
                      </motion.button>
                      {post.published ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setPublishTargetState('unpublish')
                            setConfirmPublishId(post.id)
                          }}
                          className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                          aria-label={`Unpublish ${post.title}`}
                          disabled={publishingId === post.id}
                        >
                          <Undo2 className="h-5 w-5" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setPublishTargetState('publish')
                            setConfirmPublishId(post.id)
                          }}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all cursor-pointer"
                          aria-label={`Publish ${post.title}`}
                          disabled={publishingId === post.id}
                        >
                          <UploadCloud className="h-5 w-5" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingPostId(post.id)
                          setIsModalOpen(true)
                        }}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit2 className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirmDeleteId(post.id)}
                        disabled={deletingId === post.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery || filterStatus !== 'all' 
                      ? 'No blog posts match your filters' 
                      : 'No blog posts yet. Create your first one!'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog Form Modal */}
      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPostId(undefined)
        }}
        onSuccess={() => {
          fetchBlogPosts()
        }}
        blogId={editingPostId}
      />

      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setPreviewPost(null)
        }}
        post={previewPost || undefined}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete blog post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmLabel={deletingId ? "Deleting..." : "Delete"}
        isLoading={!!deletingId}
        onConfirm={() => {
          if (confirmDeleteId) {
            handleDelete(confirmDeleteId)
          }
        }}
      />

      {/* Publish/Unpublish Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!confirmPublishId}
        onClose={() => setConfirmPublishId(null)}
        title={publishTargetState === 'publish' ? 'Publish blog post' : 'Unpublish blog post'}
        description={publishTargetState === 'publish' 
          ? 'Are you sure you want to publish this blog post? It will be visible publicly.'
          : 'Are you sure you want to unpublish this blog post? It will be removed from public view.'}
        confirmLabel={publishingId ? (publishTargetState === 'publish' ? 'Publishing...' : 'Updating...') : (publishTargetState === 'publish' ? 'Publish' : 'Set as draft')}
        isLoading={!!publishingId}
        onConfirm={() => {
          if (confirmPublishId) {
            handleTogglePublish(confirmPublishId, publishTargetState)
          }
        }}
      />
    </Layout>
  )
}