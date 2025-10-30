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
import { useSession, signIn } from "@/lib/auth-client"
import { ShareModal } from "@/components/ui/ShareModal"
import { toast } from "sonner"

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
  const { data: session } = useSession()
  const [post, setPost] = useState<BlogPostItem | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState<BlogPostItem[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/blogs/slug/${params.slug}`)
        const json = await res.json()
        if (json?.success) {
          const p: BlogPostItem = json.data
          setPost(p)
          setLikeCount(p.likesCount || 0)
          
          // Check like status if authenticated
          if (session?.user) {
            const likeStatusRes = await fetch(`/api/blogs/likes?blogId=${p.id}`)
            const likeStatusData = await likeStatusRes.json()
            if (likeStatusData.success) {
              setIsLiked(likeStatusData.data.liked)
            }
          }
          
          // increment views (no auth)
          fetch('/api/blogs/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blogId: p.id })
          }).catch(() => {})

          // Load related posts
          loadRelatedPosts(p.id)
        }
      } catch {}
    }
    load()
  }, [params.slug, session])

  const loadRelatedPosts = async (excludeId: string) => {
    try {
      setLoadingRelated(true)
      const res = await fetch(`/api/blogs/random?limit=3&excludeId=${excludeId}`)
      const json = await res.json()
      if (json?.success) {
        setRelatedPosts(json.data || [])
      }
    } catch (error) {
      console.error("Error loading related posts:", error)
    } finally {
      setLoadingRelated(false)
    }
  }
  
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
    if (!session?.user) {
      // Not authenticated - redirect to signup
      try {
        await signIn.social({
          provider: "google",
          callbackURL: `/blog/${params.slug}`
        })
      } catch (error) {
        console.error("Sign in error:", error)
        toast.error("Please sign in to like posts")
      }
      return
    }

    try {
      const res = await fetch('/api/blogs/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: post.id })
      })
      if (res.status === 401) {
        toast.error("Please sign in to like posts")
        return
      }
      const json = await res.json()
      if (json?.success) {
        setIsLiked(json.data.liked)
        setLikeCount(json.data.likesCount)
        toast.success(json.data.liked ? "Post liked!" : "Post unliked.")
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to toggle like")
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
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

        {/* Hero Section with Image Side-by-Side */}
        <section className="relative py-8 lg:py-12 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center"
            >
              {/* Cover Image */}
              {post.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-xl"
                  />
                </motion.div>
              )}

              {/* Content Section */}
              <div className="text-white">
                {/* Category Badge */}
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
                  <Tag className="w-3 h-3 text-white" />
                  <span className="text-xs font-medium">{post.category}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-base text-white/90 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs">
                  <div className="flex items-center space-x-2">
                    <img
                      src={post.author?.image || "https://placehold.co/80x80"}
                      alt={post.author?.name || 'Author'}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-white">{post.author?.name || 'Unknown Author'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views} views</span>
                  </div>
                </div>
              </div>
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
                .blog-content pre {
                  background-color: #111827 !important;
                  color: #f3f4f6 !important;
                  border: 1px solid #374151 !important;
                  border-radius: 0.375rem !important;
                  padding: 1.25rem !important;
                  margin: 1rem 0 !important;
                }
                .blog-content pre code {
                  background-color: transparent !important;
                  color: inherit !important;
                  padding: 0 !important;
                }
                .blog-content code:not(pre code) {
                  background-color: #1f2937 !important;
                  color: #f3f4f6 !important;
                  padding: 0.125rem 0.375rem !important;
                  border-radius: 0.25rem !important;
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
                    className={`bg-white border-gray-300 ${isLiked ? 'text-red-500 border-red-300 hover:bg-red-50' : 'text-gray-600 hover:bg-primary hover:text-white hover:border-primary'}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current text-red-500' : 'text-red-500'}`} />
                    {likeCount} Likes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsShareModalOpen(true)}
                    className="bg-white border-gray-300 text-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-600"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="text-base font-medium text-gray-700">
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
                {loadingRelated ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : relatedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                        <div className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                          {relatedPost.image && (
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No related articles found</p>
                )}
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                <p className="text-white/90 mb-4">
                  Get the latest TIC Summit news and insights delivered to your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <Button 
                    type="submit"
                    disabled={subscribing}
                    className="w-full bg-white hover:bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      {post && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={`/blog/${post.slug}`}
          title={post.title}
        />
      )}
    </Layout>
  )
}

export default BlogPostPage
