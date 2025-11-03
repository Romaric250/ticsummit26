import { Metadata } from 'next'

// Blog post interface for SEO generation
export interface BlogPostItem {
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticsummit.org'
const SITE_NAME = 'TIC Summit'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`
const TWITTER_HANDLE = '@ticsummit'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

/**
 * Generate comprehensive metadata for any page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_OG_IMAGE,
    url = SITE_URL,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noindex = false,
    nofollow = false,
  } = config

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = url

  return {
    title: {
      default: fullTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : [{ name: 'TIC Summit Team' }],
    creator: 'TIC Summit',
    publisher: 'TIC Summit',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'technology',
    classification: 'Technology Conference',
    applicationName: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  }
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(post: BlogPostItem): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`
  const image = post.image || DEFAULT_OG_IMAGE

  return generateMetadata({
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: [post.category, ...post.tags],
    image,
    url,
    type: 'article',
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt,
    author: post.author?.name || 'TIC Summit Team',
    section: post.category,
    tags: post.tags,
  })
}

/**
 * Generate metadata for mentor profiles
 */
export function generateMentorMetadata(mentor: {
  name: string
  bio?: string
  expertise?: string[]
  slug: string
  image?: string
}): Metadata {
  const url = `${SITE_URL}/mentors/${mentor.slug}`
  const description = mentor.bio || `Learn from ${mentor.name}, an expert mentor at TIC Summit.`
  const image = mentor.image || DEFAULT_OG_IMAGE

  return generateMetadata({
    title: `${mentor.name} - Mentor`,
    description,
    keywords: ['mentor', 'TIC Summit', ...(mentor.expertise || [])],
    image,
    url,
    type: 'profile',
  })
}

/**
 * Generate metadata for ambassador profiles
 */
export function generateAmbassadorMetadata(ambassador: {
  name: string
  bio?: string
  school: string
  slug: string
  image?: string
}): Metadata {
  const url = `${SITE_URL}/ambassadors/${ambassador.slug}`
  const description = ambassador.bio || `${ambassador.name} is a TIC Summit ambassador from ${ambassador.school}.`
  const image = ambassador.image || DEFAULT_OG_IMAGE

  return generateMetadata({
    title: `${ambassador.name} - Ambassador`,
    description,
    keywords: ['ambassador', 'TIC Summit', ambassador.school],
    image,
    url,
    type: 'profile',
  })
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TIC Summit',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "Cameroon's premier tech innovation program for Secondary and High school students.",
    foundingDate: '2020',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CM',
      },
    },
    sameAs: [
      'https://twitter.com/ticsummit',
      'https://facebook.com/ticsummit',
      'https://linkedin.com/company/ticsummit',
      'https://instagram.com/ticsummit',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@ticsummit.org',
    },
  }
}

/**
 * Generate JSON-LD structured data for Event
 */
export function generateEventSchema(eventData?: {
  name?: string
  startDate?: string
  endDate?: string
  location?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventData?.name || 'TIC Summit 2026',
    description: "Cameroon's premier tech innovation program for Secondary and High school students. Now in its 6th edition.",
    startDate: eventData?.startDate || '2026-03-15T09:00:00+01:00',
    endDate: eventData?.endDate || '2026-03-17T18:00:00+01:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: eventData?.location || 'Cameroon',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CM',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'TIC Summit',
      url: SITE_URL,
    },
    image: DEFAULT_OG_IMAGE,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/register`,
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate JSON-LD structured data for BlogPosting
 */
export function generateBlogPostSchema(post: BlogPostItem) {
  const url = `${SITE_URL}/blog/${post.slug}`
  const image = post.image || DEFAULT_OG_IMAGE

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: image,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'TIC Summit Team',
      ...(post.author?.image && { image: post.author.image }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category,
    keywords: [post.category, ...post.tags].join(', '),
    ...(post.readTime && { timeRequired: post.readTime }),
  }
}

/**
 * Generate JSON-LD structured data for Person (Mentor/Ambassador)
 */
export function generatePersonSchema(data: {
  name: string
  description?: string
  image?: string
  jobTitle?: string
  worksFor?: string
  url?: string
  sameAs?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.image && { image: data.image }),
    ...(data.jobTitle && { jobTitle: data.jobTitle }),
    ...(data.worksFor && {
      worksFor: {
        '@type': 'Organization',
        name: data.worksFor,
      },
    }),
    ...(data.url && { url: data.url }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate WebSite structured data with SearchAction
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

