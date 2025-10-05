"use client"

import { useState } from "react"
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

// Mock blog post data - in real app, this would come from API/database
const blogPostData = {
  "tic-summit-2026-launch": {
    id: "tic-summit-2026-launch",
    title: "TIC Summit 2026: Launching Cameroon's Biggest Tech Innovation Program",
    excerpt: "We're excited to announce the launch of TIC Summit 2026, our most ambitious program yet. This year, we're expanding to reach over 5,000 students across Cameroon.",
    content: `
      <p>We're thrilled to announce the official launch of TIC Summit 2026, marking our most ambitious and comprehensive tech innovation program to date. This year, we're taking our mission to empower young innovators to unprecedented heights.</p>
      
      <h2>What's New in 2026?</h2>
      <p>Building on the incredible success of previous editions, TIC Summit 2026 introduces several groundbreaking initiatives:</p>
      
      <h3>Expanded Reach</h3>
      <p>We're proud to announce that this year's program will reach over 5,000 students across Cameroon, representing a 40% increase from last year. Our expanded outreach includes:</p>
      <ul>
        <li>50+ secondary and high schools nationwide</li>
        <li>100+ TICTAP tech clubs</li>
        <li>6 regional mini hackathons</li>
        <li>Pan-African collaboration opportunities</li>
      </ul>
      
      <h3>Enhanced Mentorship Program</h3>
      <p>Our mentorship program has been completely redesigned to provide more personalized guidance. Each student will now have access to:</p>
      <ul>
        <li>Dedicated industry mentors</li>
        <li>Weekly one-on-one sessions</li>
        <li>Technical skill workshops</li>
        <li>Career guidance and networking</li>
      </ul>
      
      <h3>Innovation Focus Areas</h3>
      <p>This year, we're focusing on cutting-edge technologies that will shape the future:</p>
      <ul>
        <li>Artificial Intelligence and Machine Learning</li>
        <li>Blockchain and Web3 Technologies</li>
        <li>Cybersecurity and Digital Forensics</li>
        <li>Sustainable Technology Solutions</li>
        <li>Mobile and Web Development</li>
      </ul>
      
      <h2>Timeline Overview</h2>
      <p>The TIC Summit 2026 journey spans 11 months, from January to November 2025, with each phase carefully designed to maximize learning and innovation.</p>
      
      <h2>How to Get Involved</h2>
      <p>Whether you're a student, mentor, or supporter, there are multiple ways to be part of this incredible journey:</p>
      
      <h3>For Students</h3>
      <p>Registration is now open! Students can join through their school's TICTAP club or register directly on our website.</p>
      
      <h3>For Mentors</h3>
      <p>We're always looking for passionate industry professionals to guide our students. Apply to become a mentor today.</p>
      
      <h3>For Supporters</h3>
      <p>Help us make this program even more impactful by supporting our initiatives or partnering with us.</p>
      
      <p>Join us in building the future of tech innovation in Cameroon. Together, we can empower the next generation of African tech leaders.</p>
    `,
    author: "TIC Summit Team",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    authorBio: "The TIC Summit team is dedicated to empowering young innovators across Cameroon through technology education and mentorship.",
    publishDate: "2024-12-15",
    readTime: "5 min read",
    category: "Announcements",
    tags: ["TIC Summit", "Innovation", "Students", "Cameroon"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    views: 1250,
    likes: 89,
    featured: true
  },
  "mentorship-program-success": {
    id: "mentorship-program-success",
    title: "How Our Mentorship Program is Transforming Tech Education in Cameroon",
    excerpt: "Discover how our industry mentors are making a real difference in students' lives and preparing the next generation of tech innovators.",
    content: `
      <p>Our mentorship program has become the cornerstone of TIC Summit's success, creating lasting impact in the lives of thousands of students across Cameroon.</p>
      
      <h2>The Power of Mentorship</h2>
      <p>Mentorship goes beyond teaching technical skills. It's about inspiring, guiding, and empowering students to reach their full potential.</p>
      
      <h3>Success Stories</h3>
      <p>Meet some of our incredible students who have transformed their lives through our mentorship program...</p>
      
      <h2>Our Mentor Network</h2>
      <p>We're proud to have industry leaders from top tech companies guiding our students.</p>
      
      <h2>Impact Metrics</h2>
      <p>The numbers speak for themselves:</p>
      <ul>
        <li>95% of mentored students pursue tech careers</li>
        <li>80% report increased confidence in their abilities</li>
        <li>70% start their own tech projects</li>
        <li>60% become mentors themselves</li>
      </ul>
    `,
    author: "Dr. Patricia Nguema",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    authorBio: "Dr. Patricia Nguema is a Senior Tech Executive with 15+ years of experience transforming organizations through technology.",
    publishDate: "2024-12-10",
    readTime: "7 min read",
    category: "Mentorship",
    tags: ["Mentorship", "Education", "Success Stories"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    views: 980,
    likes: 67,
    featured: false
  }
  // Add more blog posts as needed
}

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const post = blogPostData[params.slug as keyof typeof blogPostData]
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likes || 0)
  
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

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true)
      setLikeCount(likeCount + 1)
    } else {
      setIsLiked(false)
      setLikeCount(likeCount - 1)
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
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{post.author}</p>
                    <p className="text-sm text-white/70">{post.authorBio}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishDate)}</span>
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
              <motion.article variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <div 
                  className="prose prose-lg max-w-none"
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
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.author}</h4>
                    <p className="text-sm text-gray-600 mt-1">{post.authorBio}</p>
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
