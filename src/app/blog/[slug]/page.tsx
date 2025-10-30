"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  User, 
  Tag, 
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
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"

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

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const [post, setPost] = useState<BlogPostItem | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/blogs/slug/${params.slug}`)
        const json = await res.json()
        if (json?.success) {
          const p: BlogPostItem = json.data
          setPost(p)
          setLikeCount(p.likesCount || 0)
          // increment views (no auth)
          fetch('/api/blogs/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blogId: p.id })
          }).catch(() => {})
        }
      } catch {}
    }
    load()
  }, [params.slug])
  
  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const handleLike = async () => {
    try {
      const res = await fetch('/api/blogs/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: post.id })
      })
      if (res.status === 401) {
        // not authenticated
        return
      }
      const json = await res.json()
      if (json?.success) {
        setIsLiked(json.data.liked)
        setLikeCount(json.data.likesCount)
      }
    } catch {}
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/blog" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-white"
            >
              {/* Category Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Tag className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">{post.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.author?.image || "https://placehold.co/80x80"}
                    alt={post.author?.name || 'Author'}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{post.author?.name || 'Unknown Author'}</p>
                    <p className="text-sm text-white/70">&nbsp;</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-4 gap-12"
          >
            {/* Article Content */}
            <div className="lg:col-span-3">
              <style dangerouslySetInnerHTML={{__html: `
                .blog-content h1 {
                  font-size: 2.25rem !important;
                  line-height: 2.5rem !important;
                  font-weight: 700 !important;
                  margin-top: 2rem !important;
                  margin-bottom: 1.5rem !important;
                  color: #111827 !important;
                }
                .blog-content h2 {
                  font-size: 1.875rem !important;
                  line-height: 2.25rem !important;
                  font-weight: 700 !important;
                  margin-top: 1.5rem !important;
                  margin-bottom: 1rem !important;
                  color: #111827 !important;
                }
                .blog-content h3 {
                  font-size: 1.5rem !important;
                  line-height: 2rem !important;
                  font-weight: 700 !important;
                  margin-top: 1.25rem !important;
                  margin-bottom: 0.75rem !important;
                  color: #111827 !important;
                }
              `}} />
              <motion.article variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <div 
                  className="blog-content prose prose-lg max-w-none text-gray-900 prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-800 prose-p:mb-4 prose-p:leading-relaxed prose-p:min-h-[1.5rem] prose-strong:text-gray-900 prose-a:text-blue-600 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800 prose-blockquote:text-gray-700 prose-code:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </motion.article>

              {/* Tags */}
              <motion.div variants={itemVariants} className="mt-8">
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div variants={itemVariants} className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className={`border-gray-300 ${isLiked ? 'text-red-500 border-red-300' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {likeCount} Likes
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {post.views} views
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Author Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={post.author?.image || "https://placehold.co/80x80"}
                    alt={post.author?.name || 'Author'}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.author?.name || 'Unknown Author'}</h4>
                    <p className="text-sm text-gray-600 mt-1">&nbsp;</p>
                  </div>
                </div>
              </motion.div>

              {/* Related Articles */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop"
                      alt="Related article"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        Student Success Stories from TIC Summit 2025
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">Dec 8, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop"
                      alt="Related article"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        Building Tech Communities in Schools
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">Dec 5, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop"
                      alt="Related article"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        The Future of Tech Education in Africa
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">Dec 2, 2024</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                <p className="text-white/90 mb-4">
                  Get the latest TIC Summit news and insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <Button className="w-full bg-white hover:bg-white text-gray-900">
                    Subscribe
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default BlogPostPage
