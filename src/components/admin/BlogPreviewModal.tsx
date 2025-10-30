"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X, Calendar, Eye, Tag } from "lucide-react"
import Image from "next/image"

interface BlogPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  post?: {
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
    author?: {
      id: string
      name: string | null
      image: string | null
    }
  }
}

export const BlogPreviewModal = ({ isOpen, onClose, post }: BlogPreviewModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && post && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Preview: {post.title}</h3>
                <button
                  onClick={onClose}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  aria-label="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[80vh] overflow-y-auto">
                {post.image && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                )}

                <div className="px-6 py-6">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.readTime && <span>{post.readTime}</span>}
                    <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {post.views} views</span>
                    <span className="inline-flex items-center gap-1">❤ {post.likesCount}</span>
                  </div>

                  <h1 className="mt-3 text-3xl font-bold text-gray-900">{post.title}</h1>
                  <p className="mt-2 text-gray-700">{post.excerpt}</p>

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 bg-gray-50">
                          <Tag className="h-3 w-3" /> {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Render HTML content */}
                  <article className="prose prose-lg max-w-none mt-6 text-gray-900 prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6 prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5 prose-p:text-gray-800 prose-p:mb-4 prose-p:leading-relaxed prose-p:min-h-[1.5rem] prose-strong:text-gray-900 prose-a:text-blue-600 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800 prose-blockquote:text-gray-700 prose-code:text-gray-900">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </article>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


