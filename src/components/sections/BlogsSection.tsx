'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, ArrowRight, Tag, Search } from 'lucide-react'
import { BlogPost } from '@/types'
import { formatDate } from '@/lib/utils'
import BlogEditor from '@/components/blogs/BlogEditor'

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Software Development',
    excerpt: 'Exploring how artificial intelligence is revolutionizing the way we write, test, and deploy code.',
    content: 'Full article content here...',
    author: 'Sarah Johnson',
    publishedAt: new Date('2024-01-15'),
    image: '/api/placeholder/600/400',
    tags: ['AI', 'Software Development', 'Future Tech'],
    readTime: 8,
    featured: true
  },
  {
    id: '2',
    title: 'Building Scalable Microservices Architecture',
    excerpt: 'Best practices and patterns for designing microservices that can handle massive scale.',
    content: 'Full article content here...',
    author: 'Michael Chen',
    publishedAt: new Date('2024-01-12'),
    image: '/api/placeholder/600/400',
    tags: ['Architecture', 'Microservices', 'Scalability'],
    readTime: 12,
    featured: true
  },
  {
    id: '3',
    title: 'Design Systems: Creating Consistency at Scale',
    excerpt: 'How to build and maintain design systems that work across teams and products.',
    content: 'Full article content here...',
    author: 'Emily Rodriguez',
    publishedAt: new Date('2024-01-10'),
    image: '/api/placeholder/600/400',
    tags: ['Design', 'UX', 'Systems'],
    readTime: 6,
    featured: false
  },
  {
    id: '4',
    title: 'The Rise of Edge Computing',
    excerpt: 'Understanding how edge computing is changing the landscape of cloud infrastructure.',
    content: 'Full article content here...',
    author: 'David Kim',
    publishedAt: new Date('2024-01-08'),
    image: '/api/placeholder/600/400',
    tags: ['Edge Computing', 'Cloud', 'Infrastructure'],
    readTime: 10,
    featured: false
  },
  {
    id: '5',
    title: 'Data Science in the Age of Big Data',
    excerpt: 'Modern approaches to extracting insights from massive datasets.',
    content: 'Full article content here...',
    author: 'Lisa Wang',
    publishedAt: new Date('2024-01-05'),
    image: '/api/placeholder/600/400',
    tags: ['Data Science', 'Big Data', 'Analytics'],
    readTime: 9,
    featured: false
  },
  {
    id: '6',
    title: 'Product Management in Tech Startups',
    excerpt: 'Strategies for managing products in fast-paced startup environments.',
    content: 'Full article content here...',
    author: 'Alex Thompson',
    publishedAt: new Date('2024-01-03'),
    image: '/api/placeholder/600/400',
    tags: ['Product Management', 'Startups', 'Strategy'],
    readTime: 7,
    featured: false
  }
]

const categories = [
  { id: 'all', label: 'All Posts', count: blogPosts.length },
  { id: 'featured', label: 'Featured', count: blogPosts.filter(post => post.featured).length },
  { id: 'AI', label: 'AI & ML', count: blogPosts.filter(post => post.tags.includes('AI')).length },
  { id: 'Architecture', label: 'Architecture', count: blogPosts.filter(post => post.tags.includes('Architecture')).length },
  { id: 'Design', label: 'Design', count: blogPosts.filter(post => post.tags.includes('Design')).length },
  { id: 'Data Science', label: 'Data Science', count: blogPosts.filter(post => post.tags.includes('Data Science')).length }
]

export default function BlogsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editorContent, setEditorContent] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'featured' ? post.featured : post.tags.includes(selectedCategory))
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <section id="blogs" className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, insights, and thought leadership 
            from industry experts and conference speakers.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Post */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            {(() => {
              const featuredPost = blogPosts.find(post => post.featured)
              if (!featuredPost) return null

              return (
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPost(featuredPost)}
                >
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDate(featuredPost.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{featuredPost.readTime} min read</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg">{featuredPost.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700 font-medium">{featuredPost.author}</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })()}
          </motion.div>
        )}

        {/* Blog Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {post.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{post.author}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary-600 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12 flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditorOpen(true)}
            className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Create New Post
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-600"
          >
            Load More Articles
          </motion.button>
        </motion.div>
      </div>

      {/* Blog Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="mb-6">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(selectedPost.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{selectedPost.readTime} min read</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{selectedPost.author}</span>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedPost.title}
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-6">
                    {selectedPost.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p>{selectedPost.content}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="h-full w-full">
              <BlogEditor
                initialContent={editorContent}
                onSave={(content) => {
                  setEditorContent(content)
                  setIsEditorOpen(false)
                  // Here you would save to your database/state management
                  console.log('Saving content:', content)
                }}
                onCancel={() => setIsEditorOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
