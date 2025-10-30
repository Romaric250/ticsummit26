"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Search, 
  Filter,
  ArrowRight,
  Eye,
  Heart,
  Share2,
  BookOpen,
  Code,
  Lightbulb,
  Users,
  Award,
  Globe,
  Zap,
  Rocket,
  Target,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { toast } from "sonner"

// Loaded from API
interface BlogPostItem {
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
  author: { id: string; name: string | null; image: string | null }
}

const categories = [
  "All",
  "Announcements", 
  "Mentorship", 
  "Student Projects", 
  "Community", 
  "Partnerships", 
  "Events"
]

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [postsToShow, setPostsToShow] = useState(6)
  const [posts, setPosts] = useState<BlogPostItem[]>([])
  const [subscribeEmail, setSubscribeEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)

  // Fetch blogs from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/blogs')
        const json = await res.json()
        if (json?.success) {
          // Only show published blogs
          setPosts((json.data as BlogPostItem[]).filter((p) => p.published))
        }
      } catch (e) {
        // noop minimal UI change
      }
    }
    load()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)
  const displayedPosts = [...featuredPosts, ...regularPosts].slice(0, postsToShow)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gray-900 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">TIC Summit Blog</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-white">Stories of</span>
                <span className="block text-white">Innovation</span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover the latest news, success stories, and insights from the TIC Summit community
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{posts.length} Articles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>10K+ Views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Expert Authors</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    {showFilters ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                    Advanced Filters
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                          <option>Latest</option>
                          <option>Most Popular</option>
                          <option>Most Liked</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                          <option>All Time</option>
                          <option>This Month</option>
                          <option>Last 3 Months</option>
                          <option>This Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                          <option>Any Length</option>
                          <option>Under 5 min</option>
                          <option>5-10 min</option>
                          <option>Over 10 min</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        variants={itemVariants}
                        className="group"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
                            {/* Featured Badge */}
                            <div className="relative">
                              <img
                                src={post.image || "https://placehold.co/400x200"}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Featured
                                </span>
                              </div>
                              <div className="absolute top-4 right-4">
                                <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                  {post.category}
                                </span>
                              </div>
                            </div>

                            <div className="p-6">
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={post.author?.image || "https://placehold.co/48x48"}
                                    alt={post.author?.name || "Author"}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span>{post.author?.name || 'Unknown Author'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{post.readTime || ''}</span>
                                </div>
                              </div>

                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                                {post.title}
                              </h3>

                              <p className="text-gray-600 mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.views}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{post.likesCount}</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              {regularPosts.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.slice(0, postsToShow - featuredPosts.length).map((post, index) => (
                      <motion.article
                        key={post.id}
                        variants={itemVariants}
                        className="group"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
                            <div className="relative">
                              <img
                                src={post.image || "https://placehold.co/400x200"}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-4 right-4">
                                <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                  {post.category}
                                </span>
                              </div>
                            </div>

                            <div className="p-6">
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={post.author?.image || "https://placehold.co/48x48"}
                                    alt={post.author?.name || "Author"}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span>{post.author?.name || 'Unknown Author'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                </div>
                              </div>

                              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                                {post.title}
                              </h3>

                              <p className="text-gray-600 mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 2).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 2 && (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                    +{post.tags.length - 2}
                                  </span>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readTime || ''}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.views}</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {displayedPosts.length < filteredPosts.length && (
                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => setPostsToShow(postsToShow + 6)}
                  >
                    Load More Articles
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}

              {/* No Results */}
              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No articles found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get the latest TIC Summit news, success stories, and insights delivered to your inbox
              </p>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!subscribeEmail || !subscribeEmail.includes('@')) {
                    toast.error("Please enter a valid email address")
                    return
                  }
                  try {
                    setSubscribing(true)
                    const res = await fetch('/api/newsletter/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: subscribeEmail })
                    })
                    const json = await res.json()
                    if (json.success) {
                      toast.success("Successfully subscribed to our newsletter!")
                      setSubscribeEmail("")
                    } else {
                      toast.error(json.error || "Failed to subscribe")
                    }
                  } catch (error) {
                    console.error("Error subscribing:", error)
                    toast.error("Failed to subscribe")
                  } finally {
                    setSubscribing(false)
                  }
                }}
                className="max-w-md mx-auto"
              >
                <div className="flex gap-4">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <Button 
                    type="submit"
                    disabled={subscribing}
                    className="bg-white hover:bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default BlogPage
