import { Metadata } from 'next'
import { generateBlogMetadata } from '@/lib/seo'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        category: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        readTime: true,
        authorName: true, // Include authorName field
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!post) {
      return {
        title: 'Blog Post Not Found',
      }
    }

    const blogPost: any = {
      ...post,
      views: 0,
      likesCount: 0,
      authorName: post.authorName || null, // Include authorName if available
      author: {
        id: '',
        name: post.author?.name,
        image: post.author?.image,
      },
    }

    return generateBlogMetadata(blogPost)
  } catch (error) {
    console.error('Error generating blog metadata:', error)
    return {
      title: 'Blog Post',
    }
  } finally {
    await prisma.$disconnect()
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

