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
  const [postsToShow, setPostsToShow] = useState(6)
  const [posts, setPosts] = useState<BlogPostItem[]>([])
  const [subscribeEmail, setSubscribeEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch blogs from API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/blogs')
        const json = await res.json()
        if (json?.success) {
          // Only show published blogs
          setPosts((json.data as BlogPostItem[]).filter((p) => p.published))
        }
      } catch (e) {
        console.error("Error loading posts:", e)
      } finally {
        setLoading(false)
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
        ease: [0.16, 1, 0.3, 1] as const, // easeOut cubic-bezier equivalent
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
        <section className="relative py-8 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
                Discover the latest news, success stories, and insights from the TIC Summit community
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-6 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative sm:w-48">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white text-gray-900"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="space-y-12">
                {/* Featured Posts Skeleton */}
                <div>
                  <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-8" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="w-full h-48 bg-gray-200 animate-pulse" />
                        <div className="p-6 space-y-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                          <div className="flex gap-4 mt-4">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Regular Posts Skeleton */}
                <div>
                  <div className="h-8 w-40 bg-gray-300 rounded animate-pulse mb-8" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="w-full h-40 bg-gray-200 animate-pulse" />
                        <div className="p-6 space-y-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
                          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                            {/* Featured Badge */}
                            <div className="relative">
                              <img
                                src={post.image || "https://placehold.co/400x200"}
                                alt={post.title}
                                className="w-full h-40 object-cover"
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

                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={post.author?.image || "https://placehold.co/48x48"}
                                    alt={post.author?.name || "Author"}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className="line-clamp-1">{post.author?.name || 'Unknown Author'}</span>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-xs">{formatDate(post.publishedAt || post.createdAt)}</span>
                                </div>
                              </div>

                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2 min-h-[3rem]">
                                {post.title}
                              </h3>

                              <p className="text-gray-600 mb-3 line-clamp-2 flex-1">
                                {post.excerpt}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4 min-h-[1.75rem]">
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
                              <div className="flex items-center justify-between mt-auto">
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
                          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                            <div className="relative">
                              <img
                                src={post.image || "https://placehold.co/400x200"}
                                alt={post.title}
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute top-4 right-4">
                                <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                  {post.category}
                                </span>
                              </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={post.author?.image || "https://placehold.co/48x48"}
                                    alt={post.author?.name || "Author"}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className="line-clamp-1">{post.author?.name || 'Unknown Author'}</span>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-xs">{formatDate(post.publishedAt || post.createdAt)}</span>
                                </div>
                              </div>

                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2 min-h-[3rem]">
                                {post.title}
                              </h3>

                              <p className="text-gray-600 mb-3 line-clamp-2 flex-1">
                                {post.excerpt}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4 min-h-[1.75rem]">
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
                              <div className="flex items-center justify-between mt-auto">
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
            )}
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
