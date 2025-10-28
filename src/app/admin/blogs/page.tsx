'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { motion } from 'framer-motion'
import { Plus, FileText, Edit2, Trash2, Search, Filter } from 'lucide-react'
import BlogEditor from '@/components/blogs/BlogEditor'

// Mock blog posts - in production this would come from your database
const mockBlogPosts = [
  {
    id: '1',
    title: 'The Future of AI in Software Development',
    excerpt: 'Exploring how artificial intelligence is revolutionizing...',
    author: 'Sarah Johnson',
    publishedAt: '2024-01-15',
    status: 'published',
    views: 1250
  },
  {
    id: '2',
    title: 'Building Scalable Microservices Architecture',
    excerpt: 'Best practices and patterns for designing microservices...',
    author: 'Michael Chen',
    publishedAt: '2024-01-12',
    status: 'draft',
    views: 0
  },
  {
    id: '3',
    title: 'Design Systems: Creating Consistency at Scale',
    excerpt: 'How to build and maintain design systems...',
    author: 'Emily Rodriguez',
    publishedAt: '2024-01-10',
    status: 'published',
    views: 890
  }
]

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState(mockBlogPosts)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreate = () => {
    setSelectedPost(null)
    setIsEditorOpen(true)
  }

  const handleEdit = (post: any) => {
    setSelectedPost(post)
    setIsEditorOpen(true)
  }

  const handleSave = (content: string) => {
    console.log('Saving content:', content)
    // Here you would save to your database
    setIsEditorOpen(false)
    setSelectedPost(null)
  }

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

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
                onClick={handleCreate}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md"
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.publishedAt}</span>
                        {post.status === 'published' && (
                          <>
                            <span>•</span>
                            <span>{post.views} views</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(post)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Edit2 className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No blog posts found</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-[70vw] h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <BlogEditor
              initialContent={''}
              onSave={handleSave}
              onCancel={() => {
                setIsEditorOpen(false)
                setSelectedPost(null)
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  )
}